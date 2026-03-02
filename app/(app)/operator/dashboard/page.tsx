'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getMyBuses } from '@/lib/api'
import { OperatorBusCard } from '@/components/OperatorBusCard'
import { Button } from '@/components/ui/button'
import { Plus, Bus, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Bus as BusType } from '@/lib/types'

export default function OperatorDashboardPage() {
  const [buses, setBuses] = useState<BusType[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email: string; is_verified: boolean; is_profile_complete: boolean } | null>(null)
  const [rcNumber, setRcNumber] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [submittingDoc, setSubmittingDoc] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      
      if (!supabaseUser) {
        router.push('/operator/login')
        return
      }

      const role = supabaseUser.user_metadata?.role
      if (role !== 'operator') {
        router.push('/')
        return
      }

      // Get user details from DB
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('email, is_verified, profile_completion')
          .eq('id', supabaseUser.id)
          .single()

        setUser({
          email: dbUser?.email || supabaseUser.email || '',
          is_verified: dbUser?.is_verified ?? false,
          is_profile_complete: (dbUser?.profile_completion ?? 0) >= 100,
        })
      } catch {
        setUser({
          email: supabaseUser.email || '',
          is_verified: supabaseUser.user_metadata?.is_verified || false,
          is_profile_complete: false,
        })
      }

      try {
        const data = await getMyBuses()
        setBuses(data)
      } catch (error) {
        console.error('Failed to fetch buses:', error)
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
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">My Buses</h1>
          <p className="text-muted-foreground mt-1">{user?.email}</p>
        </div>
        {user?.is_verified ? (
          <Link href="/operator/dashboard/buses/new">
            <Button className="bg-primary hover:bg-primary-dark text-white font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Add Bus
            </Button>
          </Link>
        ) : null}
        {!user?.is_verified && !user?.is_profile_complete ? (
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-semibold">
              Pending Profile Completion. Please submit your RC and License below to continue.
            </p>
          </div>
        ) : null}
        {!user?.is_verified && user?.is_profile_complete ? (
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              Your account is pending verification from Admins. You cannot add buses until approved.
            </p>
          </div>
        ) : null}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-6 mb-8 border-b border-border pb-4">
        <Link
          href="/operator/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-primary border-b-2 border-primary pb-4 -mb-[18px]"
        >
          <Bus className="h-4 w-4" />
          My Buses
        </Link>
        <Link
          href="/operator/dashboard/bookings"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-4 -mb-[18px]"
        >
          <Calendar className="h-4 w-4" />
          Booking Requests
        </Link>
      </div>

      {!user?.is_profile_complete && (
        <div className="bg-card rounded-2xl border border-border mt-8 p-6 shadow-sm mb-6 max-w-lg">
          <h2 className="text-xl font-display font-semibold mb-4">Complete Your Profile</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="license" className="text-muted-foreground">Licence Number</Label>
              <Input 
                id="license"
                type="text" 
                value={licenseNumber} 
                onChange={e => setLicenseNumber(e.target.value)} 
                placeholder="RJ14 20200000000"
              />
            </div>
            <div>
              <Label htmlFor="rc" className="text-muted-foreground">RC Number</Label>
              <Input 
                id="rc"
                type="text" 
                value={rcNumber} 
                onChange={e => setRcNumber(e.target.value)} 
                placeholder="RC-239482934"
              />
            </div>
            <Button 
               disabled={submittingDoc || !licenseNumber || !rcNumber}
               onClick={async () => {
                 setSubmittingDoc(true)
                 try {
                   const { completeOperatorProfile } = await import('@/lib/api')
                   await completeOperatorProfile({ license_number: licenseNumber, rc_number: rcNumber })
                   globalThis.location.reload()
                 } catch (e) {
                   console.error('Failed to submit docs', e)
                 }
                 setSubmittingDoc(false)
               }}
            >
               {submittingDoc ? 'Submitting...' : 'Submit Documents'}
            </Button>
          </div>
        </div>
      )}

      {buses.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border mt-8 shadow-sm">
          <Bus className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium mb-6">No buses added yet.</p>
          {user?.is_verified && (
            <Link href="/operator/dashboard/buses/new">
              <Button variant="outline">Add Your First Bus</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {buses.map((bus) => (
            <OperatorBusCard key={bus.id} bus={bus} />
          ))}
        </div>
      )}
    </div>
  )
}
