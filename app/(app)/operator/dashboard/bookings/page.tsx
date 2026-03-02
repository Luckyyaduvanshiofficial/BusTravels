'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getOperatorBookingRequests } from '@/lib/api'
import { Bus, Calendar, MapPin, Phone, User } from 'lucide-react'
import type { BookingRequest } from '@/lib/types'

export default function OperatorBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/operator/login')
        return
      }

      const role = user.user_metadata?.role
      if (role !== 'operator') {
        router.push('/')
        return
      }

      try {
        const data = await getOperatorBookingRequests()
        setBookings(data)
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Booking Requests</h1>
          <p className="text-muted-foreground mt-1">Customers who want to book your buses</p>
        </div>
      </div>

      <div className="flex gap-6 mb-8 border-b border-border pb-4">
        <button
          onClick={() => router.push('/operator/dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-4 -mb-[18px]"
        >
          <Bus className="h-4 w-4" />
          My Buses
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary border-b-2 border-primary pb-4 -mb-[18px]">
          <Calendar className="h-4 w-4" />
          Booking Requests
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border mt-8 shadow-sm">
          <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium mb-1">No booking requests yet.</p>
          <p className="text-sm text-muted-foreground/70">Customers will contact you after booking.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground tracking-tight">
                    {booking.customer_name || 'Customer'}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    {booking.bus_details?.name || booking.bus_details?.model_name}
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm">
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/50">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">{booking.pickup_location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">{booking.drop_location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">{new Date(booking.trip_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">{booking.passenger_count} passengers</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <a
                  href={`tel:${booking.customer_phone}`}
                  className="inline-flex items-center gap-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-lg border border-primary/10"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  {booking.customer_phone}
                </a>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact customer to confirm booking
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
