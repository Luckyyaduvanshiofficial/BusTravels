'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { heroCard, buttonTap } from '@/lib/animations'

interface SearchCardProps {
  initialFrom?: string
  initialTo?: string
  initialDate?: string
  initialPassengers?: number
  compact?: boolean
}

/**
 * Search Card component.
 * Spec: 900px max-width, 2×2 grid, 32px padding, 16px border-radius
 * Shadow: 0 10px 40px rgba(0,0,0,0.15)
 * Inputs: 48px height, orange focus ring
 * CTA: Full width, #F97316, 56px height
 */
export function SearchCard({
  initialFrom = '',
  initialTo = '',
  initialDate = '',
  initialPassengers = 1,
  compact = false,
}: SearchCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  const [date, setDate] = useState(initialDate)
  const [passengers, setPassengers] = useState(String(initialPassengers))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!from.trim()) e.from = 'Please enter departure city'
    if (!to.trim()) e.to = 'Please enter destination city'
    if (!date) e.date = 'Please select a travel date'
    if (!passengers || Number(passengers) < 1) e.passengers = 'At least 1 passenger'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSearch = () => {
    if (!validate()) return
    const params = new URLSearchParams({
      from: from.trim(),
      to: to.trim(),
      date,
      passengers,
    })
    startTransition(() => {
      router.push(`/results?${params.toString()}`)
    })
  }

  const inputClass = (field: string) =>
    cn(
      'h-12 border rounded-lg px-4 text-[#1E293B] text-base placeholder:text-slate-400',
      'focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all',
      'focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)]',
      errors[field]
        ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
        : 'border-[#E2E8F0]'
    )

  if (compact) {
    // Compact inline version for results page sticky bar
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <CompactField icon={<MapPin className="w-4 h-4 text-[#64748B]" />} value={from || 'From'} />
        <ArrowRight className="w-4 h-4 text-[#64748B] flex-shrink-0" />
        <CompactField icon={<MapPin className="w-4 h-4 text-[#64748B]" />} value={to || 'To'} />
        <CompactField icon={<Calendar className="w-4 h-4 text-[#64748B]" />} value={date || 'Date'} />
        <CompactField icon={<Users className="w-4 h-4 text-[#64748B]" />} value={`${passengers} Passenger${Number(passengers) !== 1 ? 's' : ''}`} />
      </div>
    )
  }

  return (
    <motion.div
      variants={heroCard}
      initial="hidden"
      animate="visible"
      className="w-full bg-white rounded-[16px] p-8"
      style={{
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      }}
    >
      {/* 2×2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {/* FROM */}
        <div>
          <Label
            htmlFor="search-from"
            className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-[#F97316]" />
            FROM
          </Label>
          <Input
            id="search-from"
            placeholder="Departure city"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value)
              if (errors.from) setErrors((p) => ({ ...p, from: '' }))
            }}
            className={inputClass('from')}
            aria-describedby={errors.from ? 'from-error' : undefined}
            autoComplete="off"
          />
          {errors.from && (
            <p id="from-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.from}
            </p>
          )}
        </div>

        {/* TO */}
        <div>
          <Label
            htmlFor="search-to"
            className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-[#F97316]" />
            TO
          </Label>
          <Input
            id="search-to"
            placeholder="Destination city"
            value={to}
            onChange={(e) => {
              setTo(e.target.value)
              if (errors.to) setErrors((p) => ({ ...p, to: '' }))
            }}
            className={inputClass('to')}
            aria-describedby={errors.to ? 'to-error' : undefined}
            autoComplete="off"
          />
          {errors.to && (
            <p id="to-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.to}
            </p>
          )}
        </div>

        {/* DATE */}
        <div>
          <Label
            htmlFor="search-date"
            className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-[#F97316]" />
            TRAVEL DATE
          </Label>
          <Input
            id="search-date"
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setDate(e.target.value)
              if (errors.date) setErrors((p) => ({ ...p, date: '' }))
            }}
            className={cn(inputClass('date'), 'cursor-pointer')}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && (
            <p id="date-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.date}
            </p>
          )}
        </div>

        {/* PASSENGERS */}
        <div>
          <Label
            htmlFor="search-passengers"
            className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-[#F97316]" />
            PASSENGERS
          </Label>
          <div className="relative">
            <select
              id="search-passengers"
              value={passengers}
              onChange={(e) => {
                setPassengers(e.target.value)
                if (errors.passengers) setErrors((p) => ({ ...p, passengers: '' }))
              }}
              className={cn(
                inputClass('passengers'),
                'w-full appearance-none cursor-pointer bg-white pr-8'
              )}
              aria-describedby={errors.passengers ? 'passengers-error' : undefined}
            >
              {[1,2,3,4,5,6,7,8,9,10,15,20,25,30,40,50].map((n) => (
                <option key={n} value={String(n)}>
                  {n} {n === 1 ? 'Passenger' : 'Passengers'}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" aria-hidden="true" />
          </div>
          {errors.passengers && (
            <p id="passengers-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.passengers}
            </p>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <motion.div whileTap={buttonTap}>
        <Button
          onClick={handleSearch}
          disabled={isPending}
          className={cn(
            'w-full h-14 text-base font-medium rounded-lg',
            'bg-[#F97316] hover:bg-[#EA580C] text-white',
            'transition-all duration-200 hover:-translate-y-0.5',
            'hover:shadow-[0_4px_14px_rgba(249,115,22,0.4)]',
            'focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none'
          )}
          aria-label="Search available buses"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Routes
            </span>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}

function CompactField({
  icon,
  value,
}: {
  icon: React.ReactNode
  value: string
}) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-[#1E293B] font-medium">
      {icon}
      <span>{value}</span>
    </div>
  )
}
