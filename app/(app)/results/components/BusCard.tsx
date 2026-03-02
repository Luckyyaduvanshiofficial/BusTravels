'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/shared/StarRating'
import { cn } from '@/lib/utils'
import { cardSlideUp, hoverLift } from '@/lib/animations'
import type { BusRoute } from '@/lib/search-types'

interface BusCardProps {
  bus: BusRoute
  isSelected?: boolean
  onSelect?: (id: string) => void
  searchParams?: {
    from: string
    to: string
    date: string
    passengers: string
  }
}

const BUS_TYPE_COLORS: Record<string, string> = {
  'AC Sleeper': 'bg-blue-50 text-blue-700 border-blue-200',
  'Non-AC Sleeper': 'bg-slate-50 text-slate-700 border-slate-200',
  'Seater': 'bg-green-50 text-green-700 border-green-200',
  'Luxury': 'bg-purple-50 text-purple-700 border-purple-200',
}

/**
 * Bus Card – full detailed spec from search.md PAGE 2.
 *
 * Desktop layout: image (160×120) | info column
 * Info column:
 *   - Bus type badge + operator name + verified badge
 *   - Timeline: 22:00 ──6h──→ 04:00
 *   - Star rating + review count
 *   - Amenities bullet list
 *   - Price + [View Seats] [View Details]
 *
 * Hover: lift 2px, shadow increase
 * Selected: 2px orange border, faint orange bg
 */
export function BusCard({
  bus,
  isSelected = false,
  onSelect,
  searchParams,
}: BusCardProps) {
  const router = useRouter()
  const [imgError, setImgError] = useState(false)

  const seatUrl = searchParams
    ? `/booking/seat-selection?${new URLSearchParams({
        busId: bus.id,
        from: searchParams.from,
        to: searchParams.to,
        date: searchParams.date,
        passengers: searchParams.passengers,
      })}`
    : `/booking/seat-selection?busId=${encodeURIComponent(bus.id)}`

  const detailUrl = `/vehicle/${bus.id}`

  const availabilityClass =
    bus.availableSeats === 0
      ? 'text-red-500'
      : bus.availableSeats <= 5
      ? 'text-amber-600'
      : 'text-emerald-600'

  return (
    <motion.article
      variants={cardSlideUp}
      whileHover={hoverLift}
      onClick={() => onSelect?.(bus.id)}
      className={cn(
        'bg-white rounded-xl border transition-all duration-200 cursor-pointer',
        'shadow-[0_1px_3px_rgba(0,0,0,0.1)]',
        isSelected
          ? 'border-[#F97316] border-2 bg-[rgba(249,115,22,0.02)] shadow-[0_4px_12px_rgba(249,115,22,0.15)]'
          : 'border-[#E2E8F0] hover:border-[#F97316]/30'
      )}
      aria-label={`${bus.busType} bus from ${bus.fromCity} to ${bus.toCity} by ${bus.operatorName}. ₹${bus.pricePerSeat} per seat.`}
      role="article"
    >
      <div className="flex flex-col md:flex-row">
        {/* ── LEFT: Image (160×120 desktop, full-width mobile) ──────── */}
        <div className="relative md:w-40 md:h-[120px] h-48 w-full flex-shrink-0 rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden bg-slate-100">
          {!imgError && bus.images[0] ? (
            <Image
              src={bus.images[0]}
              alt={`${bus.busName} bus image`}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-[#334155] flex flex-col items-center justify-center gap-2">
              <span className="text-4xl" aria-hidden="true">🚌</span>
              <span className="text-white/60 text-xs">{bus.busType}</span>
            </div>
          )}

          {/* Gallery badge */}
          {bus.images.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
              {bus.images.length} photos
            </div>
          )}
        </div>

        {/* ── RIGHT: Details ────────────────────────────────────────── */}
        <div className="flex-1 p-5 flex flex-col gap-3">
          {/* Row 1: Bus type + Operator + Route */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded-full border',
                    BUS_TYPE_COLORS[bus.busType] ?? 'bg-slate-100 text-slate-700 border-slate-200'
                  )}
                >
                  {bus.busType}
                </span>
                {bus.operatorVerified && (
                  <span className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <h3 className="text-[18px] font-semibold text-[#1E293B] leading-tight">
                {bus.busName}
              </h3>
              <p className="text-sm text-[#64748B] mt-0.5">{bus.operatorName}</p>
            </div>

            {/* Availability badge */}
            <div className={cn('text-xs font-medium flex items-center gap-1', availabilityClass)}>
              <Zap className="w-3 h-3" />
              {bus.availableSeats === 0
                ? 'Sold out'
                : bus.availableSeats <= 5
                ? `Only ${bus.availableSeats} seats left`
                : `${bus.availableSeats} seats available`}
            </div>
          </div>

          {/* Row 2: Timeline */}
          <div
            className="flex items-center gap-3"
            aria-label={`Departs ${bus.departureTime} from ${bus.fromCity}, arrives ${bus.arrivalTime} at ${bus.toCity}, duration ${bus.durationHours} hours`}
          >
            <div className="text-center min-w-[52px]">
              <span className="text-[20px] font-bold text-[#1E293B] leading-none block">
                {bus.departureTime}
              </span>
              <span className="text-xs text-[#64748B]">{bus.fromCity}</span>
            </div>

            <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
              <div className="flex items-center gap-1 w-full">
                <div className="h-0.5 flex-1 bg-[#E2E8F0] rounded-full" />
                <Badge
                  variant="secondary"
                  className="text-[10px] leading-none px-1.5 py-0.5 bg-slate-100 text-[#64748B] flex items-center gap-0.5"
                >
                  <Clock className="w-2.5 h-2.5" />
                  {bus.durationHours}h
                </Badge>
                <div className="h-0.5 flex-1 bg-[#E2E8F0] rounded-full" />
              </div>
              <ChevronRight className="w-3 h-3 text-[#64748B]" />
            </div>

            <div className="text-center min-w-[52px]">
              <span className="text-[20px] font-bold text-[#1E293B] leading-none block">
                {bus.arrivalTime}
              </span>
              <span className="text-xs text-[#64748B]">{bus.toCity}</span>
            </div>
          </div>

          {/* Row 3: Rating + Amenities */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <StarRating
              rating={bus.rating}
              reviewCount={bus.reviewCount}
              size="sm"
            />

            {bus.amenities.length > 0 && (
              <ul
                className="flex flex-wrap gap-x-3 gap-y-1"
                aria-label="Amenities"
              >
                {bus.amenities.slice(0, 4).map((a) => (
                  <li
                    key={a}
                    className="text-xs text-[#64748B] flex items-center gap-1"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0"
                      aria-hidden="true"
                    />
                    {a}
                  </li>
                ))}
                {bus.amenities.length > 4 && (
                  <li className="text-xs text-[#F97316]">
                    +{bus.amenities.length - 4} more
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Row 4: Price + Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#F8FAFC] mt-auto">
            {/* Price */}
            <div
              className="bg-[#F8FAFC] rounded-lg px-3 py-2 inline-flex flex-col"
              aria-label={`Starting from ₹${bus.pricePerSeat} per seat`}
            >
              <span className="text-[11px] text-[#64748B] leading-none">Starting from</span>
              <span className="text-[24px] font-bold text-[#1E293B] leading-tight">
                ₹{bus.pricePerSeat.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-[#64748B] ml-1">/ seat</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="border-[#E2E8F0] text-[#1E293B] hover:bg-slate-50 hover:border-slate-300 h-10 px-4 rounded-lg text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(detailUrl)
                }}
                aria-label={`View details for ${bus.busName}`}
              >
                View Details
              </Button>
              <Button
                size="sm"
                disabled={bus.availableSeats === 0}
                className={cn(
                  'h-10 px-4 rounded-lg text-sm font-medium text-white',
                  'bg-[#F97316] hover:bg-[#EA580C]',
                  'transition-all hover:-translate-y-0.5',
                  'hover:shadow-[0_4px_12px_rgba(249,115,22,0.35)]',
                  'focus:ring-2 focus:ring-[#F97316] focus:ring-offset-1',
                  bus.availableSeats === 0 && 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none',
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(seatUrl)
                }}
                aria-label={`Select seats for ${bus.busName}`}
              >
                View Seats
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
