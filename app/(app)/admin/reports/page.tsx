'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3, IndianRupee, TrendingUp, Ticket } from 'lucide-react'

interface ReportSummary {
  totalBookings: number
  totalRevenue: number
  totalCommission: number
  statusCounts: Record<string, number>
}

interface MonthlyData {
  month: string
  revenue: number
  bookings: number
  commission: number
}

interface ReportsData {
  summary: ReportSummary
  monthly: MonthlyData[]
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

function StatCard({ title, value, icon: Icon, description }: Readonly<{
  title: string
  value: string
  icon: React.ElementType
  description?: string
}>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold font-display">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

function MonthlyChart({ data }: Readonly<{ data: MonthlyData[] }>) {
  if (data.length === 0) return null
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Monthly Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-48">
          {data.map((d) => {
            const height = Math.max((d.revenue / maxRevenue) * 100, 4)
            const label = new Date(d.month + '-01').toLocaleDateString('en-IN', { month: 'short' })
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{d.bookings}</span>
                <div
                  className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors"
                  style={{ height: `${height}%` }}
                  title={`${label}: ${formatCurrency(d.revenue)} (${d.bookings} bookings)`}
                />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  contacted: 'Contacted',
  completed: 'Completed',
  cancelled: 'Cancelled',
  confirmed: 'Confirmed',
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline',
  contacted: 'secondary',
  completed: 'default',
  cancelled: 'destructive',
  confirmed: 'default',
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/admin/reports')
        if (!res.ok) throw new Error('Failed to fetch reports')
        const json: ReportsData = await res.json()
        setData(json)
      } catch (err) {
        console.error('Error fetching reports', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold tracking-tight">Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`stat-${String(i)}`} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Failed to load report data.</p>
      </div>
    )
  }

  const { summary, monthly } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Reports
        </h1>
        <p className="text-muted-foreground mt-1">Platform performance and analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={String(summary.totalBookings)}
          icon={Ticket}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          icon={IndianRupee}
        />
        <StatCard
          title="Platform Commission"
          value={formatCurrency(summary.totalCommission)}
          icon={TrendingUp}
          description="From all bookings"
        />
        <StatCard
          title="Avg. Booking Value"
          value={summary.totalBookings > 0 ? formatCurrency(summary.totalRevenue / summary.totalBookings) : '₹0'}
          icon={BarChart3}
        />
      </div>

      {/* Monthly Chart */}
      <MonthlyChart data={monthly} />

      {/* Booking Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(summary.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted">
                <Badge variant={statusColors[status] ?? 'outline'}>
                  {statusLabels[status] ?? status}
                </Badge>
                <span className="text-lg font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Month</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Bookings</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Commission</th>
                </tr>
              </thead>
              <tbody>
                {[...monthly].reverse().map((m) => (
                  <tr key={m.month} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">
                      {new Date(m.month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{m.bookings}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(m.revenue)}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{formatCurrency(m.commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
