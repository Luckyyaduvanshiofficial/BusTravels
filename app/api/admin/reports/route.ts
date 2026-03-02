import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/reports - Get platform report data
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get bookings with financial data
    const { data: bookings, error: bookingsError } = await supabase
      .from("booking_requests")
      .select("id, status, total_amount, commission_rate, created_at, trip_date")
      .order("created_at", { ascending: false });

    if (bookingsError) {
      console.error("Reports bookings error:", bookingsError);
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    const allBookings = bookings ?? [];

    // Calculate monthly stats
    const monthlyMap = new Map<string, { revenue: number; bookings: number; commission: number }>();
    for (const b of allBookings) {
      const month = new Date(b.created_at).toISOString().slice(0, 7); // YYYY-MM
      const existing = monthlyMap.get(month) ?? { revenue: 0, bookings: 0, commission: 0 };
      const amount = Number(b.total_amount) || 0;
      const commissionRate = Number(b.commission_rate) || 10;
      existing.revenue += amount;
      existing.bookings += 1;
      existing.commission += amount * (commissionRate / 100);
      monthlyMap.set(month, existing);
    }

    const monthly = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // last 12 months

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    for (const b of allBookings) {
      statusCounts[b.status] = (statusCounts[b.status] ?? 0) + 1;
    }

    const totalRevenue = allBookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
    const totalCommission = allBookings.reduce((sum, b) => {
      const amt = Number(b.total_amount) || 0;
      const rate = Number(b.commission_rate) || 10;
      return sum + amt * (rate / 100);
    }, 0);

    return NextResponse.json({
      summary: {
        totalBookings: allBookings.length,
        totalRevenue,
        totalCommission,
        statusCounts,
      },
      monthly,
    });
  } catch (err) {
    console.error("Admin reports error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
