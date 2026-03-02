'use client'

import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Users, Search, ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SearchParams } from '@/lib/search-types'

interface StickyCompactSearchProps {
  params: SearchParams
}

/**
 * Sticky compact search bar for results page.
 * Spec: Height 80px, white bg, border-bottom 1px #E2E8F0,
 * shadow: 0 2px 8px rgba(0,0,0,0.05)
 * Inline compact inputs with [Edit Search] link (orange)
 */
export function StickyCompactSearch({ params }: StickyCompactSearchProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push('/search')
  }

  const formattedDate = params.date
    ? new Date(params.date + 'T00:00:00').toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—'

  return (
    <div
      className="sticky top-0 z-30 bg-white"
      style={{
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
      role="search"
      aria-label="Current search criteria"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
        {/* Route summary */}
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          {/* From */}
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-4 h-4 text-[#F97316] flex-shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold text-[#1E293B] truncate">
              {params.from || '—'}
            </span>
          </div>

          <ArrowRight className="w-4 h-4 text-[#64748B] flex-shrink-0" aria-hidden="true" />

          {/* To */}
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-4 h-4 text-[#F97316] flex-shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold text-[#1E293B] truncate">
              {params.to || '—'}
            </span>
          </div>

          {/* Date – hide on very small screens */}
          <div className="hidden sm:flex items-center gap-1 text-sm text-[#64748B] flex-shrink-0">
            <span className="w-px h-4 bg-[#E2E8F0] mx-1" aria-hidden="true" />
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>

          {/* Passengers – hide on small screens */}
          <div className="hidden md:flex items-center gap-1 text-sm text-[#64748B] flex-shrink-0">
            <span className="w-px h-4 bg-[#E2E8F0] mx-1" aria-hidden="true" />
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {params.passengers} Passenger{params.passengers !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Edit Search */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="text-[#F97316] hover:text-[#EA580C] hover:bg-orange-50 font-medium text-sm flex-shrink-0 focus:ring-2 focus:ring-[#F97316]"
          aria-label="Modify search criteria"
        >
          <Search className="w-3.5 h-3.5 mr-1" />
          Edit Search
        </Button>
      </div>
    </div>
  )
}
