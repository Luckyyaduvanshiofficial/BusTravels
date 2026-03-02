'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { POPULAR_ROUTES } from '@/lib/mock-data'
import { routeCard, hoverLift } from '@/lib/animations'
import { cn } from '@/lib/utils'

/**
 * Popular Routes section.
 * Spec: Light Gray #F8FAFC bg, 80px vertical padding
 * Cards: 280×200px, white, 12px radius, hover lift 4px
 * Price: 18px Bold Orange
 * H-scroll on mobile
 */
export function PopularRoutes() {
  const router = useRouter()

  const navigate = (from: string, to: string) => {
    const today = new Date()
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    router.push(`/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${localDate}&passengers=1`)
  }

  return (
    <section
      className="py-20"
      style={{ background: '#F8FAFC' }}
      aria-labelledby="popular-routes-heading"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          heading="Popular Routes"
          subtext="Discover the most travelled routes across India"
          id="popular-routes-heading"
        />

        {/* Horizontal scroll container */}
        <div
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:overflow-visible"
          role="list"
          aria-label="Popular bus routes"
        >
          {POPULAR_ROUTES.map((route, i) => (
            <motion.article
              key={route.id}
              custom={i}
              variants={routeCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={hoverLift}
              className={cn(
                'flex-shrink-0 w-[280px] sm:w-auto',
                'bg-white rounded-xl border border-[#E2E8F0]',
                'overflow-hidden cursor-pointer group',
                'shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
              )}
              role="listitem"
              onClick={() => navigate(route.from, route.to)}
            >
              {/* Image */}
              <div className="relative h-36 bg-slate-200 overflow-hidden">
                {/* Gradient fallback – rendered first so Image renders on top */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-[#334155] flex items-center justify-center">
                  <span className="text-white/20 text-5xl">🚌</span>
                </div>
                <Image
                  src={route.imageUrl}
                  alt={`${route.from} to ${route.to} bus route`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Hide broken image so gradient fallback shows through
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[20px] font-semibold text-[#1E293B]">
                    {route.from}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#64748B]" />
                  <span className="text-[20px] font-semibold text-[#1E293B]">
                    {route.to}
                  </span>
                </div>

                <p className="text-sm text-[#64748B] mb-4">
                  Starting{' '}
                  <span className="text-[18px] font-bold text-[#F97316]">
                    ₹{route.startingPrice.toLocaleString('en-IN')}
                  </span>
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#E2E8F0] text-[#1E293B] hover:bg-slate-50 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(route.from, route.to)
                  }}
                  aria-label={`View buses from ${route.from} to ${route.to}`}
                >
                  View Buses
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
