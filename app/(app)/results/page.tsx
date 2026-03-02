'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StickyCompactSearch } from './components/StickyCompactSearch'
import { FiltersSidebar } from './components/FiltersSidebar'
import { MobileFiltersSheet } from './components/MobileFiltersSheet'
import { BusCard } from './components/BusCard'
import { BusCardSkeletonList } from '@/components/shared/SkeletonCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_BUS_ROUTES } from '@/lib/mock-data'
import {
  DEFAULT_FILTERS,
  type BusFilters,
  type BusRoute,
  type SortOption,
} from '@/lib/search-types'
import {
  staggerContainer,
  filterFade,
  pageFadeIn,
  getMotionVariants,
} from '@/lib/animations'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Rating: Best First' },
  { value: 'duration_asc', label: 'Duration: Shortest' },
]

const PAGE_SIZE = 8

/**
 * Results Page – Charter Bus Rental Platform
 * Spec: search.md PAGE 2: SEARCH RESULTS PAGE
 *
 * Layout: Sidebar (280px) + Results (flex-1)
 * Mobile: Full-width cards, bottom-sheet filters
 */
export default function ResultsPage() {
  const searchParams = useSearchParams()
  const reduceMotion = useReducedMotion()

  const params = {
    from: searchParams.get('from') ?? '',
    to: searchParams.get('to') ?? '',
    date: searchParams.get('date') ?? '',
    passengers: parseInt(searchParams.get('passengers') ?? '1', 10) || 1,
  }

  const [filters, setFilters] = useState<BusFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortOption>('price_asc')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const sortDropdownRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)
  const [loading] = useState(false) // In production: replace with actual loading state

  // Close sort dropdown on Escape or click-outside
  useEffect(() => {
    if (!sortOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSortOpen(false)
    }
    function handleClick(e: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [sortOpen])

  // Filter & sort
  const filtered = useMemo(() => {
    let buses = [...MOCK_BUS_ROUTES]

    // Vehicle type
    if (filters.vehicleTypes.length > 0) {
      buses = buses.filter((b) => {
        const typeMap: Record<string, string> = {
          ac_sleeper: 'AC Sleeper',
          non_ac_sleeper: 'Non-AC Sleeper',
          seater: 'Seater',
          luxury: 'Luxury',
        }
        return filters.vehicleTypes.some((vt) => b.busType === typeMap[vt])
      })
    }

    // Price range
    buses = buses.filter(
      (b) =>
        b.pricePerSeat >= filters.priceRange[0] &&
        b.pricePerSeat <= filters.priceRange[1]
    )

    // Rating
    if (filters.minRating > 0) {
      buses = buses.filter((b) => b.rating >= filters.minRating)
    }

    // Amenities
    if (filters.amenities.length > 0) {
      buses = buses.filter((b) =>
        filters.amenities.every((a) => b.amenities.includes(a))
      )
    }

    // Departure time
    if (filters.departureTimes.length > 0) {
      buses = buses.filter((b) => {
        const hour = parseInt(b.departureTime.split(':')[0], 10)
        return filters.departureTimes.some((dt) => {
          if (dt === 'morning') return hour >= 6 && hour < 12
          if (dt === 'afternoon') return hour >= 12 && hour < 18
          if (dt === 'evening') return hour >= 18 && hour < 22
          if (dt === 'night') return hour >= 22 || hour < 6
          return false
        })
      })
    }

    // Sort
    if (sort === 'price_asc') buses.sort((a, b) => a.pricePerSeat - b.pricePerSeat)
    if (sort === 'price_desc') buses.sort((a, b) => b.pricePerSeat - a.pricePerSeat)
    if (sort === 'rating_desc') buses.sort((a, b) => b.rating - a.rating)
    if (sort === 'duration_asc') buses.sort((a, b) => a.durationHours - b.durationHours)

    return buses
  }, [filters, sort])

  const visible = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page]
  )

  const hasMore = visible.length < filtered.length

  const handleFilterChange = useCallback((f: BusFilters) => {
    setFilters(f)
    setPage(1)
  }, [])

  const formattedDate = params.date
    ? new Date(params.date + 'T00:00:00').toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ''

  const motionStagger = getMotionVariants(staggerContainer, reduceMotion)
  const motionFade = getMotionVariants(filterFade, reduceMotion)

  return (
    <motion.div
      variants={getMotionVariants(pageFadeIn, reduceMotion)}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#F8FAFC]"
    >
      {/* Sticky compact search bar */}
      <StickyCompactSearch params={params} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">
          {/* ── DESKTOP SIDEBAR ──────────────────────────────────── */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <FiltersSidebar
              filters={filters}
              onChange={handleFilterChange}
              totalCount={MOCK_BUS_ROUTES.length}
              filteredCount={filtered.length}
            />
          </aside>

          {/* ── RESULTS AREA ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h1 className="text-[24px] font-bold text-[#1E293B]">
                  {filtered.length} buses available
                </h1>
                {params.from && params.to && (
                  <p className="text-sm text-[#64748B] mt-0.5">
                    {params.from} → {params.to}
                    {formattedDate && ` · ${formattedDate}`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="relative" ref={sortDropdownRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#E2E8F0] text-[#1E293B] gap-2 h-9"
                    onClick={() => setSortOpen((o) => !o)}
                    aria-expanded={sortOpen}
                    aria-haspopup="listbox"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    {SORT_OPTIONS.find((s) => s.value === sort)?.label ?? 'Sort'}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>

                  {sortOpen && (
                    <div
                      className="absolute right-0 top-full mt-1 z-20 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 min-w-[180px]"
                      role="listbox"
                      aria-label="Sort options"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          role="option"
                          aria-selected={sort === opt.value}
                          onClick={() => {
                            setSort(opt.value)
                            setSortOpen(false)
                            setPage(1)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            sort === opt.value
                              ? 'bg-orange-50 text-[#F97316] font-medium'
                              : 'text-[#1E293B] hover:bg-slate-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile filters button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden border-[#E2E8F0] text-[#1E293B] gap-2 h-9"
                  onClick={() => setFiltersOpen(true)}
                  aria-label="Open filters"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {(() => {
                    const count =
                      filters.vehicleTypes.length +
                      filters.departureTimes.length +
                      filters.amenities.length +
                      (filters.minRating > 0 ? 1 : 0) +
                      (filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
                      filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]
                        ? 1
                        : 0)
                    return count > 0 ? (
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F97316] text-white text-[9px] font-bold">
                        {count}
                      </span>
                    ) : null
                  })()}
                </Button>
              </div>
            </div>

            {/* Bus cards */}
            {loading ? (
              <BusCardSkeletonList count={4} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon="🔍"
                heading="No buses found"
                subtext="Try adjusting your search filters or try a different date."
                ctaLabel="Clear Filters"
                onCta={() => handleFilterChange(DEFAULT_FILTERS)}
                secondaryCtaLabel="Modify Search"
                onSecondaryCta={() => (window.location.href = '/search')}
              />
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${sort}-${JSON.stringify(filters)}`}
                    variants={motionFade}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.ul
                      variants={motionStagger}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                      role="list"
                      aria-label="Available buses"
                    >
                      {visible.map((bus) => (
                        <li key={bus.id} role="listitem">
                          <BusCard
                            bus={bus}
                            searchParams={{
                              from: params.from,
                              to: params.to,
                              date: params.date,
                              passengers: String(params.passengers),
                            }}
                          />
                        </li>
                      ))}
                    </motion.ul>
                  </motion.div>
                </AnimatePresence>

                {/* Load more */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => p + 1)}
                      className="border-[#E2E8F0] text-[#1E293B] hover:bg-slate-50 h-11 px-8"
                    >
                      Load More ({filtered.length - visible.length} more buses)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters bottom sheet */}
      <MobileFiltersSheet
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        totalCount={MOCK_BUS_ROUTES.length}
        filteredCount={filtered.length}
      />
    </motion.div>
  )
}
