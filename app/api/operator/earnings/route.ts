import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/operator/earnings - Get operator earnings summary
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.user_metadata?.role !== "operator") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get operator's buses
    const { data: buses } = await supabase
      .from("buses")
      .select("id")
      .eq("operator_id", user.id);

    const busIds = (buses || []).map((b: Record<string, unknown>) => b.id);

    if (busIds.length === 0) {
      return NextResponse.json({
        total_earnings: 0,
        completed_bookings: 0,
        pending_earnings: 0,
        pending_bookings: 0,
        monthly_earnings: [],
        recent_transactions: [],
      });
    }

    // Get completed bookings (earnings)
    const { data: completedBookings } = await supabase
      .from("booking_requests")
      .select("id, booking_number, total_amount, created_at, customer_name, status, trip_date")
      .in("bus_id", busIds)
      .eq("status", "completed");

    // Get accepted/pending bookings (pending earnings)
    const { data: pendingBookings } = await supabase
      .from("booking_requests")
      .select("id, booking_number, total_amount, created_at, customer_name, status, trip_date")
      .in("bus_id", busIds)
      .in("status", ["accepted", "confirmed"]);

    const totalEarnings = (completedBookings || []).reduce(
      (sum: number, b: Record<string, string>) => sum + (Number.parseFloat(b.total_amount) || 0),
      0
    );

    const pendingEarnings = (pendingBookings || []).reduce(
      (sum: number, b: Record<string, string>) => sum + (Number.parseFloat(b.total_amount) || 0),
      0
    );

    // Monthly earnings (last 6 months)
    const monthlyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[key] = 0;
    }

    (completedBookings || []).forEach((b: Record<string, string>) => {
      const date = new Date(b.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyMap[key] !== undefined) {
        monthlyMap[key] += Number.parseFloat(b.total_amount) || 0;
      }
    });

    const monthlyEarnings = Object.entries(monthlyMap).map(([month, amount]) => ({
      month,
      amount,
      label: new Date(month + "-01").toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      }),
    }));

    // Recent transactions (last 10)
    const allBookings = [
      ...(completedBookings || []),
      ...(pendingBookings || []),
    ]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10);

    return NextResponse.json({
      total_earnings: totalEarnings,
      completed_bookings: (completedBookings || []).length,
      pending_earnings: pendingEarnings,
      pending_bookings: (pendingBookings || []).length,
      monthly_earnings: monthlyEarnings,
      recent_transactions: allBookings,
    });
  } catch (error) {
    console.error("Operator earnings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
