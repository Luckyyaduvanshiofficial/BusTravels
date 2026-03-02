import { useState, useEffect, useCallback, useMemo } from 'react';
import { BOOKING_STATUS, BOOKING_FILTERS, type BookingFilter, type BookingStatus } from '@/lib/constants/booking';

export interface ApiBooking {
  id: string;
  booking_number: string;
  status: string;
  bus_id: string;
  bus_details: {
    id: string;
    name: string;
    model_name: string;
    bus_type: string;
    seating_capacity: number;
    ac_type: string;
    base_fare: number;
    images: string[];
  } | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  trip_type: string;
  pickup_location: string;
  pickup_city: string;
  drop_location: string;
  drop_city: string;
  trip_date: string;
  return_date: string | null;
  pickup_time: string | null;
  passenger_count: number;
  total_amount: number;
  base_amount: number;
  payment_status: string;
  payment_mode: string;
  rejection_reason: string | null;
  notes: string | null;
  operator_notes: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export function useBookings(currentDate?: Date | null) {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Failed to load bookings');
      const data: ApiBooking[] = await response.json();
      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
      setBookings([]);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = useCallback(async (bookingId: string, status: BookingStatus) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', cancellation_reason: 'Cancelled by customer' }),
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
      throw err;
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId: string) => {
    await updateBookingStatus(bookingId, BOOKING_STATUS.CANCELLED);
  }, [updateBookingStatus]);

  const getBookingById = useCallback((id: string) => {
    return bookings.find((b) => b.id === id);
  }, [bookings]);

  const filterBookings = useCallback((filter: BookingFilter) => {
    if (!currentDate || !bookings.length) return bookings;

    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    if (!filter || filter === BOOKING_FILTERS.ALL) {
      return bookings;
    }

    return bookings.filter((booking) => {
      const pickupDate = new Date(booking.trip_date);
      const isPast = pickupDate < today;

      switch (filter) {
        case BOOKING_FILTERS.UPCOMING:
          return (
            (booking.status === 'confirmed' ||
              booking.status === 'pending') &&
            !isPast
          );
        case BOOKING_FILTERS.COMPLETED:
          return (
            booking.status === 'completed' ||
            (isPast && booking.status !== 'cancelled')
          );
        case BOOKING_FILTERS.CANCELLED:
          return booking.status === 'cancelled';
        default:
          return true;
      }
    });
  }, [bookings, currentDate]);

  const stats = useMemo(() => {
    if (!currentDate || !bookings.length) {
      return {
        totalBookings: bookings.length,
        upcomingCount: 0,
        completedCount: 0,
        cancelledCount: 0,
        totalSpent: 0,
      };
    }
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    const upcoming = bookings.filter((b) => {
      const pickupDate = new Date(b.trip_date);
      const isPast = pickupDate < today;
      return (
        (b.status === 'confirmed' || b.status === 'pending') &&
        !isPast
      );
    });

    const completed = bookings.filter((b) => {
      const pickupDate = new Date(b.trip_date);
      const isPast = pickupDate < today;
      return (
        b.status === 'completed' ||
        (isPast && b.status !== 'cancelled')
      );
    });

    const cancelled = bookings.filter((b) => b.status === 'cancelled');
    const totalSpent = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + Number.parseFloat(String(b.total_amount)), 0);

    return {
      totalBookings: bookings.length,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      cancelledCount: cancelled.length,
      totalSpent,
    };
  }, [bookings, currentDate]);

  return {
    bookings,
    isLoaded,
    isLoading,
    error,
    refetch: fetchBookings,
    updateBookingStatus,
    cancelBooking,
    getBookingById,
    filterBookings,
    stats,
  };
}

export function useSafeDate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? new Date() : null;
}
