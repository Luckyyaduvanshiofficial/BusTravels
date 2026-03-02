'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, Bus } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getMyBookingRequests } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { FilterTabs } from '@/components/customer/FilterTabs'
import { BookingCard } from '@/components/customer/BookingCard'
import { BookingCardSkeleton } from '@/components/customer/Skeletons'
import type { BookingRequest } from '@/lib/types'
import type { CustomerBooking, BookingStatus } from '@/lib/customer-types'

function mapStatus(s: string): BookingStatus {
  if (s === 'contacted') return 'confirmed'
  if (s === 'completed') return 'completed'
  if (s === 'cancelled') return 'cancelled'
  return 'pending'
}

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
    status: mapStatus(b.status),
    vehicle_name: b.bus_details?.name ?? 'Vehicle',
    vehicle_type: b.bus_details?.bus_type ?? '',
    base_price: b.bus_details?.base_fare ?? 0,
    total_amount: b.bus_details?.base_fare ?? 0,
    // NOTE: BookingRequest has no payment field; using booking status as fallback
    payment_status: b.status === 'completed' ? 'paid' : 'pending',
    created_at: b.created_at,
    customer_notes: b.notes ?? undefined,
  }
}

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<CustomerBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const router = useRouter()
  useReducedMotion() // for potential future reduced motion

  const load = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setError(null)
    try {
      const raw = await getMyBookingRequests()
      setBookings(raw.map(adaptBooking))
    } catch (err) {
      console.error('Failed to load bookings:', err)
      setError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [router])

  const today = new Date(); today.setHours(0, 0, 0, 0)

  const filtered = bookings.filter((b) => {
    if (activeTab === 'all') return true
    if (activeTab === 'upcoming')
      return (b.status === 'confirmed' || b.status === 'pending') && new Date(b.trip_date) >= today
    if (activeTab === 'pending') return b.status === 'pending'
    if (activeTab === 'completed') return b.status === 'completed'
    if (activeTab === 'cancelled') return b.status === 'cancelled'
    return true
  })

  // Tab counts
  const counts: Record<string, number> = {
    all: bookings.length,
    upcoming: bookings.filter(
      (b) => (b.status === 'confirmed' || b.status === 'pending') && new Date(b.trip_date) >= today
    ).length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  const tabsWithCounts = FILTER_TABS.map((t) => ({ ...t, count: counts[t.id] }))

  async function handleCancel(id: string) {
    setCancelingId(id)
    // Optimistic update
    const previousBookings = bookings
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b))
    )
    try {
      // TODO: replace with real API call, e.g.:
      // await fetch(`/api/bookings/${id}/cancel`, { method: 'POST' })
      await new Promise((r) => setTimeout(r, 500))
    } catch (err) {
      console.error('Failed to cancel booking:', err)
      // Rollback on error
      setBookings(previousBookings)
      setError('Failed to cancel booking. Please try again.')
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">My Bookings</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Track all your trip reservations</p>
        </div>
        <Link href="/search">
          <Button className="bg-saffron hover:bg-saffron-dark text-white font-semibold rounded-xl h-9 px-4 text-sm">
            <Search className="h-4 w-4 mr-1.5" />
            Book New
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <FilterTabs tabs={tabsWithCounts} activeTab={activeTab} onChange={setActiveTab} />

      {/* Error banner */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center justify-between text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            className="ml-4 underline font-medium shrink-0"
            onClick={() => { setLoading(true); load() }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => <BookingCardSkeleton key={`skel-b-${i}`} />)}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-12 text-center">
          <Bus className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
          <p className="font-heading font-semibold text-neutral-600 mb-1">No bookings here</p>
          <p className="text-sm text-neutral-400 mb-4">
            {activeTab === 'all'
              ? "You haven't made any bookings yet."
              : `No ${activeTab} bookings found.`}
          </p>
          <Link href="/search">
            <Button className="bg-saffron hover:bg-saffron-dark text-white font-semibold rounded-xl h-10 px-5 text-sm">
              Book Your First Trip
            </Button>
          </Link>
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((booking) => (
            <motion.div key={booking.id} variants={itemVariants}>
              <BookingCard
                booking={booking}
                onCancel={handleCancel}
              />
              {cancelingId === booking.id && (
                <p className="text-xs text-center text-neutral-400 mt-1 animate-pulse">
                  Cancelling booking…
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
