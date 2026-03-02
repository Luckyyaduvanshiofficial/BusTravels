'use client'

import { BottomSheet } from '@/components/shared/BottomSheet'
import { FiltersSidebar } from './FiltersSidebar'
import type { BusFilters } from '@/lib/search-types'

interface MobileFiltersSheetProps {
  isOpen: boolean
  onClose: () => void
  filters: BusFilters
  onChange: (f: BusFilters) => void
  totalCount: number
  filteredCount: number
}

/**
 * Mobile filters wrapped in a BottomSheet.
 * Spec: Bottom sheet modal on mobile, spring animation.
 */
export function MobileFiltersSheet({
  isOpen,
  onClose,
  filters,
  onChange,
  totalCount,
  filteredCount,
}: MobileFiltersSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      maxHeight="max-h-[90vh]"
    >
      <div className="p-5">
        <FiltersSidebar
          filters={filters}
          onChange={(f) => {
            onChange(f)
          }}
          totalCount={totalCount}
          filteredCount={filteredCount}
        />

        {/* Apply button */}
        <div className="sticky bottom-0 bg-white pt-4 pb-safe mt-4">
          <button
            onClick={onClose}
            className="w-full h-12 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg font-medium text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2"
          >
            Show {filteredCount} Buses
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
