'use client'

import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
  /** Show bus-card style skeleton */
  variant?: 'bus-card' | 'popular-route' | 'review' | 'default'
}

function Shimmer({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={cn(
        'bg-slate-200 dark:bg-slate-700 rounded animate-pulse',
        className
      )}
      style={style}
    />
  )
}

function BusCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex gap-4">
      {/* Image */}
      <Shimmer className="hidden md:block flex-shrink-0 w-40 h-28 rounded-lg" />

      <div className="flex-1 space-y-3">
        {/* Header row */}
        <div className="flex items-center gap-3">
          <Shimmer className="h-5 w-28" />
          <Shimmer className="h-4 w-20" />
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2">
          <Shimmer className="h-6 w-16" />
          <Shimmer className="h-1 flex-1 rounded-full" />
          <Shimmer className="h-6 w-16" />
        </div>

        {/* Rating row */}
        <div className="flex gap-2">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-4 w-20" />
        </div>

        {/* Amenities */}
        <div className="flex gap-2 flex-wrap">
          {[80, 100, 90, 110].map((w, i) => (
            <Shimmer key={i} className="h-4" style={{ width: `${w}px` }} />
          ))}
        </div>

        {/* Price + buttons */}
        <div className="flex items-center justify-between mt-2">
          <Shimmer className="h-7 w-24" />
          <div className="flex gap-2">
            <Shimmer className="h-10 w-28 rounded-lg" />
            <Shimmer className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PopularRouteSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden w-72 flex-shrink-0">
      <Shimmer className="w-full h-36" />
      <div className="p-4 space-y-2">
        <Shimmer className="h-5 w-32" />
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-9 w-full rounded-lg mt-2" />
      </div>
    </div>
  )
}

function ReviewSkeleton() {
  return (
    <div className="border border-slate-200 rounded-xl p-5 space-y-3">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Shimmer key={i} className="w-4 h-4 rounded" />
        ))}
      </div>
      <Shimmer className="h-5 w-48" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-3/4" />
      <Shimmer className="h-3 w-32" />
    </div>
  )
}

export function SkeletonCard({
  className,
  variant = 'default',
}: SkeletonCardProps) {
  if (variant === 'bus-card') return <BusCardSkeleton />
  if (variant === 'popular-route') return <PopularRouteSkeleton />
  if (variant === 'review') return <ReviewSkeleton />

  return (
    <div className={cn('rounded-xl border border-slate-200 p-6 bg-white space-y-3', className)}>
      <Shimmer className="h-5 w-3/4" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-5/6" />
      <Shimmer className="h-10 w-32 rounded-lg" />
    </div>
  )
}

export function BusCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <BusCardSkeleton key={i} />
      ))}
    </div>
  )
}
