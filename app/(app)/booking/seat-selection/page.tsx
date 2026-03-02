'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MOCK_BUS_ROUTES, generateSeatLayout } from '@/lib/mock-data'
import type { Seat } from '@/lib/search-types'
import {
  pageFadeIn,
  seatSelect,
  getMotionVariants,
} from '@/lib/animations'

const TAX_RATE = 0.05

/**
 * Seat Selection Page – Charter Bus Rental Platform
 * Spec: search.md PAGE 3: SEAT SELECTION
 *
 * Layout:
 *  - Left (60%): Upper/Lower deck grid, legend
 *  - Right (40%): Booking summary, fare breakdown, CTA
 *
 * Seat sizes: 40×40px desktop, 36×36px mobile
 * States: available, selected, booked, ladies
 * Mobile: sticky bottom summary sheet
 */
export default function SeatSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reduceMotion = useReducedMotion()

  const busId = searchParams.get('busId') ?? ''
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  // Use local date to avoid UTC date shift for users ahead of UTC
  const today = new Date()
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const date = searchParams.get('date') ?? localDate

  const bus = MOCK_BUS_ROUTES.find((b) => b.id === busId) ?? MOCK_BUS_ROUTES[0]
  const layout = generateSeatLayout(busId)

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [showMobileSummary, setShowMobileSummary] = useState(false)

  // Refs for keyboard accessibility of the mobile bottom sheet
  const mobileSummaryTriggerRef = useRef<HTMLButtonElement>(null)
  const mobileSummarySheetRef = useRef<HTMLDivElement>(null)

  // Close sheet on Escape; trap focus while open; restore focus on close
  useEffect(() => {
    if (!showMobileSummary) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    // Move focus into the sheet
    const firstFocusable = mobileSummarySheetRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowMobileSummary(false)
        return
      }
      if (e.key !== 'Tab' || !mobileSummarySheetRef.current) return
      const focusableEls = Array.from(
        mobileSummarySheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusableEls.length === 0) { e.preventDefault(); return }
      const first = focusableEls[0]
      const last = focusableEls[focusableEls.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus to the trigger button when sheet closes
      if (previouslyFocused === mobileSummaryTriggerRef.current || previouslyFocused === null) {
        mobileSummaryTriggerRef.current?.focus()
      } else {
        previouslyFocused?.focus()
      }
    }
  }, [showMobileSummary])

  const baseFare = selectedSeats.reduce((sum, s) => sum + s.price, 0)
  const tax = Math.round(baseFare * TAX_RATE)
  const total = baseFare + tax

  const toggleSeat = useCallback((seat: Seat) => {
    if (seat.status === 'booked') return

    setSelectedSeats((prev) => {
      const already = prev.find((s) => s.id === seat.id)
      if (already) return prev.filter((s) => s.id !== seat.id)
      return [...prev, { ...seat, status: 'selected' }]
    })
  }, [])

  const proceedToBooking = () => {
    if (selectedSeats.length === 0) return
    const params = new URLSearchParams({
      busId,
      seats: selectedSeats.map((s) => s.id).join(','),
      from,
      to,
      date,
    })
    router.push(`/booking/details?${params.toString()}`)
  }

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.div
      variants={getMotionVariants(pageFadeIn, reduceMotion)}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#F8FAFC]"
    >
      {/* Page header */}
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
        <h1 className="text-[18px] font-semibold text-[#1E293B]">Select Your Seats</h1>
        <div className="ml-auto text-sm text-[#64748B] hidden sm:block">
          {bus.fromCity} → {bus.toCity} · {bus.departureTime}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── LEFT: Seat Layout (60%) ─────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h2 className="text-[16px] font-semibold text-[#1E293B] mb-5">
                {bus.busType} · {bus.busName}
              </h2>

              {/* UPPER DECK */}
              <DeckLayout
                deckLabel="Upper Deck"
                rows={layout.upperDeck}
                selectedSeats={selectedSeats}
                onToggle={toggleSeat}
                reduceMotion={reduceMotion}
              />

              <div className="h-px bg-[#E2E8F0] my-6" />

              {/* LOWER DECK */}
              <DeckLayout
                deckLabel="Lower Deck"
                rows={layout.lowerDeck}
                selectedSeats={selectedSeats}
                onToggle={toggleSeat}
                reduceMotion={reduceMotion}
              />

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4" aria-label="Seat status legend">
                <LegendItem color="bg-white border-2 border-[#E2E8F0]" label="Available" />
                <LegendItem color="bg-[#F97316] border-2 border-[#F97316]" label="Selected" />
                <LegendItem color="bg-[#E2E8F0] border-2 border-[#CBD5E1]" label="Booked" />
                <LegendItem color="bg-pink-100 border-2 border-pink-400" label="Ladies Only" />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Booking Summary (40%) ──────────────────── */}
          <div className="hidden lg:block w-[360px] flex-shrink-0">
            <BookingSummary
              bus={bus}
              from={from}
              to={to}
              formattedDate={formattedDate}
              selectedSeats={selectedSeats}
              baseFare={baseFare}
              tax={tax}
              total={total}
              onProceed={proceedToBooking}
            />
          </div>
        </div>
      </div>

      {/* Mobile: sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-4 py-3 flex items-center justify-between z-30">
        <div>
          {selectedSeats.length > 0 ? (
            <>
              <span className="text-sm text-[#64748B]">{selectedSeats.length} seat(s) selected</span>
              <div className="text-[20px] font-bold text-[#1E293B]">
                ₹{total.toLocaleString('en-IN')}
              </div>
            </>
          ) : (
            <span className="text-sm text-[#64748B]">Select seats to continue</span>
          )}
        </div>
        <div className="flex gap-2">
          {selectedSeats.length > 0 && (
            <Button
              ref={mobileSummaryTriggerRef}
              variant="outline"
              size="sm"
              onClick={() => setShowMobileSummary(true)}
              aria-haspopup="dialog"
              aria-expanded={showMobileSummary}
              className="h-11 border-[#E2E8F0]"
            >
              <Info className="w-4 h-4" />
            </Button>
          )}
          <Button
            disabled={selectedSeats.length === 0}
            onClick={proceedToBooking}
            className="h-11 px-6 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg disabled:opacity-50"
          >
            Proceed to Book
          </Button>
        </div>
      </div>

      {/* Mobile summary bottom sheet */}
      <AnimatePresence>
        {showMobileSummary && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSummary(false)}
            />
            <motion.div
              ref={mobileSummarySheetRef}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Booking summary"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            >
              <div className="p-5 pb-8">
                <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
                <BookingSummary
                  bus={bus}
                  from={from}
                  to={to}
                  formattedDate={formattedDate}
                  selectedSeats={selectedSeats}
                  baseFare={baseFare}
                  tax={tax}
                  total={total}
                  onProceed={proceedToBooking}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────

function DeckLayout({
  deckLabel,
  rows,
  selectedSeats,
  onToggle,
  reduceMotion,
}: Readonly<{
  deckLabel: string
  rows: Seat[][]
  selectedSeats: Seat[]
  onToggle: (seat: Seat) => void
  reduceMotion: boolean | null
}>) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-3">
        {deckLabel}
      </h3>

      {/* Bus outline */}
      <div
        className="rounded-xl border-2 border-[#E2E8F0] p-4 relative"
        style={{ background: '#FAFAFA' }}
        aria-label={deckLabel}
      >
        {/* Driver area */}
        <div className="flex justify-center mb-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg px-4 py-1.5 text-xs text-[#64748B] font-medium">
            🚗 Driver
          </div>
        </div>

        <div className="space-y-2">
          {rows.map((row, rowIdx) => (
            <div key={row[0]?.number ?? String(rowIdx)} className="flex items-center gap-2 justify-center">
              {/* Left seats (2) */}
              <div className="flex gap-1">
                {row.slice(0, 2).map((seat) => (
                  <SeatBox
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedSeats.some((s) => s.id === seat.id)}
                    onToggle={onToggle}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>

              {/* Aisle */}
              <div className="w-6 flex-shrink-0" aria-hidden="true" />

              {/* Right seat (1) */}
              {row[2] && (
                <SeatBox
                  seat={row[2]}
                  isSelected={selectedSeats.some((s) => s.id === row[2].id)}
                  onToggle={onToggle}
                  reduceMotion={reduceMotion}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getSeatAriaLabel(
  seatNumber: string,
  isBooked: boolean,
  isLadies: boolean,
  isSelected: boolean,
): string {
  if (isBooked) return `Seat ${seatNumber} - Booked`
  if (isLadies) return `Seat ${seatNumber} - Ladies only`
  if (isSelected) return `Seat ${seatNumber} - Selected`
  return `Seat ${seatNumber} - Available`
}

function getSeatClassName(isBooked: boolean, isSelected: boolean, isLadies: boolean): string {
  if (isBooked) return 'bg-[#E2E8F0] border-[#CBD5E1] text-[#94A3B8] cursor-not-allowed opacity-60'
  if (isSelected) return 'bg-[#F97316] border-[#F97316] text-white shadow-[0_2px_8px_rgba(249,115,22,0.4)]'
  if (isLadies) return 'bg-pink-100 border-pink-400 text-pink-600 hover:border-pink-500 cursor-pointer'
  return 'bg-white border-[#E2E8F0] text-[#1E293B] hover:border-[#F97316] cursor-pointer'
}

function getSeatContent(
  isSelected: boolean,
  isBooked: boolean,
  isLadies: boolean,
  seatNumber: string,
): string {
  if (isSelected) return '✓'
  if (isBooked) return '×'
  if (isLadies) return '♀'
  return seatNumber.replace(/[UL]/, '')
}

function SeatBox({
  seat,
  isSelected,
  onToggle,
  reduceMotion,
}: Readonly<{
  seat: Seat
  isSelected: boolean
  onToggle: (seat: Seat) => void
  reduceMotion: boolean | null
}>) {
  const isBooked = seat.status === 'booked'
  const isLadies = seat.status === 'ladies'

  return (
    <motion.button
      onClick={() => onToggle(seat)}
      disabled={isBooked}
      aria-label={getSeatAriaLabel(seat.number, isBooked, isLadies, isSelected)}
      aria-pressed={isSelected}
      variants={reduceMotion ? undefined : seatSelect}
      animate={isSelected ? 'selected' : 'unselected'}
      whileHover={isBooked ? undefined : { scale: 1.05 }}
      whileTap={isBooked ? undefined : { scale: 0.95 }}
      className={cn(
        'w-10 h-10 rounded border-2 text-[10px] font-bold',
        'flex items-center justify-center transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-1',
        getSeatClassName(isBooked, isSelected, isLadies),
      )}
    >
      {getSeatContent(isSelected, isBooked, isLadies, seat.number)}
    </motion.button>
  )
}

function LegendItem({ color, label }: Readonly<{ color: string; label: string }>) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-6 h-6 rounded', color)} aria-hidden="true" />
      <span className="text-xs text-[#64748B]">{label}</span>
    </div>
  )
}

function BookingSummary({
  bus,
  from,
  to,
  formattedDate,
  selectedSeats,
  baseFare,
  tax,
  total,
  onProceed,
}: Readonly<{
  bus: (typeof MOCK_BUS_ROUTES)[number]
  from: string
  to: string
  formattedDate: string
  selectedSeats: Seat[]
  baseFare: number
  tax: number
  total: number
  onProceed: () => void
}>) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5 sticky top-[80px]">
      <h2 className="text-[18px] font-semibold text-[#1E293B]">Booking Summary</h2>

      {/* Trip info */}
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-[#1E293B]">{bus.busType}</p>
        <p className="text-sm text-[#64748B]">
          {from} → {to}
        </p>
        <p className="text-sm text-[#64748B]">
          {formattedDate} · {bus.departureTime}
        </p>
      </div>

      <div className="h-px bg-[#E2E8F0]" />

      {/* Selected seats */}
      <div>
        <h3 className="text-sm font-semibold text-[#1E293B] mb-2">
          Selected Seats ({selectedSeats.length})
        </h3>
        {selectedSeats.length === 0 ? (
          <p className="text-sm text-[#64748B] italic">No seats selected yet</p>
        ) : (
          <ul className="space-y-1.5">
            {selectedSeats.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">
                  Seat {s.number}
                  <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {s.deck === 'upper' ? 'Upper' : 'Lower'}
                  </span>
                </span>
                <span className="text-[#1E293B] font-medium">
                  ₹{s.price.toLocaleString('en-IN')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Fare breakdown */}
      {selectedSeats.length > 0 && (
        <>
          <div className="h-px bg-[#E2E8F0]" />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#1E293B] mb-2">Fare Breakdown</h3>
            <FareRow label="Base Fare" value={baseFare} />
            <FareRow label={`Tax (${TAX_RATE * 100}%)`} value={tax} />
            <div className="h-px bg-[#E2E8F0] my-2" />
            <FareRow
              label="Total"
              value={total}
              bold
            />
          </div>
        </>
      )}

      {/* CTA */}
      <Button
        disabled={selectedSeats.length === 0}
        onClick={onProceed}
        className={cn(
          'w-full h-12 rounded-lg font-medium text-base text-white',
          'bg-[#F97316] hover:bg-[#EA580C]',
          'transition-all hover:-translate-y-0.5',
          'hover:shadow-[0_4px_12px_rgba(249,115,22,0.35)]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          'focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2'
        )}
      >
        Proceed to Book
      </Button>
    </div>
  )
}

function FareRow({
  label,
  value,
  bold,
}: Readonly<{
  label: string
  value: number
  bold?: boolean
}>) {
  return (
    <div className={cn('flex justify-between text-sm', bold && 'font-semibold')}>
      <span className={bold ? 'text-[#1E293B]' : 'text-[#64748B]'}>{label}</span>
      <span className={bold ? 'text-[#1E293B] text-base' : 'text-[#1E293B]'}>
        ₹{value.toLocaleString('en-IN')}
      </span>
    </div>
  )
}
