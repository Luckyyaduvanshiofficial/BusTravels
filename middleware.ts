/**
 * middleware.ts — SAFE, ZERO-FETCH VERSION
 *
 * This middleware intentionally does NOT use the Supabase client.
 * Using createServerClient / supabase.auth.getUser() in Edge Runtime causes:
 *   - AuthRetryableFetchError: fetch failed (status 0)
 *   - Infinite GoTrueClient._refreshAccessToken retry loops
 *   - Thousands of console errors before the page loads
 *
 * Instead, we detect authentication purely by checking whether a valid
 * Supabase session cookie is present.  @supabase/ssr stores the session in:
 *   sb-<project-ref>-auth-token        (full token)
 *   sb-<project-ref>-auth-token.0      (chunked — chunk 0)
 *   sb-<project-ref>-auth-token.1 …    (chunked — subsequent chunks)
 *
 * Actual token validation happens inside each API route / Server Component
 * by calling supabase.auth.getUser() in the Node.js runtime, where fetch works.
 */

import { type NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Route categories
// ---------------------------------------------------------------------------

/** Paths that require any authenticated session */
const PROTECTED_PATHS = ["/customer", "/operator/dashboard", "/admin"];

/** Auth-only paths: authenticated users are shown their own redirect
 *  (handled client-side after session is confirmed — middleware does NOT
 *  redirect here to avoid race conditions on first load) */

// ---------------------------------------------------------------------------
// Cookie detection
// ---------------------------------------------------------------------------

/**
 * Returns true if a Supabase session cookie is present in the request.
 * Matches the cookie naming conventions used by @supabase/ssr:
 *   sb-<any-project-ref>-auth-token[.<chunk-index>]
 */
function hasSupabaseSession(request: NextRequest): boolean {
  const AUTH_COOKIE_PATTERN = /^sb-.+-auth-token(\.\d+)?$/;
  return request.cookies.getAll().some(
    (cookie) =>
      AUTH_COOKIE_PATTERN.test(cookie.name) && cookie.value.length > 0
  );
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected && !hasSupabaseSession(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - api routes    (they handle their own auth via supabase.auth.getUser())
     * - public files  (svg, png, jpg, …)
     */
    String.raw`/((?!_next/static|_next/image|favicon\.ico|api/|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|manifest\.json)$).*)`,
  ],
};
