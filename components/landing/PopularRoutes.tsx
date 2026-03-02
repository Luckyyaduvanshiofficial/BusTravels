"use client"

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MapPin, Clock3, ArrowRight, IndianRupee, CalendarDays } from 'lucide-react'
import { POPULAR_ROUTES } from '@/lib/data/landing'
import { Button } from '@/components/ui/button'
import { SafeImage } from './SafeImage'

export function PopularRoutes() {
  const reduceMotion = useReducedMotion()
  const [coarsePointer, setCoarsePointer] = useState(false)

  useEffect(() => {
    setCoarsePointer(globalThis.matchMedia('(pointer: coarse)').matches)
  }, [])

  return (
    <section
      id="popular-routes"
      className="bg-white border-t border-gray-100"
      aria-labelledby="routes-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[780px]">
        <div className="relative lg:sticky lg:top-0 lg:h-screen">
          <SafeImage
            src="/images/routes-collage.svg"
            fallbackSrc="/images/hero-bg.png"
            alt="Collage of popular Rajasthan bus routes from Jaipur"
            width={1400}
            height={1100}
            priority={false}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/15" />

          <div className="absolute inset-0 p-6 sm:p-10 lg:p-12 flex flex-col justify-end text-white">
            <span className="inline-flex w-fit items-center rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-bold tracking-wider uppercase mb-4">
              राजस्थान रूट्स
            </span>
            <h2
              id="routes-heading"
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
            >
              Popular Bus Routes from Jaipur
            </h2>
            <p className="max-w-lg text-white/85 text-base sm:text-lg leading-relaxed">
              Discover high-demand routes for weddings, religious tours, and family travel with upfront pricing and peak-time guidance.
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-10 py-14 sm:py-16 bg-gray-50">
          <div className="max-w-2xl mx-auto space-y-5">
            {POPULAR_ROUTES.map((route, index) => {
              const overlapMargin = index === 0 ? 'mt-0' : '-mt-5'
              return (
                <motion.article
                  key={route.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 30 + index * 6, scale: 0.98 }}
                  whileInView={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
                  whileHover={reduceMotion || coarsePointer ? {} : { y: -6, scale: 1.01 }}
                  className={`group relative rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform will-change-transform focus-within:ring-2 focus-within:ring-saffron/50 ${overlapMargin}`}
                  style={{ zIndex: POPULAR_ROUTES.length - index }}
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900" itemProp="name">
                        {route.from} → {route.to}
                      </h3>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base" itemProp="description">
                        {route.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron/10 px-3 py-1 text-xs sm:text-sm font-semibold text-saffron w-fit">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      {route.distance}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4">
                    <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Trip Time</p>
                      <p className="mt-0.5 text-gray-900 font-medium inline-flex items-center gap-1.5">
                        <Clock3 className="w-3.5 h-3.5 text-royalBlue" aria-hidden="true" />
                        {route.duration}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5" itemProp="priceSpecification" itemScope itemType="https://schema.org/PriceSpecification">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Price Range</p>
                      <p className="mt-0.5 text-gray-900 font-semibold inline-flex items-center gap-1.5" itemProp="priceCurrency">
                        <IndianRupee className="w-3.5 h-3.5 text-forestGreen" aria-hidden="true" />
                        {route.priceRange}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Best Time</p>
                      <p className="mt-0.5 text-gray-900 font-medium inline-flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-deepPurple" aria-hidden="true" />
                        {route.bestTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <Link href={`/search?pickup=${encodeURIComponent(route.from)}&drop=${encodeURIComponent(route.to)}`}>
                      <Button
                        aria-label={`Check availability from ${route.from} to ${route.to}`}
                        className="gradient-saffron text-white rounded-xl h-10 px-4 font-semibold hover:-translate-y-0.5 transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-saffron"
                      >
                        Check Availability
                        <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link href={`/search?pickup=${encodeURIComponent(route.from)}&drop=${encodeURIComponent(route.to)}&time=best`}>
                      <Button
                        variant="outline"
                        aria-label={`View best-time slots from ${route.from} to ${route.to}`}
                        className="rounded-xl h-10 px-4 font-semibold text-royalBlue border-royalBlue/30 hover:bg-royalBlue/5 hover:text-royalBlue focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-royalBlue"
                      >
                        Best-time slots
                      </Button>
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
