'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { quickFilterBar } from '@/lib/animations'

type FilterPill = {
  id: string
  label: string
}

const QUICK_FILTER_PILLS: FilterPill[] = [
  { id: 'ac_sleeper', label: 'AC Sleeper' },
  { id: 'non_ac_sleeper', label: 'Non-AC Sleeper' },
  { id: 'seater', label: 'Seater' },
  { id: 'luxury', label: 'Luxury' },
]

interface QuickFiltersProps {
  onFilterChange?: (filters: string[]) => void
}

/**
 * Quick filter pills below the search card on the hero.
 * Spec: rgba(255,255,255,0.1) bg, white outline pills
 * Active: #F97316 background
 */
export function QuickFilters({ onFilterChange }: QuickFiltersProps) {
  const [active, setActive] = useState<string[]>([])

  const toggle = (id: string) => {
    const next = active.includes(id)
      ? active.filter((a) => a !== id)
      : [...active, id]
    setActive(next)
    onFilterChange?.(next)
  }

  return (
    <motion.div
      variants={quickFilterBar}
      initial="hidden"
      animate="visible"
      className="max-w-[900px] mx-auto w-full mt-4"
    >
      <div
        className="rounded-xl px-5 py-4"
        style={{ background: 'rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-white/80 text-sm font-medium flex-shrink-0">
            Vehicle Type:
          </span>
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1"
            role="group"
            aria-label="Filter by vehicle type"
          >
            {QUICK_FILTER_PILLS.map((pill) => {
              const isActive = active.includes(pill.id)
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => toggle(pill.id)}
                  aria-pressed={isActive}
                  className={cn(
                    'flex-shrink-0 h-9 px-4 rounded-full text-sm font-medium',
                    'transition-all duration-150 focus:outline-none',
                    'focus:ring-2 focus:ring-white/60',
                    isActive
                      ? 'bg-[#F97316] text-white border-transparent'
                      : [
                          'text-white border',
                          'border-white/30 hover:bg-white/20',
                        ]
                  )}
                >
                  {pill.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
