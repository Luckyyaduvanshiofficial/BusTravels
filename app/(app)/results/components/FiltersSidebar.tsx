'use client'

import { useState, useCallback, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import type { BusFilters, VehicleTypeFilter, DepartureTimeFilter } from '@/lib/search-types'
import { DEFAULT_FILTERS } from '@/lib/search-types'

interface FiltersSidebarProps {
  filters: BusFilters
  onChange: (filters: BusFilters) => void
  totalCount: number
  filteredCount: number
}

const VEHICLE_TYPES: { id: VehicleTypeFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ac_sleeper', label: 'AC Sleeper' },
  { id: 'non_ac_sleeper', label: 'Non-AC Sleeper' },
  { id: 'seater', label: 'Seater' },
  { id: 'luxury', label: 'Luxury' },
]

const DEPARTURE_TIMES: { id: DepartureTimeFilter; label: string; range: string }[] = [
  { id: 'morning', label: 'Morning', range: '06:00 – 11:59' },
  { id: 'afternoon', label: 'Afternoon', range: '12:00 – 17:59' },
  { id: 'evening', label: 'Evening', range: '18:00 – 21:59' },
  { id: 'night', label: 'Night', range: '22:00 – 05:59' },
]

const AMENITY_OPTIONS = [
  'WiFi',
  'Charging Points',
  'Blankets',
  'Water Bottle',
  'Meals',
  'Reading Light',
]

const RATING_OPTIONS = [
  { value: 4.5, label: '4.5+ ⭐ Excellent' },
  { value: 4, label: '4.0+ ⭐ Very Good' },
  { value: 3.5, label: '3.5+ ⭐ Good' },
  { value: 0, label: 'Any rating' },
]

/**
 * Filter Sidebar – Spec: search.md PAGE 2: SEARCH RESULTS PAGE
 * Width: 280px desktop, sticky top-100px
 * White bg, 12px radius, 24px padding
 * Section heading: 14px, Semibold, Navy
 * Clear All: text link, red color
 */
export function FiltersSidebar({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: FiltersSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange)

  // Keep local priceRange in sync when parent resets filters
  useEffect(() => {
    setPriceRange(filters.priceRange)
  }, [filters.priceRange])

  const update = useCallback(
    (patch: Partial<BusFilters>) => onChange({ ...filters, ...patch }),
    [filters, onChange]
  )

  const toggleVehicleType = (id: VehicleTypeFilter) => {
    if (id === 'all') {
      update({ vehicleTypes: [] })
      return
    }
    const current = filters.vehicleTypes
    update({
      vehicleTypes: current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id],
    })
  }

  const toggleDeparture = (id: DepartureTimeFilter) => {
    const current = filters.departureTimes
    update({
      departureTimes: current.includes(id)
        ? current.filter((d) => d !== id)
        : [...current, id],
    })
  }

  const toggleAmenity = (a: string) => {
    const current = filters.amenities
    update({
      amenities: current.includes(a)
        ? current.filter((x) => x !== a)
        : [...current, a],
    })
  }

  const activeCount =
    filters.vehicleTypes.length +
    filters.departureTimes.length +
    filters.amenities.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
    filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]
      ? 1
      : 0)

  const clearAll = () => {
    setPriceRange(DEFAULT_FILTERS.priceRange)
    onChange({ ...DEFAULT_FILTERS })
  }

  return (
    <aside
      aria-label="Search filters"
      className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-6 sticky top-[104px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-[#1E293B]">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F97316] text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-red-500 text-xs font-medium hover:text-red-700 transition-colors focus:outline-none focus:underline"
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-[#64748B] -mt-4">
        Showing {filteredCount} of {totalCount} buses
      </p>

      {/* ── Vehicle Type ────────────────────────────────────────────── */}
      <FilterSection title="Vehicle Type">
        <ul className="space-y-2" role="group" aria-label="Vehicle type filter">
          {VEHICLE_TYPES.map((vt) => {
            const checked =
              vt.id === 'all'
                ? filters.vehicleTypes.length === 0
                : filters.vehicleTypes.includes(vt.id)
            return (
              <li key={vt.id}>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleVehicleType(vt.id)}
                    aria-checked={checked}
                    className="w-4 h-4 rounded accent-[#F97316] cursor-pointer"
                  />
                  <span className="text-sm text-[#1E293B] group-hover:text-[#F97316] transition-colors">
                    {vt.label}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </FilterSection>

      {/* ── Price Range ──────────────────────────────────────────────── */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <Slider
            min={0}
            max={5000}
            step={50}
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            onValueCommit={(v) => update({ priceRange: v as [number, number] })}
            className="[&_[data-slot=slider-range]]:bg-[#F97316] [&_[data-slot=slider-thumb]]:border-[#F97316]"
            aria-label="Price range slider"
          />
          <div className="flex justify-between text-xs text-[#64748B]">
            <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
            <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </FilterSection>

      {/* ── Departure Time ───────────────────────────────────────────── */}
      <FilterSection title="Departure Time">
        <ul className="space-y-2" role="group" aria-label="Departure time filter">
          {DEPARTURE_TIMES.map((dt) => {
            const checked = filters.departureTimes.includes(dt.id)
            return (
              <li key={dt.id}>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDeparture(dt.id)}
                    aria-checked={checked}
                    className="w-4 h-4 rounded accent-[#F97316] cursor-pointer"
                  />
                  <div>
                    <span className="text-sm text-[#1E293B] group-hover:text-[#F97316] transition-colors block">
                      {dt.label}
                    </span>
                    <span className="text-[10px] text-[#64748B]">{dt.range}</span>
                  </div>
                </label>
              </li>
            )
          })}
        </ul>
      </FilterSection>

      {/* ── Amenities ────────────────────────────────────────────────── */}
      <FilterSection title="Amenities">
        <ul className="space-y-2" role="group" aria-label="Amenities filter">
          {AMENITY_OPTIONS.map((a) => {
            const checked = filters.amenities.includes(a)
            return (
              <li key={a}>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAmenity(a)}
                    aria-checked={checked}
                    className="w-4 h-4 rounded accent-[#F97316] cursor-pointer"
                  />
                  <span className="text-sm text-[#1E293B] group-hover:text-[#F97316] transition-colors">
                    {a}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </FilterSection>

      {/* ── Rating ────────────────────────────────────────────────────── */}
      <FilterSection title="Rating">
        <ul className="space-y-2" role="radiogroup" aria-label="Minimum rating filter">
          {RATING_OPTIONS.map((r) => {
            const checked = filters.minRating === r.value
            return (
              <li key={r.value}>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    checked={checked}
                    onChange={() => update({ minRating: r.value })}
                    name="rating"
                    className="w-4 h-4 accent-[#F97316] cursor-pointer"
                  />
                  <span className="text-sm text-[#1E293B] group-hover:text-[#F97316] transition-colors">
                    {r.label}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </FilterSection>
    </aside>
  )
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-[14px] font-semibold text-[#1E293B] mb-3">{title}</h3>
      {children}
    </div>
  )
}
