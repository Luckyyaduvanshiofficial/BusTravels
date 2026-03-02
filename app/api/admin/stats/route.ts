import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all stats in parallel
    const [
      { count: totalBookings },
      { count: pendingBookings },
      { count: completedBookings },
      { count: totalOperators },
      { count: verifiedOperators },
      { count: pendingOperators },
      { count: totalBuses },
      { count: pendingBuses },
      { count: approvedBuses },
      { count: totalCustomers },
    ] = await Promise.all([
      supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed"),
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "operator"),
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "operator")
        .eq("is_verified", true),
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "operator")
        .eq("is_verified", false),
      supabase.from("buses").select("*", { count: "exact", head: true }),
      supabase
        .from("buses")
        .select("*", { count: "exact", head: true })
        .eq("approval_status", "pending"),
      supabase
        .from("buses")
        .select("*", { count: "exact", head: true })
        .eq("approval_status", "approved"),
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "customer"),
    ]);

    // Get total revenue from completed bookings
    const { data: revenueData } = await supabase
      .from("booking_requests")
      .select("total_amount")
      .eq("status", "completed");

    const totalRevenue = (revenueData || []).reduce(
      (sum: number, b: Record<string, string>) => sum + (Number.parseFloat(b.total_amount) || 0),
      0
    );

    // Get recent bookings
    const { data: recentBookings } = await supabase
      .from("booking_requests")
      .select(
        `
        id, booking_number, status, total_amount, created_at, customer_name,
        bus:buses!booking_requests_bus_id_0c574eb9_fk_buses_id(name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      total_bookings: totalBookings || 0,
      pending_bookings: pendingBookings || 0,
      completed_bookings: completedBookings || 0,
      total_operators: totalOperators || 0,
      verified_operators: verifiedOperators || 0,
      pending_operators: pendingOperators || 0,
      total_buses: totalBuses || 0,
      pending_buses: pendingBuses || 0,
      approved_buses: approvedBuses || 0,
      total_customers: totalCustomers || 0,
      total_revenue: totalRevenue,
      recent_bookings: recentBookings || [],
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
