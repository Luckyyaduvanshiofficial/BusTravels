'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MOCK_VEHICLE_DETAIL, MOCK_BUS_ROUTES } from '@/lib/mock-data'
import { pageFadeIn, getMotionVariants } from '@/lib/animations'

import VehicleGallery from './components/VehicleGallery'
import VehicleInfo from './components/VehicleInfo'
import VehicleTabs from './components/VehicleTabs'
import ReviewsSection from './components/ReviewsSection'
import SimilarBusesCarousel from './components/SimilarBusesCarousel'

interface VehicleDetailClientProps {
  id: string
}

export default function VehicleDetailClient({ id }: Readonly<VehicleDetailClientProps>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reduceMotion = useReducedMotion()

  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const date = searchParams.get('date') ?? ''

  // In production: fetch vehicle by id from API
  const vehicle = { ...MOCK_VEHICLE_DETAIL, id }

  const similarBuses = MOCK_BUS_ROUTES.filter((b) => b.id !== id).slice(0, 4)

  const handleSelectSeats = () => {
    const params = new URLSearchParams({ busId: id })
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (date) params.set('date', date)
    router.push(`/booking/seat-selection?${params}`)
  }

  return (
    <motion.div
      variants={getMotionVariants(pageFadeIn, reduceMotion)}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-8"
    >
      {/* Back header */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4 sticky top-0 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-lg"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-[#1E293B]" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-[18px] font-semibold text-[#1E293B] truncate">{vehicle.busName}</h1>
          <p className="text-xs text-[#64748B]">{from && to ? `${from} → ${to}` : from || to || ''}</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── LEFT: Gallery + Tabs + Reviews (grows) ──────────── */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Gallery */}
            <VehicleGallery
              images={vehicle.images?.length ? vehicle.images : ['/images/placeholder-bus.jpg']}
              busName={vehicle.busName}
            />

            {/* Tabs: Overview / Amenities / Policies / FAQ */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6">
              <VehicleTabs vehicle={vehicle} />
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6">
              <h2 className="text-[18px] font-semibold text-[#1E293B] mb-5">Traveller Reviews</h2>
              <ReviewsSection
                reviews={vehicle.reviews}
                averageRating={vehicle.overallRating}
                totalCount={vehicle.totalReviews}
              />
            </div>

            {/* Similar Buses carousel */}
            {similarBuses.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6">
                <SimilarBusesCarousel
                  buses={similarBuses}
                  from={from}
                  to={to}
                  date={date}
                />
              </div>
            )}
          </div>

          {/* ── RIGHT: Vehicle Info sticky card (360px) ──────────── */}
          <aside className="w-full lg:w-[360px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sticky top-24 space-y-5">
              <VehicleInfo vehicle={vehicle} />

              <div className="h-px bg-[#E2E8F0]" />

              {/* CTA */}
              <Button
                onClick={handleSelectSeats}
                className={cn(
                  'w-full h-12 rounded-lg font-semibold text-base text-white',
                  'bg-[#F97316] hover:bg-[#EA580C]',
                  'transition-all hover:-translate-y-0.5',
                  'hover:shadow-[0_4px_12px_rgba(249,115,22,0.35)]',
                  'focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2'
                )}
              >
                Select Seats
              </Button>

              <p className="text-xs text-center text-[#64748B]">
                ₹{vehicle.pricePerSeat.toLocaleString('en-IN')} per seat · {vehicle.availableSeats} seats left
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky footer ─────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E2E8F0] px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-[#1E293B]">
              ₹{vehicle.pricePerSeat.toLocaleString('en-IN')}
              <span className="text-sm font-normal text-[#64748B] ml-1">/ seat</span>
            </p>
            <p className="text-xs text-[#64748B]">{vehicle.availableSeats} seats left</p>
          </div>
          <Button
            onClick={handleSelectSeats}
            className={cn(
              'h-12 px-8 rounded-lg font-semibold text-base text-white',
              'bg-[#F97316] hover:bg-[#EA580C]',
              'focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2'
            )}
          >
            Select Seats
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
