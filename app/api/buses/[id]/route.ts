import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/buses/[id] - Get a single bus
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("buses")
      .select(
        `
        *,
        operator:users!buses_operator_id_fk_users_id(id, name, phone, email, company_name, rating_avg)
      `
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    const bus = {
      id: data.id,
      operator: data.operator_id,
      operator_name:
        data.operator?.company_name || data.operator?.name || "Unknown",
      name: data.name,
      description: data.description,
      model_name: data.model_name,
      bus_type: data.bus_type,
      seating_capacity: data.seating_capacity,
      ac_type: data.ac_type,
      registration_number: data.registration_number,
      base_fare: Number.parseFloat(data.base_fare) || 0,
      per_km_rate: Number.parseFloat(data.per_km_rate) || 0,
      driver_allowance: Number.parseFloat(data.driver_allowance) || 0,
      night_charges: Number.parseFloat(data.night_charges) || 0,
      amenities: data.amenities || [],
      images: data.images || [],
      thumbnail_url: data.thumbnail_url,
      home_city: data.home_city,
      home_state: data.home_state,
      operating_routes: data.operating_routes || [],
      approval_status: data.approval_status,
      is_active: data.is_active,
      is_available: data.is_available,
      rating_avg: Number.parseFloat(data.rating_avg) || 0,
      rating_count: data.rating_count || 0,
      total_bookings: data.total_bookings || 0,
      created_at: data.created_at,
    };

    return NextResponse.json(bus);
  } catch (err) {
    console.error("Get bus error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/buses/[id] - Update a bus
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Only allow the operator who owns the bus or an admin to update
    const { data: existingBus } = await supabase
      .from("buses")
      .select("operator_id")
      .eq("id", id)
      .single();

    if (!existingBus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    const role = user.user_metadata?.role;
    if (existingBus.operator_id !== user.id && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "name",
      "description",
      "bus_type",
      "model_name",
      "seating_capacity",
      "ac_type",
      "registration_number",
      "base_fare",
      "per_km_rate",
      "driver_allowance",
      "night_charges",
      "amenities",
      "images",
      "thumbnail_url",
      "home_city",
      "home_state",
      "operating_routes",
      "is_active",
      "is_available",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("buses")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Update bus error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/buses/[id] - Delete a bus
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existingBus } = await supabase
      .from("buses")
      .select("operator_id")
      .eq("id", id)
      .single();

    if (!existingBus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    const role = user.user_metadata?.role;
    if (existingBus.operator_id !== user.id && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase.from("buses").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete bus error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
