'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAllOperators, verifyOperator } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Users, CheckCircle, XCircle, Calendar } from 'lucide-react'
import type { User } from '@/lib/types'

export default function AdminOperatorsPage() {
  const [operators, setOperators] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const fetchOperators = async () => {
    try {
      const data = await getAllOperators()
      setOperators(data)
    } catch (error) {
      console.error('Failed to fetch operators:', error)
    } finally {
      setLoading(false)
    }
  }

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

      fetchOperators()
    }

    checkAuth()
  }, [supabase, router])

  const handleVerify = async (userId: string) => {
    setVerifying(userId)
    try {
      await verifyOperator(userId)
      await fetchOperators()
    } catch (error) {
      console.error('Failed to verify operator:', error)
    } finally {
      setVerifying(null)
    }
  }

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
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Fleet Operators</h1>
          <p className="text-muted-foreground mt-1">Verify and manage operator accounts</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-6 mb-8 border-b border-border pb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary border-b-2 border-primary pb-4 -mb-[18px]">
          <Users className="h-4 w-4" />
          Operators
        </div>
        <button
          onClick={() => router.push('/admin/bookings')}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-4 -mb-[18px]"
        >
          <Calendar className="h-4 w-4" />
          Bookings
        </button>
      </div>

      {operators.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border mt-8 shadow-sm">
          <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No operators registered yet.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm mt-8">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {operators.map((operator) => (
                <tr key={operator.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-5 text-sm font-medium text-foreground">{operator.name || '-'}</td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">{operator.email}</td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">{operator.phone || '-'}</td>
                  <td className="px-6 py-4">
                    {operator.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <XCircle className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {!operator.is_verified && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerify(operator.id.toString())}
                        disabled={verifying === operator.id.toString()}
                      >
                        {verifying === operator.id ? 'Verifying...' : 'Verify'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
