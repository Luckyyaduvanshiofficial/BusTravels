'use client'

import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FilterTab {
  id: string
  label: string
  count?: number
}

interface FilterTabsProps {
  tabs: FilterTab[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function FilterTabs({ tabs, activeTab, onChange, className }: FilterTabsProps) {
  const shouldReduce = useReducedMotion()
  const instanceId = useId()

  return (
    <div
      role="tablist"
      aria-label="Filter bookings"
      className={cn(
        'flex items-center gap-1 overflow-x-auto scrollbar-none bg-neutral-100 p-1 rounded-xl',
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className="relative flex-shrink-0 px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
          {/* Active indicator */}
          {activeTab === tab.id && (
            <motion.div
              layoutId={`activeTab-${instanceId}`}
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}

          <span
            className={cn(
              'relative z-10 transition-colors',
              activeTab === tab.id ? 'text-neutral-800' : 'text-neutral-500',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
                  activeTab === tab.id
                    ? 'bg-saffron/10 text-saffron'
                    : 'bg-neutral-200 text-neutral-500',
                )}
              >
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}
