import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface BusRelation {
  id: string;
  name: string;
  model_name: string;
  bus_type: string;
  seating_capacity: number;
  ac_type: string;
  base_fare: string;
  images: string[];
  operator_id: string;
}

interface CustomerRelation {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface BookingRow {
  id: string;
  booking_number: string;
  customer_id: string;
  customer: CustomerRelation | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  bus_id: string;
  bus: BusRelation | null;
  trip_type: string;
  pickup_location: string;
  pickup_city: string;
  drop_location: string;
  drop_city: string;
  trip_date: string;
  return_date: string | null;
  pickup_time: string;
  passenger_count: number;
  special_requests: string | null;
  total_amount: string;
  base_amount: string;
  payment_status: string;
  payment_mode: string;
  status: string;
  rejection_reason: string | null;
  notes: string | null;
  operator_notes: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

// GET /api/bookings - List bookings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.user_metadata?.role || "customer";
    const operatorView = searchParams.get("operator");
    const status = searchParams.get("status");

    let query = supabase.from("booking_requests").select(`
      *,
      bus:buses!booking_requests_bus_id_0c574eb9_fk_buses_id(id, name, model_name, bus_type, seating_capacity, ac_type, base_fare, images, operator_id),
      customer:users!booking_requests_customer_id_6f04f914_fk_users_id(id, name, phone, email)
    `);

    if (role === "admin") {
      // Admin sees all bookings
    } else if (operatorView === "1" || role === "operator") {
      // Operator sees bookings for their buses
      // First get the operator's bus IDs
      const { data: operatorBuses } = await supabase
        .from("buses")
        .select("id")
        .eq("operator_id", user.id);

      const busIds = (operatorBuses || []).map((b: Record<string, unknown>) => b.id);
      if (busIds.length === 0) {
        return NextResponse.json([]);
      }
      query = query.in("bus_id", busIds);
    } else {
      // Customer sees their own bookings
      query = query.eq("customer_id", user.id);
    }

    if (status) {
      query = query.eq("status", status);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data
    const bookings = (data as BookingRow[] || []).map((booking) => ({
      id: booking.id,
      booking_number: booking.booking_number,
      customer: booking.customer_id,
      customer_name: booking.customer?.name || booking.customer_name,
      customer_phone: booking.customer?.phone || booking.customer_phone,
      customer_email: booking.customer?.email || booking.customer_email,
      bus: booking.bus_id,
      bus_details: booking.bus
        ? {
            id: booking.bus.id,
            name: booking.bus.name,
            model_name: booking.bus.model_name,
            bus_type: booking.bus.bus_type,
            seating_capacity: booking.bus.seating_capacity,
            ac_type: booking.bus.ac_type,
            base_fare: Number.parseFloat(booking.bus.base_fare) || 0,
            images: booking.bus.images || [],
          }
        : null,
      trip_type: booking.trip_type,
      pickup_location: booking.pickup_location,
      pickup_city: booking.pickup_city,
      drop_location: booking.drop_location,
      drop_city: booking.drop_city,
      trip_date: booking.trip_date,
      return_date: booking.return_date,
      pickup_time: booking.pickup_time,
      passenger_count: booking.passenger_count,
      special_requests: booking.special_requests,
      total_amount: Number.parseFloat(booking.total_amount) || 0,
      base_amount: Number.parseFloat(booking.base_amount) || 0,
      payment_status: booking.payment_status,
      payment_mode: booking.payment_mode,
      status: booking.status,
      rejection_reason: booking.rejection_reason,
      notes: booking.notes,
      operator_notes: booking.operator_notes,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      completed_at: booking.completed_at,
    }));

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a booking
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.bus || !body.pickup_location || !body.trip_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get bus details for pricing
    const { data: bus } = await supabase
      .from("buses")
      .select("*")
      .eq("id", body.bus)
      .single();

    if (!bus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    // Generate booking number
    const bookingNumber = `BK${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const { data, error } = await supabase
      .from("booking_requests")
      .insert({
        booking_number: bookingNumber,
        customer_id: user.id,
        bus_id: body.bus,
        trip_type: body.trip_type || "one_way",
        pickup_location: body.pickup_location,
        pickup_city: body.pickup_city || "",
        drop_location: body.drop_location || "",
        drop_city: body.drop_city || "",
        trip_date: body.trip_date,
        return_date: body.return_date || null,
        pickup_time: body.pickup_time || null,
        passenger_count: body.passenger_count || 1,
        special_requests: body.special_requests || "",
        customer_name: body.customer_name || user.user_metadata?.name || "",
        customer_phone: body.customer_phone || user.user_metadata?.phone || "",
        customer_email: body.customer_email || user.email || "",
        alternate_phone: body.alternate_phone || "",
        base_amount: Number.parseFloat(bus.base_fare) || 0,
        per_km_amount: Number.parseFloat(bus.per_km_rate) || 0,
        driver_allowance: Number.parseFloat(bus.driver_allowance) || 0,
        night_charges: Number.parseFloat(bus.night_charges) || 0,
        toll_estimate: 0,
        gst_amount: 0,
        discount_amount: 0,
        total_amount: Number.parseFloat(bus.base_fare) || 0,
        commission_rate: 0,
        commission_amount: 0,
        operator_payout: Number.parseFloat(bus.base_fare) || 0,
        payment_mode: body.payment_mode || "cash",
        payment_status: "pending",
        amount_paid: 0,
        amount_due: Number.parseFloat(bus.base_fare) || 0,
        status: "pending",
        notes: body.notes || "",
        operator_notes: "",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error);
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
