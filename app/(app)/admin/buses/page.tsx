'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Bus,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  MapPin,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface Vehicle {
  id: string
  name: string
  model_name: string
  bus_type: string
  seating_capacity: number
  base_fare: string
  approval_status: string
  home_city: string
  amenities: string[]
  images: string[]
  created_at: string
  operator: {
    id: string
    name: string
    email: string
    phone: string
  } | null
}

const approvalBadge: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
}

export default function AdminBusesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; vehicleId: string | null; vehicleName: string }>({
    open: false,
    vehicleId: null,
    vehicleName: '',
  })
  const [rejectionReason, setRejectionReason] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '15' })
      if (filter !== 'all') params.set('status', filter)
      const res = await fetch(`/api/admin/vehicles?${params}`)
      if (!res.ok) throw new Error('Failed to fetch vehicles')
      const data = await res.json()
      setVehicles(data.vehicles)
      setTotalPages(data.total_pages)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }, [page, filter])

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.user_metadata?.role !== 'admin') {
        router.push(user ? '/' : '/admin/login')
        return
      }
      fetchVehicles()
    }
    checkAuth()
  }, [supabase, router, fetchVehicles])

  const handleApprove = async (vehicleId: string) => {
    setActionLoading(vehicleId)
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })
      if (!res.ok) throw new Error('Failed to approve')
      const result = await res.json()
      toast.success(result.message)
      fetchVehicles()
    } catch {
      toast.error('Failed to approve vehicle')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectDialog.vehicleId) return
    setActionLoading(rejectDialog.vehicleId)
    try {
      const res = await fetch(`/api/admin/vehicles/${rejectDialog.vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejection_reason: rejectionReason }),
      })
      if (!res.ok) throw new Error('Failed to reject')
      const result = await res.json()
      toast.success(result.message)
      setRejectDialog({ open: false, vehicleId: null, vehicleName: '' })
      setRejectionReason('')
      fetchVehicles()
    } catch {
      toast.error('Failed to reject vehicle')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage vehicle listings and approvals</p>
        </div>
        <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : null}

      {!loading && vehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bus className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">No vehicles found</p>
            <p className="text-sm text-muted-foreground">
              {filter === 'all' ? 'No vehicles have been registered yet' : 'Try changing the filter'}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {!loading && vehicles.length > 0 ? (
        <div className="grid gap-4">
          {vehicles.map((vehicle) => {
            const badge = approvalBadge[vehicle.approval_status] || approvalBadge.pending
            return (
              <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Bus className="h-3.5 w-3.5" />
                          {vehicle.model_name} • {vehicle.bus_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {vehicle.seating_capacity} seats
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {Number.parseFloat(vehicle.base_fare).toLocaleString('en-IN')}/day
                        </span>
                        {vehicle.home_city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {vehicle.home_city}
                          </span>
                        )}
                      </div>
                      {vehicle.operator && (
                        <p className="text-xs text-muted-foreground">
                          Operator: {vehicle.operator.name || vehicle.operator.email}
                          {vehicle.operator.phone && ` • ${vehicle.operator.phone}`}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Registered {new Date(vehicle.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    {vehicle.approval_status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(vehicle.id)}
                          disabled={actionLoading === vehicle.id}
                        >
                          {actionLoading === vehicle.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setRejectDialog({
                              open: true,
                              vehicleId: vehicle.id,
                              vehicleName: vehicle.name,
                            })
                          }
                          disabled={actionLoading === vehicle.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {vehicle.approval_status === 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(vehicle.id)}
                        disabled={actionLoading === vehicle.id}
                      >
                        {actionLoading === vehicle.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Re-approve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : null}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => {
        if (!open) {
          setRejectDialog({ open: false, vehicleId: null, vehicleName: '' })
          setRejectionReason('')
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Vehicle</DialogTitle>
            <DialogDescription>
              Reject &quot;{rejectDialog.vehicleName}&quot;? The operator will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, vehicleId: null, vehicleName: '' })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading !== null}>
              {actionLoading === null ? null : <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Reject Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
