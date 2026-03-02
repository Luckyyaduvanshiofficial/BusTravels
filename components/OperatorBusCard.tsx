'use client'

import Link from 'next/link'
import { Plus, Bus, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Bus as BusType } from '@/lib/types'

interface OperatorBusCardProps {
  bus: BusType
}

export function OperatorBusCard({ bus }: OperatorBusCardProps) {
  const router = useRouter()
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 bg-muted/50 rounded-xl flex items-center justify-center border border-border/50">
          {bus.images?.[0] ? (
            <img
              src={bus.images[0]}
              alt={bus.name || bus.model_name || 'Bus'}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <Bus className="h-8 w-8 text-muted-foreground/50" />
          )}
        </div>
        <div>
           <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{bus.name || bus.model_name}</h3>
           <p className="text-sm font-medium text-muted-foreground mt-0.5">{bus.model_name || 'Standard Coach'} • {bus.seating_capacity} seats</p>
           <p className="text-sm font-semibold text-primary mt-1.5">
            <span className="font-semibold">{bus.model_name || 'Standard'}</span> • ₹{bus.base_fare?.toLocaleString() || '0'}
          </p>
        </div>
      </div>
      <Link
        href={`/operator/dashboard/buses/${bus.id}/edit`}
        className="px-5 py-2.5 text-sm font-semibold text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors bg-background/50 shadow-sm"
      >
        Edit Details
      </Link>
    </div>
  )
}
