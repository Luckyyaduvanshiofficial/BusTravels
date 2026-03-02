import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/admin/vehicles/[id] - Approve/reject a vehicle
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
    const { action, rejection_reason } = body; // "approve" | "reject"

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Check vehicle exists
    const { data: vehicle, error: fetchError } = await supabase
      .from("buses")
      .select(
        `
        id, name, model_name,
        operator:users!buses_operator_id_f54c6fdd_fk_users_id(id, name, email)
      `
      )
      .eq("id", id)
      .single();

    if (fetchError || !vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, string> = {
      approval_status: action === "approve" ? "approved" : "rejected",
    };

    if (action === "reject" && rejection_reason) {
      updateData.rejection_reason = rejection_reason;
    }

    const { error: updateError } = await supabase
      .from("buses")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      console.error("Vehicle action error:", updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Vehicle "${vehicle.name}" has been ${action === "approve" ? "approved" : "rejected"}`,
      vehicle_id: id,
      approval_status: updateData.approval_status,
    });
  } catch (error) {
    console.error("Admin vehicle action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/admin/vehicles/[id] - Get vehicle details
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

    const { data: vehicle, error } = await supabase
      .from("buses")
      .select(
        `
        *,
        operator:users!buses_operator_id_f54c6fdd_fk_users_id(id, name, email, phone),
        bus_availability(id, date, is_available),
        booking_requests(id, booking_number, status, total_amount, created_at, customer_name)
      `
      )
      .eq("id", id)
      .single();

    if (error || !vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Admin get vehicle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
