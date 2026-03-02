'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Bus,
  Users,
  CalendarCheck,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

interface AdminStats {
  total_bookings: number
  pending_bookings: number
  completed_bookings: number
  total_operators: number
  verified_operators: number
  pending_operators: number
  total_buses: number
  pending_buses: number
  approved_buses: number
  total_customers: number
  total_revenue: number
  recent_bookings: Array<{
    id: number
    booking_number: string
    status: string
    total_amount: string
    created_at: string
    customer_name: string
    bus: { name: string } | null
  }>
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'primary',
}: Readonly<{
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  trend?: string
  color?: 'primary' | 'orange' | 'green' | 'red' | 'blue'
}>) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    orange: 'bg-orange-500/10 text-orange-500',
    green: 'bg-green-500/10 text-green-500',
    red: 'bg-red-500/10 text-red-500',
    blue: 'bg-blue-500/10 text-blue-500',
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin/login')
        return
      }

      if (user.user_metadata?.role !== 'admin') {
        router.push('/')
        return
      }

      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) throw new Error('Failed to load stats')
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">{error}</p>
        <Button onClick={() => globalThis.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (!stats) return null

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.total_revenue)}
          icon={IndianRupee}
          description={`${stats.completed_bookings} completed bookings`}
          color="green"
        />
        <StatCard
          title="Total Bookings"
          value={stats.total_bookings}
          icon={CalendarCheck}
          description={`${stats.pending_bookings} pending`}
          color="blue"
        />
        <StatCard
          title="Total Operators"
          value={stats.total_operators}
          icon={Users}
          description={`${stats.pending_operators} pending verification`}
          color="orange"
        />
        <StatCard
          title="Total Vehicles"
          value={stats.total_buses}
          icon={Bus}
          description={`${stats.pending_buses} pending approval`}
          color="primary"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Customers"
          value={stats.total_customers}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Verified Operators"
          value={stats.verified_operators}
          icon={ShieldCheck}
          description={`of ${stats.total_operators} total`}
          color="green"
        />
        <StatCard
          title="Approved Vehicles"
          value={stats.approved_buses}
          icon={CheckCircle}
          description={`of ${stats.total_buses} total`}
          color="green"
        />
        <StatCard
          title="Pending Bookings"
          value={stats.pending_bookings}
          icon={Clock}
          description="Awaiting operator response"
          color="orange"
        />
      </div>

      {/* Quick Actions + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.pending_operators > 0 && (
              <Link href="/admin/operators">
                <Button variant="outline" className="w-full justify-between group">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    Review {stats.pending_operators} pending operator{stats.pending_operators > 1 ? 's' : ''}
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            {stats.pending_buses > 0 && (
              <Link href="/admin/buses">
                <Button variant="outline" className="w-full justify-between group mt-2">
                  <span className="flex items-center gap-2">
                    <Bus className="h-4 w-4 text-blue-500" />
                    Review {stats.pending_buses} pending vehicle{stats.pending_buses > 1 ? 's' : ''}
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            {stats.pending_bookings > 0 && (
              <Link href="/admin/bookings">
                <Button variant="outline" className="w-full justify-between group mt-2">
                  <span className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-yellow-500" />
                    View {stats.pending_bookings} pending booking{stats.pending_bookings > 1 ? 's' : ''}
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            {stats.pending_operators === 0 && stats.pending_buses === 0 && stats.pending_bookings === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">All caught up! No pending items.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
              <CardDescription>Latest booking requests</CardDescription>
            </div>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recent_bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recent_bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          #{booking.booking_number}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            statusColors[booking.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {booking.customer_name} • {booking.bus?.name || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {formatCurrency(Number.parseFloat(booking.total_amount) || 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.created_at).toLocaleDateString('en-IN', {
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
    </div>
  )
}
