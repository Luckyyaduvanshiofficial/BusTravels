import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/auth/user - Get current user info
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's role from metadata
    const role = user.user_metadata?.role || "customer";

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role,
      name: user.user_metadata?.name || "",
      phone: user.user_metadata?.phone || "",
      created_at: user.created_at,
    });
  } catch (err) {
    console.error("Auth user error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
