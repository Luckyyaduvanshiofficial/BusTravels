'use client'

import { cn } from '@/lib/utils'

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-neutral-100 rounded-lg',
        "after:absolute after:inset-0 after:translate-x-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:animate-shimmer",
        className,
      )}
    />
  )
}

export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
      <div className="flex gap-4">
        <Shimmer className="w-24 h-20 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2.5">
          <Shimmer className="h-4 w-2/3 rounded" />
          <Shimmer className="h-3 w-1/3 rounded" />
          <div className="flex gap-4">
            <Shimmer className="h-3 w-24 rounded" />
            <Shimmer className="h-3 w-20 rounded" />
          </div>
          <div className="flex justify-between">
            <Shimmer className="h-6 w-20 rounded-full" />
            <Shimmer className="h-7 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
            <Shimmer className="h-3 w-16 rounded mb-2" />
            <Shimmer className="h-8 w-12 rounded" />
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <Shimmer className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Shimmer className="h-5 w-40 rounded" />
          <Shimmer className="h-4 w-28 rounded" />
        </div>
      </div>
      {/* Fields */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Shimmer className="h-3 w-20 rounded" />
          <Shimmer className="h-12 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )
}

export function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
      <Shimmer className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Shimmer className="h-5 w-2/3 rounded" />
        <Shimmer className="h-4 w-1/2 rounded" />
        <div className="flex gap-2">
          <Shimmer className="h-6 w-12 rounded-full" />
          <Shimmer className="h-6 w-12 rounded-full" />
        </div>
        <Shimmer className="h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}
