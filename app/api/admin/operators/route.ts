import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/operators - List all operators with profiles
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // verified, pending, all
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    let query = supabase
      .from("users")
      .select(
        `
        id, email, name, phone, is_verified, created_at,
        company_name, gst_number, pan_number, address, profile_completion,
        operator_profiles(id, license_number, license_expiry, license_document_url, rc_number, rc_document_url, pan_document_url, gst_document_url, address_proof_url)
      `,
        { count: "exact" }
      )
      .eq("role", "operator")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status === "verified") {
      query = query.eq("is_verified", true);
    } else if (status === "pending") {
      query = query.eq("is_verified", false);
    }

    const { data: operators, count, error } = await query;

    if (error) {
      console.error("List operators error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      operators: operators || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Admin operators error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
