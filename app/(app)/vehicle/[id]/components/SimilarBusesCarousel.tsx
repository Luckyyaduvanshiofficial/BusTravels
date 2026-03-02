'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star, Bus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { BusRoute } from '@/lib/search-types'

interface SimilarBusesCarouselProps {
  buses: BusRoute[]
  from?: string
  to?: string
  date?: string
}

export default function SimilarBusesCarousel({ buses, from, to, date }: Readonly<SimilarBusesCarouselProps>) {
  const router = useRouter()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: true,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!buses.length) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#1E293B]">Similar Buses</h2>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#1E293B]" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#1E293B]" />
          </button>
        </div>
      </div>

      <div ref={emblaRef} className="overflow-hidden -mx-1">
        <div className="flex gap-3 px-1">
          {buses.map((bus) => (
            <button
              key={bus.id}
              type="button"
              className="flex-none w-64 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group text-left"
              onClick={() => {
                const params = new URLSearchParams({ busId: bus.id })
                const resolvedFrom = from ?? bus.fromCity
                const resolvedTo = to ?? bus.toCity
                if (resolvedFrom) params.set('from', resolvedFrom)
                if (resolvedTo) params.set('to', resolvedTo)
                if (date) params.set('date', date)
                router.push(`/vehicle/${encodeURIComponent(bus.id)}?${params}`)
              }}
              aria-label={`View ${bus.operatorName} ${bus.busType}`}
            >
              {/* Thumbnail */}
              <div className="w-full h-32 bg-slate-100 relative overflow-hidden">
                {bus.images?.[0] ? (
                  <Image
                    src={bus.images[0]}
                    alt={bus.operatorName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Bus className="w-10 h-10 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <p className="text-sm font-semibold text-[#1E293B] line-clamp-1">{bus.operatorName}</p>
                <p className="text-xs text-[#64748B]">{bus.busType}</p>

                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-[#1E293B]">{bus.rating.toFixed(1)}</span>
                  <span className="text-xs text-[#64748B]">({bus.reviewCount})</span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-[#1E293B]">
                    ₹{bus.pricePerSeat.toLocaleString('en-IN')}
                  </p>
                  <span className="text-xs text-[#64748B]">{bus.availableSeats} left</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
