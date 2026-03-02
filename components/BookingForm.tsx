'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createBookingRequest } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Calendar, Users, Phone, CheckCircle } from 'lucide-react'
import { AddressAutocomplete } from '@/components/AddressAutocomplete'

interface BookingFormProps {
  busId: string
}

export function BookingForm({ busId }: BookingFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    pickup_location: '',
    drop_location: '',
    trip_date: '',
    passenger_count: '',
    customer_phone: '',
  })

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return null
    }
    return user
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await checkAuth()
      if (!user) return

      await createBookingRequest({
        bus: busId,
        pickup_location: formData.pickup_location,
        drop_location: formData.drop_location,
        trip_date: formData.trip_date,
        passenger_count: parseInt(formData.passenger_count),
        customer_phone: formData.customer_phone,
      })

      setSuccess(true)
      setFormData({
        pickup_location: '',
        drop_location: '',
        trip_date: '',
        passenger_count: '',
        customer_phone: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit booking')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Booking Sent!
            </h3>
            <p className="text-green-700 text-sm">
              Operator will contact you directly.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-green-300 text-green-700 hover:bg-green-100"
              onClick={() => setSuccess(false)}
            >
              Book Another
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-border">
      <CardHeader>
        <CardTitle className="font-display text-2xl tracking-tight text-primary">Book This Bus</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="pickup_location" className="text-foreground font-medium">Pickup Location</Label>
            <AddressAutocomplete
              id="pickup_location"
              placeholder="Enter pickup address"
              className=""
              value={formData.pickup_location}
              onChange={(val) => setFormData({ ...formData, pickup_location: val })}
              required
              icon={<MapPin className="h-4 w-4 text-muted-foreground mr-1" />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drop_location" className="text-foreground font-medium">Drop Location</Label>
            <AddressAutocomplete
              id="drop_location"
              placeholder="Enter drop address"
              className=""
              value={formData.drop_location}
              onChange={(val) => setFormData({ ...formData, drop_location: val })}
              required
              icon={<MapPin className="h-4 w-4 text-muted-foreground mr-1" />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trip_date" className="text-foreground font-medium">Trip Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="trip_date"
                type="date"
                className="pl-10"
                value={formData.trip_date}
                onChange={(e) => setFormData({ ...formData, trip_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passenger_count" className="text-foreground font-medium">Passengers</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="passenger_count"
                type="number"
                min="1"
                placeholder="Number of passengers"
                className="pl-10"
                value={formData.passenger_count}
                onChange={(e) => setFormData({ ...formData, passenger_count: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_phone" className="text-foreground font-medium">Your Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="customer_phone"
                type="tel"
                placeholder="Your phone number"
                className="pl-10"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-display font-semibold tracking-wide shadow-md shadow-primary/20 rounded-lg py-5 mt-2"
            disabled={loading}
          >
            {loading ? 'Sending Request...' : 'Send Booking Request'}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Operator will call you after receiving the request
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
