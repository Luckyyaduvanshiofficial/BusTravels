/**
 * lib/supabase/proxy.ts
 *
 * NOTE: This file is NO LONGER used by middleware.ts.
 * middleware.ts now performs cookie-only auth detection to avoid
 * AuthRetryableFetchError / GoTrueClient retry loops in Edge Runtime.
 *
 * This file is kept as a helper for any future Server Action or
 * Route Handler that needs session-aware cookie forwarding.
 * It uses getSession() (cookie-read, no network) — NOT getUser().
 */

import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

/** Maps roles to their dashboard redirect path */
const roleDashboardMap: Record<string, string> = {
  operator: "/operator/dashboard",
  admin: "/admin/operators",
  customer: "/customer/dashboard",
};

/**
 * A lightweight session-only check (no network call).
 * Used in contexts where calling getUser() is too expensive (e.g., simple
 * server-side cookie presence checks). Falls back to the full updateSession
 * below for middleware/route-handler usage.
 */
export async function updateSessionLegacy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[proxy] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY – skipping session refresh"
    );
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // getSession() reads from the cookie — zero network requests.
  // Never call getUser() here; that makes a fetch to the Auth server
  // which breaks in Edge Runtime and causes infinite retry loops.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = request.nextUrl.pathname;
  const protectedPaths = ["/customer", "/operator/dashboard", "/admin"];
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));

  if (isProtectedPath && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  if (session?.user) {
    const role = session.user.user_metadata?.role as string | undefined;
    const isLoginOrRegister = path === "/login" || path === "/register";
    if (isLoginOrRegister && role) {
      const dest = roleDashboardMap[role] ?? "/customer/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    if (path.startsWith("/operator/dashboard") && role !== "operator") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (path.startsWith("/admin") && !path.startsWith("/admin/login") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}


function getRedirectForAuthPages(user: User, path: string, baseUrl: string): NextResponse | null {
  const isLoginOrRegister = path === "/login" || path === "/register";
  const role = user.user_metadata?.role as string | undefined;
  if (!isLoginOrRegister || !role) return null;
  const dest = roleDashboardMap[role] ?? "/customer/dashboard";
  return NextResponse.redirect(new URL(dest, baseUrl));
}

function getRoleProtectionRedirect(user: User | null, path: string, baseUrl: string): NextResponse | null {
  if (!user) return null;
  const role = user.user_metadata?.role as string | undefined;

  if (path.startsWith("/operator/dashboard") && role !== "operator") {
    return NextResponse.redirect(new URL("/", baseUrl));
  }
  if (path.startsWith("/admin") && !path.startsWith("/admin/login") && role !== "admin") {
    return NextResponse.redirect(new URL("/", baseUrl));
  }
  return null;
}

export async function updateSession(request: NextRequest) {
  // Bail out early if Supabase env vars are missing – prevents fetch errors
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[middleware] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY – skipping auth"
    );
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // IMPORTANT: Do NOT use getSession() here. getUser() sends a request to the
  // Supabase Auth server to revalidate the token which is the recommended
  // approach for middleware. Wrap in try-catch to prevent crashes from network
  // failures (e.g. wrong URL, DNS issues, cold starts).
  let user: User | null = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      user = data.user;
    }
  } catch (err) {
    // Network or fetch error – let the request proceed without auth
    console.warn("[middleware] Auth check failed:", err instanceof Error ? err.message : err);
    return supabaseResponse;
  }

  const path = request.nextUrl.pathname;

  // Redirect unauthenticated users from protected routes
  const protectedPaths = ["/customer", "/operator/dashboard", "/admin"];
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));
  if (isProtectedPath && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route protection
  const roleRedirect = getRoleProtectionRedirect(user, path, request.url);
  if (roleRedirect) return roleRedirect;

  // Redirect authenticated users away from auth pages
  if (user) {
    const authRedirect = getRedirectForAuthPages(user, path, request.url);
    if (authRedirect) return authRedirect;
  }

  return supabaseResponse;
}
