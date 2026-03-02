import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/admin/operators/[id] - Verify/reject an operator
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body; // "verify" | "reject"

    if (!["verify", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'verify' or 'reject'" },
        { status: 400 }
      );
    }

    // Check operator exists
    const { data: operator, error: fetchError } = await supabase
      .from("users")
      .select("id, email, name, role")
      .eq("id", id)
      .eq("role", "operator")
      .single();

    if (fetchError || !operator) {
      return NextResponse.json(
        { error: "Operator not found" },
        { status: 404 }
      );
    }

    if (action === "verify") {
      const { error: updateError } = await supabase
        .from("users")
        .update({ is_verified: true })
        .eq("id", id);

      if (updateError) {
        console.error("Verify operator error:", updateError);
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: `Operator ${operator.name || operator.email} has been verified`,
        operator_id: id,
        is_verified: true,
      });
    } else {
      // reject - set is_verified to false
      const { error: updateError } = await supabase
        .from("users")
        .update({ is_verified: false })
        .eq("id", id);

      if (updateError) {
        console.error("Reject operator error:", updateError);
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: `Operator ${operator.name || operator.email} has been rejected`,
        operator_id: id,
        is_verified: false,
      });
    }
  } catch (error) {
    console.error("Admin operator action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/admin/operators/[id] - Get operator details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const { data: operator, error } = await supabase
      .from("users")
      .select(
        `
        id, email, name, phone, is_verified, created_at,
        company_name, gst_number, pan_number, address, profile_completion,
        operator_profiles(id, license_number, license_expiry, license_document_url, rc_number, rc_document_url, pan_document_url, gst_document_url, address_proof_url),
        buses(id, name, model_name, bus_type, seating_capacity, base_fare, approval_status, home_city)
      `
      )
      .eq("id", id)
      .eq("role", "operator")
      .single();

    if (error || !operator) {
      return NextResponse.json(
        { error: "Operator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(operator);
  } catch (error) {
    console.error("Admin get operator error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
