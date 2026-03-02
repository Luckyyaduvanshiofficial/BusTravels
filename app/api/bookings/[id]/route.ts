import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/bookings/[id] - Get a single booking
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("booking_requests")
      .select(
        `
        *,
        bus:buses!booking_requests_bus_id_0c574eb9_fk_buses_id(id, name, model_name, bus_type, seating_capacity, ac_type, base_fare, images, operator_id),
        customer:users!booking_requests_customer_id_6f04f914_fk_users_id(id, name, phone, email)
      `
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Get booking error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id] - Update booking status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...updateData } = body;

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
      case "accept":
        updatePayload.status = "confirmed";
        updatePayload.operator_response_at = new Date().toISOString();
        break;

      case "reject":
        updatePayload.status = "rejected";
        updatePayload.rejection_reason =
          updateData.rejection_reason || "Not available";
        updatePayload.operator_response_at = new Date().toISOString();
        break;

      case "cancel":
        updatePayload.status = "cancelled";
        updatePayload.cancelled_at = new Date().toISOString();
        updatePayload.cancelled_by_id = user.id;
        updatePayload.cancellation_reason =
          updateData.cancellation_reason || "Cancelled by user";
        break;

      case "complete":
        updatePayload.status = "completed";
        updatePayload.completed_at = new Date().toISOString();
        break;

      case "contact":
        updatePayload.status = "contacted";
        break;

      default: {
        // Allow direct field updates for admin
        const role = user.user_metadata?.role;
        if (role === "admin") {
          Object.assign(updatePayload, updateData);
        } else {
          return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 }
          );
        }
        break;
      }
    }

    const { data, error } = await supabase
      .from("booking_requests")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating booking:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Patch booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
