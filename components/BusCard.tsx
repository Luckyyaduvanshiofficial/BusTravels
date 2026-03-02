'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Users, Snowflake } from 'lucide-react'
import type { Bus } from '@/lib/types'

interface BusCardProps {
  bus: Bus
}

export function BusCard({ bus }: Readonly<BusCardProps>) {
  const imageUrl = bus.images?.[0] || '/placeholder-bus.jpg'
  const acLabel = bus.ac_type === 'ac' ? 'AC' : 'Non-AC'
  const busTypeLabel = bus.bus_type.replaceAll('_', ' ')

  return (
    <Link
      href={`/bus/${bus.id}`}
      className="group block bg-card rounded-xl border border-border overflow-hidden hover:border-ring hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        <Image
          src={imageUrl}
          alt={bus.name || bus.model_name || 'Bus'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              bus.ac_type === 'ac'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <Snowflake className="h-3 w-3" />
              {acLabel}
            </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-accent transition-colors">
          {bus.name || bus.model_name}
        </h3>
        
          <p className="text-sm text-muted-foreground mb-3">
            {bus.model_name} • {busTypeLabel}
          </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{bus.seating_capacity} seats</span>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-muted-foreground/70">Starting from</p>
            <p className="font-bold text-lg text-foreground">
              ₹{(bus.base_fare || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
