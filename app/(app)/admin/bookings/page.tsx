'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getBookingRequests } from '@/lib/api'
import { Users, Calendar, MapPin } from 'lucide-react'
import type { BookingRequest } from '@/lib/types'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/admin/login')
        return
      }

      const role = user.user_metadata?.role
      if (role !== 'admin') {
        router.push('/')
        return
      }

      try {
        const data = await getBookingRequests()
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
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">View all booking requests</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-6 mb-8 border-b border-border pb-4">
        <button
          onClick={() => router.push('/admin/operators')}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-4 -mb-[18px]"
        >
          <Users className="h-4 w-4" />
          Operators
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary border-b-2 border-primary pb-4 -mb-[18px]">
          <Calendar className="h-4 w-4" />
          Bookings
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border mt-8 shadow-sm">
          <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No bookings yet.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm mt-8">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Operator</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((booking) => {
                const statusClassMap: Record<string, string> = {
                  pending: 'bg-amber-100 text-amber-700',
                  contacted: 'bg-blue-100 text-blue-700',
                }
                const statusClass = statusClassMap[booking.status] ?? 'bg-green-100 text-green-700'
                
                return (
                <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-5 text-sm font-medium text-foreground">
                    {booking.customer_name || '-'}
                  </td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {booking.bus_details?.operator_name || '-'}
                  </td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {booking.pickup_location} → {booking.drop_location}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {new Date(booking.trip_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {booking.customer_phone}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
