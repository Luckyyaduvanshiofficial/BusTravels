'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  IndianRupee,
  Clock,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Calendar,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'

interface EarningsData {
  total_earnings: number
  completed_bookings: number
  pending_earnings: number
  pending_bookings: number
  monthly_earnings: Array<{ month: string; amount: number; label: string }>
  recent_transactions: Array<{
    id: number
    booking_number: string
    total_amount: string
    created_at: string
    customer_name: string
    status: string
    trip_date: string
  }>
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
}

export default function OperatorEarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.user_metadata?.role !== 'operator') {
        router.push(user ? '/' : '/operator/login')
        return
      }

      try {
        const res = await fetch('/api/operator/earnings')
        if (!res.ok) throw new Error('Failed')
        const earnings = await res.json()
        setData(earnings)
      } catch {
        console.error('Failed to load earnings')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [supabase, router])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) return null

  const maxMonthly = Math.max(...data.monthly_earnings.map((m) => m.amount), 1)

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/operator/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground mt-1">Track your revenue and payments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(data.total_earnings)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-green-500/10">
                <IndianRupee className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Trips</p>
                <p className="text-2xl font-bold mt-1">{data.completed_bookings}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <CheckCircle className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Earnings</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(data.pending_earnings)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Trips</p>
                <p className="text-2xl font-bold mt-1">{data.pending_bookings}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Earnings
          </CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-48">
            {data.monthly_earnings.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {month.amount > 0 ? formatCurrency(month.amount) : '—'}
                </span>
                <div
                  className="w-full bg-primary/80 rounded-t-md min-h-[4px] transition-all"
                  style={{
                    height: `${Math.max((month.amount / maxMonthly) * 160, 4)}px`,
                  }}
                />
                <span className="text-xs text-muted-foreground">{month.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <CardDescription>Your latest booking payments</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recent_transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <IndianRupee className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recent_transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">#{tx.booking_number}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          statusColors[tx.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tx.customer_name} •{' '}
                      {new Date(tx.trip_date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {formatCurrency(Number.parseFloat(tx.total_amount) || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
