'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/shared/StarRating'
import type { Review } from '@/lib/search-types'

interface ReviewsSectionProps {
  reviews: Review[]
  averageRating: number
  totalCount: number
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'rating_high', label: 'Highest Rating' },
  { value: 'rating_low', label: 'Lowest Rating' },
]

const PAGE_SIZE = 4

function ReviewCard({ review }: Readonly<{ review: Review }>) {
  const [helpful, setHelpful] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">
              {review.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-[#1E293B]">{review.authorName}</p>
              {review.verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" aria-label="Verified traveller" />
              )}
            </div>
            <p className="text-xs text-[#64748B]">{review.travelDate}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" showCount={false} />
      </div>

      <p className="text-sm text-[#64748B] leading-relaxed">{review.body}</p>

      <button
        type="button"
        onClick={() => setHelpful((v) => !v)}
        className={`flex items-center gap-1 text-xs transition-colors ${
          helpful ? 'text-[#F97316] font-semibold' : 'text-[#64748B] hover:text-[#F97316]'
        }`}
        aria-label={helpful ? 'Remove helpful mark' : 'Mark as helpful'}
        aria-pressed={helpful}
      >
        <ThumbsUp className={`w-3.5 h-3.5 ${helpful ? 'fill-[#F97316]' : ''}`} />
        Helpful
      </button>
    </motion.div>
  )
}

export default function ReviewsSection({ reviews, averageRating, totalCount }: Readonly<ReviewsSectionProps>) {
  const [sort, setSort] = useState<string>('recent')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const sorted = [...reviews].sort((a, b) => {
    if (sort === 'rating_high') return b.rating - a.rating
    if (sort === 'rating_low') return a.rating - b.rating
    return 0
  })

  const displayedReviews = sorted.slice(0, visible)
  const hasMore = visible < sorted.length

  return (
    <div className="space-y-5" id="reviews">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-3xl font-bold text-[#1E293B]">{averageRating.toFixed(1)}</span>
            <span className="text-[#64748B] text-sm ml-1">/ 5</span>
          </div>
          <div>
            <StarRating rating={averageRating} size="md" showCount={false} />
            <p className="text-xs text-[#64748B] mt-0.5">{totalCount} reviews</p>
          </div>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort reviews"
          className="h-9 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Review cards */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {displayedReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </AnimatePresence>
      </div>

      {/* Load more */}
      {hasMore && (
        <Button
          variant="outline"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="w-full border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC] h-11"
        >
          Load More Reviews
        </Button>
      )}
    </div>
  )
}
