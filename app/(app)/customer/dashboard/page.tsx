'use client'

import { useEffect, useState } from 'react'
import type { SVGProps } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getMyBookingRequests } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Search } from 'lucide-react'
import type { BookingRequest } from '@/lib/types'

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      try {
        const data = await getMyBookingRequests()
        setBookings(data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-primary">My Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your bookings and travel history.</p>
        </div>
        <Link href="/search">
          <Button className="bg-primary hover:bg-primary-dark font-display font-semibold px-6 shadow-md rounded-full">
            <Search className="h-4 w-4 mr-2" />
            Book a Bus
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="shadow-lg shadow-primary/5 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display font-bold text-primary">{bookings.length}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-display font-bold tracking-tight text-foreground mb-6">Recent Bookings</h2>
      
      {bookings.length === 0 ? (
        <Card className="bg-muted/30 border-dashed shadow-none p-12 text-center">
          <BusIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h3>
          <p className="text-muted-foreground mb-6">You haven&rsquo;t booked any trips. Start exploring destinations!</p>
          <Link href="/search">
            <Button variant="outline" className="font-semibold">Explore Buses</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {bookings.slice(0, 5).map((booking) => (
            <Card key={booking.id} className="overflow-hidden shadow-md shadow-black/5 hover:shadow-lg transition-all border-border">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                      {booking.status}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">#{booking.booking_number || booking.id.substring(0, 8)}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-4">{booking.bus_details?.name || 'Bus Journey'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="truncate">{booking.pickup_location} → {booking.drop_location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{new Date(booking.trip_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function BusIcon(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6v6" />
      <path d="M15 6v6" />
      <path d="M2 12h19.6" />
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
      <circle cx="7" cy="18" r="2" />
      <path d="M9 18h5" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  )
}
