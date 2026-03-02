'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number           // e.g. 4.5
  reviewCount?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  className?: string
}

const sizeMap = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

const textMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function StarRating({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
  className,
}: StarRatingProps) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  const empty = 5 - full - (hasHalf ? 1 : 0)

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      aria-label={`Rating: ${rating} out of 5${reviewCount ? `, ${reviewCount} reviews` : ''}`}
    >
      {/* Full stars */}
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(sizeMap[size], 'fill-amber-400 text-amber-400')}
          aria-hidden="true"
        />
      ))}

      {/* Half star */}
      {hasHalf && (
        <span className="relative inline-block" aria-hidden="true">
          <Star className={cn(sizeMap[size], 'text-gray-200 fill-gray-200')} />
          <span className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={cn(sizeMap[size], 'fill-amber-400 text-amber-400')} />
          </span>
        </span>
      )}

      {/* Empty stars */}
      {Array.from({ length: empty }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(sizeMap[size], 'text-gray-200 fill-gray-200')}
          aria-hidden="true"
        />
      ))}

      {showCount && (
        <span className={cn(textMap[size], 'text-slate-600 ml-0.5 font-medium')}>
          {rating.toFixed(1)}
        </span>
      )}

      {showCount && reviewCount !== undefined && (
        <span className={cn(textMap[size], 'text-slate-400')}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}
