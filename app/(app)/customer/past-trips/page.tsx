'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Star, RotateCcw, TrendingUp, MapPin, Bus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getMyBookingRequests } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { BookingCardSkeleton } from '@/components/customer/Skeletons'
import type { BookingRequest } from '@/lib/types'
import type { CustomerBooking } from '@/lib/customer-types'

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
    status: 'completed',
    vehicle_name: b.bus_details?.name ?? 'Vehicle',
    vehicle_type: b.bus_details?.bus_type ?? '',
    base_price: b.bus_details?.base_fare ?? 0,
    total_amount: b.bus_details?.base_fare ?? 0,
    payment_status: 'paid',
    created_at: b.created_at,
    // customer_rating is not available from BookingRequest; starts unrated
    customer_rating: undefined,
  }
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function PastTripsPage() {
  const [trips, setTrips] = useState<CustomerBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ratingId, setRatingId] = useState<string | null>(null)
  const [tempRating, setTempRating] = useState(0)
  const router = useRouter()
  useReducedMotion() // reserved for future use

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      try {
        const raw = await getMyBookingRequests()
        const completed = raw.filter((b) => b.status === 'completed').map(adaptBooking)
        setTrips(completed)
      } catch (err) {
        console.error('Failed to load past trips:', err)
        setError('Failed to load past trips. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const totalDistance = trips.length * 230  // placeholder km estimate
  const routeCounts = trips.reduce<Record<string, number>>((acc, b) => {
    const key = `${b.pickup_location} → ${b.drop_location}`
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
  const favoriteRoute = Object.entries(routeCounts).sort((a, b) => b[1] - a[1])[0]

  async function handleRate(id: string, rating: number) {
    const previousTrips = trips
    // Optimistic update
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, customer_rating: rating } : t))
    )
    setRatingId(null)
    setTempRating(0)
    try {
      // TODO: replace with real API call, e.g.:
      // await fetch(`/api/bookings/${id}/rate`, { method: 'POST', body: JSON.stringify({ rating }) })
      await new Promise((r) => setTimeout(r, 400))
    } catch (err) {
      console.error('Failed to submit rating:', err)
      // Rollback on error
      setTrips(previousTrips)
      setError('Failed to submit rating. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Past Trips</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Your completed journeys</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Card */}
      {trips.length > 0 && (
        <motion.div
          className="bg-gradient-to-br from-deepPurple to-royalBlue rounded-2xl p-5 text-white shadow-lg"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-goldAccent" />
            <span className="text-sm font-semibold text-white/80">Your Journey Stats</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Trips', value: trips.length.toString() },
              { label: 'Total Distance', value: `${totalDistance.toLocaleString('en-IN')} km` },
              { label: 'Fav Route', value: favoriteRoute ? favoriteRoute[0].split('→')[0].trim() : '—' },
              { label: 'Avg Rating', value: trips.some((t) => t.customer_rating)
                  ? (trips.reduce((s, t) => s + (t.customer_rating ?? 0), 0) / trips.filter((t) => t.customer_rating).length).toFixed(1) + '★'
                  : 'N/A' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xs text-white/60">{stat.label}</p>
                <p className="font-heading font-bold text-lg text-white mt-0.5">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="space-y-4">{Array.from({ length: 3 }, (_, i) => <BookingCardSkeleton key={`skel-pt-${i}`} />)}</div>
      )}
      {!loading && trips.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-12 text-center">
          <Bus className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
          <p className="font-heading font-semibold text-neutral-600 mb-1">No completed trips yet</p>
          <p className="text-sm text-neutral-400 mb-4">Your trip history will appear here after you complete a journey</p>
          <Link href="/search">
            <Button className="bg-saffron hover:bg-saffron-dark text-white font-semibold rounded-xl h-10 px-5 text-sm">
              Book Your First Trip
            </Button>
          </Link>
        </div>
      )}
      {!loading && trips.length > 0 && (
        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
          {trips.map((trip) => (
            <motion.div key={trip.id} variants={itemVariants}>
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                {/* Route */}
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-saffron" />
                  <span className="font-heading font-semibold text-neutral-800">
                    {trip.pickup_location} → {trip.drop_location}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mb-3">
                  {new Date(trip.trip_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  {' · '}{trip.vehicle_name}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  {trip.customer_rating && (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${s <= trip.customer_rating! ? 'text-goldAccent fill-goldAccent' : 'text-neutral-200 fill-neutral-200'}`}
                        />
                      ))}
                      <span className="text-xs text-neutral-500 ml-1">You rated</span>
                    </div>
                  )}
                  {!trip.customer_rating && ratingId === trip.id && (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          aria-label={`Rate ${s} stars`}
                          onClick={() => setTempRating(s)}
                          onDoubleClick={() => handleRate(trip.id, s)}
                        >
                          <Star className={`h-6 w-6 cursor-pointer transition-colors ${s <= tempRating ? 'text-goldAccent fill-goldAccent' : 'text-neutral-200'}`} />
                        </button>
                      ))}
                      {tempRating > 0 && (
                        <Button size="sm" className="ml-2 h-7 text-xs bg-saffron text-white rounded-lg px-3" onClick={() => handleRate(trip.id, tempRating)}>
                          Submit
                        </Button>
                      )}
                    </div>
                  )}
                  {!trip.customer_rating && ratingId !== trip.id && (
                    <button
                      onClick={() => setRatingId(trip.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-saffron hover:text-saffron-dark"
                    >
                      <Star className="h-4 w-4" />
                      Rate this trip
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-neutral-100">
                  <Link href={`/customer/bookings/${trip.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full rounded-xl h-8 text-xs font-semibold">
                      View Receipt
                    </Button>
                  </Link>
                  <Link href={`/search?from=${encodeURIComponent(trip.pickup_location)}&to=${encodeURIComponent(trip.drop_location)}`} className="flex-1">
                    <Button size="sm" className="w-full rounded-xl h-8 text-xs font-semibold bg-saffron hover:bg-saffron-dark text-white">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Book Again
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
