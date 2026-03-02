'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Search,
  CalendarDays,
  Clock,
  CreditCard,
  MapPin,
  ArrowRight,
  Bus,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getMyBookingRequests } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { BookingCard } from '@/components/customer/BookingCard'
import { PointsCard } from '@/components/customer/PointsCard'
import { DashboardSkeleton } from '@/components/customer/Skeletons'
import type { BookingRequest } from '@/lib/types'
import type { CustomerBooking } from '@/lib/customer-types'

function mapStatus(s: string): CustomerBooking['status'] {
  if (s === 'contacted') return 'confirmed'
  if (s === 'completed') return 'completed'
  return 'pending'
}

// Convert API BookingRequest → CustomerBooking shape
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
    // NOTE: BookingRequest has no payment field; using booking status as a conservative fallback
    payment_status: b.status === 'completed' ? 'paid' : 'pending',
    created_at: b.created_at,
    customer_notes: b.notes ?? undefined,
    // TODO: map driver_phone once BookingRequest includes a driver phone field from the API
    driver_phone: undefined,
  }
}

const QUICK_ACTIONS = [
  { icon: Search, label: 'Book New', href: '/search', color: 'bg-saffron/10 text-saffron' },
  { icon: CalendarDays, label: 'My Bookings', href: '/customer/bookings', color: 'bg-royalBlue/10 text-royalBlue' },
  { icon: Clock, label: 'Past Trips', href: '/customer/past-trips', color: 'bg-deepPurple/10 text-deepPurple' },
  { icon: CreditCard, label: 'Payments', href: '/customer/payments', color: 'bg-amber-100 text-amber-700' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<CustomerBooking[]>([])
  const [userName, setUserName] = useState('Traveller')
  const [loading, setLoading] = useState(true)
  // TODO: fetch real loyalty points from user profile API inside loadData and call setLoyaltyPoints
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const router = useRouter()
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Traveller'
      setUserName(name)
      try {
        const raw = await getMyBookingRequests()
        setBookings(raw.map(adaptBooking))
      } catch { /* show empty state */ } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const upcomingBookings = bookings.filter(
    (b) => (b.status === 'confirmed' || b.status === 'pending') && new Date(b.trip_date) >= today
  )
  const nextTrip = upcomingBookings.toSorted(
    (a, b) => new Date(a.trip_date).getTime() - new Date(b.trip_date).getTime()
  )[0]
  const pendingCount = bookings.filter((b) => b.payment_status === 'pending').length

  if (loading) return <DashboardSkeleton />

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
          Welcome back, {userName.split(' ')[0]}! 👋
        </h1>
        <p className="text-neutral-500 mt-1 text-sm">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </motion.div>

      {/* Upcoming Trip Card */}
      {nextTrip && (
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-br from-royalBlue to-royalBlue-dark rounded-2xl p-5 text-white overflow-hidden shadow-lg"
        >
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
          <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">🎉 Upcoming Trip</p>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-saffron" />
            <span className="font-heading font-bold text-lg">
              {nextTrip.pickup_location}
              <span className="text-white/60 mx-2 font-normal">→</span>
              {nextTrip.drop_location}
            </span>
          </div>
          <p className="text-sm text-white/80 mb-4">
            {new Date(nextTrip.trip_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            {nextTrip.trip_time ? ` @ ${nextTrip.trip_time}` : ''}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href={`/customer/bookings/${nextTrip.id}`}>
              <Button size="sm" className="bg-white text-royalBlue hover:bg-white/90 font-semibold rounded-xl h-9 text-xs px-4">View Details</Button>
            </Link>
            {nextTrip.driver_phone && (
              <a href={`https://wa.me/${nextTrip.driver_phone.replaceAll(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl h-9 text-xs px-4">WhatsApp Driver</Button>
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="font-heading font-semibold text-neutral-700 text-sm mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                whileHover={shouldReduce ? {} : { scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl cursor-pointer border border-neutral-100 bg-white shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-neutral-700 text-center leading-tight">
                  {action.label}
                  {action.label === 'Payments' && pendingCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white rounded-full px-1 text-[9px]">{pendingCount}</span>
                  )}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Rewards Banner */}
      <motion.div variants={itemVariants}>
        <PointsCard points={loyaltyPoints} nextTierPoints={200} nextTierReward="₹500 Off" tier="Silver" />
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-neutral-700 text-sm">Recent Activity</h2>
          <Link href="/customer/bookings" className="flex items-center gap-1 text-xs font-semibold text-saffron hover:text-saffron-dark transition-colors">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-10 text-center">
            <Bus className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="font-heading font-semibold text-neutral-600 mb-1">No trips yet!</p>
            <p className="text-sm text-neutral-400 mb-4">Start your journey with BusBook today</p>
            <Link href="/search">
              <Button className="bg-saffron hover:bg-saffron-dark text-white font-semibold rounded-xl h-10 px-6">
                <Search className="h-4 w-4 mr-2" /> Book a Bus
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((booking) => (
              <BookingCard key={booking.id} booking={booking} compact />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
