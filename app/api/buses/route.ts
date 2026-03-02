import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/buses - List buses (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const mine = searchParams.get("mine");
    const busType = searchParams.get("bus_type");
    const city = searchParams.get("city");
    const minCapacity = searchParams.get("min_capacity");
    const status = searchParams.get("status");

    let query = supabase.from("buses").select(`
      *,
      operator:users!buses_operator_id_fk_users_id(id, name, phone, email, company_name, rating_avg)
    `);

    // If requesting own buses (operator view)
    if (mine === "1") {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      query = query.eq("operator_id", user.id);
    } else {
      // Public view: only show approved and active buses
      query = query
        .eq("approval_status", "approved")
        .eq("is_active", true)
        .eq("is_available", true);
    }

    if (busType) {
      query = query.eq("bus_type", busType);
    }

    if (city) {
      query = query.ilike("home_city", `%${city}%`);
    }

    if (minCapacity) {
      query = query.gte("seating_capacity", Number.parseInt(minCapacity));
    }

    if (status) {
      query = query.eq("approval_status", status);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching buses:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to match frontend types
    const buses = (data || []).map((bus: Record<string, unknown>) => ({
      id: bus.id,
      operator: bus.operator_id,
      operator_name: (bus.operator as Record<string, string> | null)?.company_name || (bus.operator as Record<string, string> | null)?.name || "Unknown",
      name: bus.name,
      description: bus.description,
      model_name: bus.model_name,
      bus_type: bus.bus_type,
      seating_capacity: bus.seating_capacity,
      ac_type: bus.ac_type,
      registration_number: bus.registration_number,
      base_fare: Number.parseFloat(String(bus.base_fare)) || 0,
      per_km_rate: Number.parseFloat(String(bus.per_km_rate)) || 0,
      driver_allowance: Number.parseFloat(String(bus.driver_allowance)) || 0,
      night_charges: Number.parseFloat(String(bus.night_charges)) || 0,
      amenities: (bus.amenities as string[]) || [],
      images: (bus.images as string[]) || [],
      thumbnail_url: bus.thumbnail_url,
      home_city: bus.home_city,
      home_state: bus.home_state,
      operating_routes: (bus.operating_routes as string[]) || [],
      approval_status: bus.approval_status,
      is_active: bus.is_active,
      is_available: bus.is_available,
      rating_avg: Number.parseFloat(String(bus.rating_avg)) || 0,
      rating_count: (bus.rating_count as number) || 0,
      total_bookings: (bus.total_bookings as number) || 0,
      created_at: bus.created_at,
    }));

    return NextResponse.json(buses);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/buses - Create a new bus
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.user_metadata?.role;
    if (role !== "operator") {
      return NextResponse.json(
        { error: "Only operators can add buses" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("buses")
      .insert({
        operator_id: user.id,
        name: body.name,
        description: body.description || "",
        bus_type: body.bus_type,
        model_name: body.model_name || "",
        seating_capacity: body.seating_capacity,
        ac_type: body.ac_type || "ac",
        registration_number: body.registration_number || `REG-${Date.now()}`,
        base_fare: body.base_fare || 0,
        per_km_rate: body.per_km_rate || 0,
        driver_allowance: body.driver_allowance || 0,
        night_charges: body.night_charges || 0,
        amenities: body.amenities || [],
        images: body.images || [],
        home_city: body.home_city || "Jaipur",
        home_state: body.home_state || "Rajasthan",
        operating_routes: body.operating_routes || [],
        approval_status: "pending",
        is_active: true,
        is_available: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating bus:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
