'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Users, FileText, Car, AlertCircle, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getMyBookingRequests } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { TripTimeline } from '@/components/customer/TripTimeline'
import { DriverCard } from '@/components/customer/DriverCard'
import { PaymentCard } from '@/components/customer/PaymentCard'
import { BookingCardSkeleton } from '@/components/customer/Skeletons'
import type { TimelineStep } from '@/components/customer/TripTimeline'
import type { BookingRequest } from '@/lib/types'
import type { CustomerBooking, BookingStatus } from '@/lib/customer-types'
import { STATUS_CONFIG } from '@/lib/customer-types'
import { cn } from '@/lib/utils'

function adaptBooking(b: BookingRequest): CustomerBooking {
  return {
    id: b.id,
    booking_number: b.booking_number ?? b.id.slice(0, 8).toUpperCase(),
    pickup_location: b.pickup_location,
    drop_location: b.drop_location,
    trip_date: b.trip_date,
    // TODO: read actual trip time from API when BookingRequest includes a time field
    trip_time: undefined,
    passenger_count: b.passenger_count,
    status: (
      b.status === 'contacted' ? 'confirmed' :
      b.status === 'completed' ? 'completed' : 'pending'
    ) as BookingStatus,
    vehicle_name: b.bus_details?.name ?? 'Vehicle',
    vehicle_type: b.bus_details?.bus_type ?? '',
    vehicle_registration: undefined,
    vehicle_amenities: b.bus_details?.ac_type === 'ac' ? ['AC', 'GPS'] : ['GPS'],
    driver_name: b.bus_details?.driver_name,
    // TODO: fetch real driver stats from driver API using booking.driverId
    driver_rating: undefined,
    driver_trips: undefined,
    driver_since: undefined,
    base_price: b.bus_details?.base_fare ?? 0,
    total_amount: b.bus_details?.base_fare ?? 0,
    payment_method: 'UPI',
    // NOTE: BookingRequest has no payment field; using booking status as fallback
    payment_status: b.status === 'completed' ? 'paid' : 'pending',
    created_at: b.created_at,
    // TODO: map driver_accepted_at and paid_at when API provides these timestamps
    driver_accepted_at: (b as Record<string, unknown>).driver_accepted_at as string | undefined,
    paid_at: (b as Record<string, unknown>).paid_at as string | undefined,
    contacted_at: b.status === 'contacted' ? b.created_at : undefined,
    customer_notes: b.notes ?? undefined,
  }
}

function buildTimeline(booking: CustomerBooking): TimelineStep[] {
  const steps: TimelineStep[] = [
    {
      id: 'created',
      label: 'Booking Created',
      timestamp: new Date(booking.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
    },
    {
      id: 'accepted',
      label: 'Driver Accepted',
      timestamp: booking.driver_accepted_at
        ? new Date(booking.driver_accepted_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        : undefined,
      status: booking.status === 'confirmed' || booking.status === 'completed' ? 'completed' : 'upcoming',
    },
    {
      id: 'payment',
      label: 'Payment Received',
      timestamp: booking.paid_at
        ? new Date(booking.paid_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        : undefined,
      status: booking.payment_status === 'paid' ? 'completed' : booking.status === 'confirmed' ? 'current' : 'upcoming',
    },
    {
      id: 'trip',
      label: 'Trip',
      description: `${new Date(booking.trip_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} @ ${booking.trip_time}`,
      status: booking.status === 'completed' ? 'completed' : booking.status === 'confirmed' ? 'current' : 'upcoming',
    },
  ]
  return steps
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [booking, setBooking] = useState<CustomerBooking | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      try {
        const all = await getMyBookingRequests()
        const found = all.find((b) => b.id === id)
        if (found) setBooking(adaptBooking(found))
      } catch (error) {
        console.error('Failed to fetch booking details:', error)
        throw error
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-neutral-100 rounded animate-pulse" />
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
        <p className="font-heading font-semibold text-neutral-600">Booking not found</p>
        <Link href="/customer/bookings" className="mt-4 block">
          <Button variant="outline" className="rounded-xl">← Back to Bookings</Button>
        </Link>
      </div>
    )
  }

  const config = STATUS_CONFIG[booking.status]
  const timeline = buildTimeline(booking)

  // Contact reveal: 2h before trip
  // Correctly parse 12-hour time (e.g., '8:00 PM') to 24-hour before building Date
  let formattedTripTime = '08:00'
  if (booking.trip_time) {
    const match = booking.trip_time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (match) {
      let hour = parseInt(match[1], 10)
      const minute = match[2]
      const period = match[3].toUpperCase()
      if (period === 'PM' && hour < 12) hour += 12
      if (period === 'AM' && hour === 12) hour = 0
      formattedTripTime = `${String(hour).padStart(2, '0')}:${minute}`
    }
  }
  const tripDateTime = new Date(`${booking.trip_date}T${formattedTripTime}:00`)
  const twoHoursBefore = new Date(tripDateTime.getTime() - 2 * 60 * 60 * 1000)
  const isContactRevealed = new Date() >= twoHoursBefore

  const paymentRows = [
    { label: 'Base Price', value: `₹${booking.base_price.toLocaleString('en-IN')}` },
    ...(booking.distance_charge ? [{ label: 'Distance Charge', value: `₹${booking.distance_charge.toLocaleString('en-IN')}` }] : []),
    ...(booking.discount ? [{ label: 'Discount', value: `-₹${booking.discount.toLocaleString('en-IN')}`, isDiscount: true }] : []),
    { label: 'Total Amount', value: `₹${booking.total_amount.toLocaleString('en-IN')}`, isTotal: true },
  ]

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Back + Header */}
      <div>
        <Link
          href="/customer/bookings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading text-2xl font-bold text-neutral-900">
              Booking #{booking.booking_number}
            </h1>
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full mt-2',
                config.bgColor,
                config.color,
              )}
            >
              {config.icon} {config.label}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-8 text-xs"
            onClick={() => navigator.share?.({ title: `BusBook #${booking.booking_number}`, url: window.location.href })}
          >
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            Share
          </Button>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-5">
          Trip Status
        </h3>
        <TripTimeline steps={timeline} />
      </div>

      {/* Trip Details */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
          Trip Details
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-4.5 w-4.5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-neutral-500">Pickup</p>
              <p className="font-semibold text-neutral-800">{booking.pickup_location}</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {new Date(booking.trip_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                {booking.trip_time ? ` @ ${booking.trip_time}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4.5 w-4.5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-neutral-500">Drop-off</p>
              <p className="font-semibold text-neutral-800">{booking.drop_location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4.5 w-4.5 text-neutral-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-neutral-500">Passengers</p>
              <p className="font-semibold text-neutral-800">{booking.passenger_count} people</p>
            </div>
          </div>
          {booking.customer_notes && (
            <div className="flex items-start gap-3">
              <FileText className="h-4.5 w-4.5 text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-neutral-500">Your Notes</p>
                <p className="text-sm text-neutral-700 italic">&ldquo;{booking.customer_notes}&rdquo;</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Card */}
      {booking.vehicle_name && (
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Vehicle
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-royalBlue/10 flex items-center justify-center flex-shrink-0">
              <Car className="h-6 w-6 text-royalBlue" />
            </div>
            <div>
              <p className="font-heading font-semibold text-neutral-800">{booking.vehicle_name}</p>
              {booking.vehicle_registration && (
                <p className="text-xs text-neutral-500 font-mono">{booking.vehicle_registration}</p>
              )}
              {booking.vehicle_type && (
                <p className="text-xs text-neutral-500">{booking.vehicle_type}</p>
              )}
            </div>
          </div>
          {booking.vehicle_amenities && booking.vehicle_amenities.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-neutral-100">
              {booking.vehicle_amenities.map((a) => (
                <span key={a} className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full">
                  ✓ {a}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Driver Card */}
      {booking.driver_name && (
        <DriverCard
          name={booking.driver_name}
          rating={booking.driver_rating}
          totalTrips={booking.driver_trips}
          driverSince={booking.driver_since}
          phone={booking.driver_phone}
          isContactRevealed={isContactRevealed}
          contactRevealTime={twoHoursBefore.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        />
      )}

      {/* Payment Card */}
      <PaymentCard
        rows={paymentRows}
        paymentMethod={booking.payment_method}
        paymentStatus={booking.payment_status}
        onDownloadReceipt={booking.payment_status === 'paid' ? async () => {
          // TODO: replace with real receipt download endpoint
          // e.g. const blob = await fetch(`/api/bookings/${booking.id}/receipt`).then(r => r.blob())
          // const url = URL.createObjectURL(blob)
          // const a = document.createElement('a'); a.href = url; a.download = `receipt-${booking.booking_number}.pdf`; a.click()
          // URL.revokeObjectURL(url)
          console.warn('Receipt download not yet implemented for booking', booking.id)
        } : undefined}
        onPayNow={() => router.push('/customer/payments')}
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pb-4">
        <Button variant="outline" className="rounded-xl flex-1 h-11 font-semibold" onClick={() => router.push('/customer/help')}>
          Need Help?
        </Button>
        {(booking.status === 'pending' || booking.status === 'confirmed') && (
          <Button
            variant="outline"
            className="rounded-xl flex-1 h-11 font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
            onClick={() => {
              // TODO: replace window.confirm with a proper confirmation dialog component
              if (window.confirm('Are you sure you want to cancel this booking?')) {
                // TODO: call cancellation API, e.g.:
                // await fetch(`/api/bookings/${booking.id}/cancel`, { method: 'POST' })
                // then refetch or update local state
                console.warn('Cancel booking not yet implemented for booking', booking.id)
              }
            }}
          >
            Cancel Booking
          </Button>
        )}
      </div>
    </motion.div>
  )
}
