'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { MOCK_BUS_ROUTES, MOCK_VEHICLE_DETAIL } from '@/lib/mock-data'
import { pageFadeIn, getMotionVariants } from '@/lib/animations'

interface PassengerForm {
  name: string
  age: string
  gender: 'male' | 'female' | 'other'
}

interface BookingFormValues {
  passengers: PassengerForm[]
  email: string
  phone: string
  boardingPoint: string
  agreeToTerms: boolean
}

const SERVICE_FEE = 50
const TAX_RATE = 0.05

const PROGRESS_STEPS = ['Details', 'Payment', 'Confirm']

/**
 * Booking Details Page – Charter Bus Rental Platform
 * Spec: search.md PAGE 4: BOOKING DETAILS
 *
 * Layout:
 *  - Progress bar (●───○───○)
 *  - Left (60%): Passenger form, contact, boarding point, terms
 *  - Right (40%): Trip summary, fare breakdown, edit seats
 */
export default function BookingDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reduceMotion = useReducedMotion()

  const busId = searchParams.get('busId') ?? ''
  const seatIds = (searchParams.get('seats') ?? '').split(',').filter(Boolean)
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]

  const bus = MOCK_BUS_ROUTES.find((b) => b.id === busId) ?? MOCK_BUS_ROUTES[0]

  // Derive boarding points from the looked-up bus / mock vehicle detail
  const boardingPoints = MOCK_VEHICLE_DETAIL.boardingPoints.map((p) => ({
    id: p.id,
    label: `${p.name} — ${p.time}`,
  }))

  const pricePerSeat = bus.pricePerSeat
  const baseFare = pricePerSeat * seatIds.length
  const tax = Math.round(baseFare * TAX_RATE)
  const total = baseFare + tax + SERVICE_FEE

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    defaultValues: {
      passengers: seatIds.map(() => ({ name: '', age: '', gender: 'male' })),
      email: '',
      phone: '',
      boardingPoint: boardingPoints[0]?.id ?? '',
      agreeToTerms: false,
    },
  })

  const onSubmit = async (data: BookingFormValues) => {
    // TODO: call booking API with passenger/contact data, e.g.:
    // const { bookingId } = await createBooking({ busId, seatIds, passengers: data.passengers,
    //   email: data.email, phone: data.phone, boardingPoint: data.boardingPoint })
    // router.push(`/booking/confirm?bookingId=${bookingId}`)
    void data
    await new Promise((r) => setTimeout(r, 1000))
    const params = new URLSearchParams({ busId, seats: seatIds.join(','), from, to, date })
    router.push(`/booking/confirm?${params.toString()}`)
  }

  const inputClass = (hasError: boolean) =>
    cn(
      'h-12 border rounded-lg px-4 text-[#1E293B] text-base placeholder:text-slate-400',
      'focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all',
      'focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)]',
      hasError
        ? 'border-red-400 focus:ring-red-400'
        : 'border-[#E2E8F0]'
    )

  return (
    <motion.div
      variants={getMotionVariants(pageFadeIn, reduceMotion)}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#F8FAFC]"
    >
      {/* Header */}
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
        <h1 className="text-[18px] font-semibold text-[#1E293B]">Booking Details</h1>
      </div>

      {/* Progress indicator */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-[1440px] mx-auto">
          <ProgressSteps steps={PROGRESS_STEPS} currentStep={0} />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* ── LEFT: Form (60%) ────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Passenger Details */}
              <FormSection title="Passenger Details">
                {seatIds.map((seatId, idx) => (
                  <div key={seatId} className="border border-[#E2E8F0] rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-4">
                      Seat {seatId}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="col-span-1 sm:col-span-3">
                        <Label
                          htmlFor={`passengers.${idx}.name`}
                          className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id={`passengers.${idx}.name`}
                          placeholder="Enter passenger name"
                          {...register(`passengers.${idx}.name`, {
                            required: 'Name is required',
                          })}
                          className={inputClass(!!errors.passengers?.[idx]?.name)}
                          aria-describedby={errors.passengers?.[idx]?.name ? `name-err-${idx}` : undefined}
                        />
                        {errors.passengers?.[idx]?.name && (
                          <p id={`name-err-${idx}`} className="text-red-500 text-xs mt-1" role="alert">
                            {errors.passengers[idx]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor={`passengers.${idx}.age`}
                          className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block"
                        >
                          Age *
                        </Label>
                        <Input
                          id={`passengers.${idx}.age`}
                          type="number"
                          min="1"
                          max="120"
                          placeholder="Age"
                          {...register(`passengers.${idx}.age`, {
                            required: 'Age is required',
                            min: { value: 1, message: 'Invalid age' },
                          })}
                          className={inputClass(!!errors.passengers?.[idx]?.age)}
                          aria-describedby={errors.passengers?.[idx]?.age ? `age-err-${idx}` : undefined}
                        />
                        {errors.passengers?.[idx]?.age && (
                          <p id={`age-err-${idx}`} className="text-red-500 text-xs mt-1" role="alert">
                            {errors.passengers[idx]?.age?.message}
                          </p>
                        )}
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <Label
                          htmlFor={`passengers.${idx}.gender`}
                          className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block"
                        >
                          Gender *
                        </Label>
                        <select
                          id={`passengers.${idx}.gender`}
                          {...register(`passengers.${idx}.gender`)}
                          className={cn(
                            inputClass(false),
                            'w-full appearance-none bg-white cursor-pointer'
                          )}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </FormSection>

              {/* Contact Details */}
              <FormSection title="Contact Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Invalid email',
                        },
                      })}
                      className={inputClass(!!errors.email)}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1" role="alert">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register('phone', {
                        required: 'Phone is required',
                        pattern: {
                          value: /^[0-9+\-\s()]{8,15}$/,
                          message: 'Invalid phone number',
                        },
                      })}
                      className={inputClass(!!errors.phone)}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1" role="alert">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </FormSection>

              {/* Boarding Point */}
              <FormSection title="Boarding Point">
                <div>
                  <Label
                    htmlFor="boardingPoint"
                    className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block"
                  >
                    Select boarding location
                  </Label>
                  <select
                    id="boardingPoint"
                    {...register('boardingPoint', { required: 'Please select a boarding point' })}
                    className={cn(
                      inputClass(!!errors.boardingPoint),
                      'w-full appearance-none bg-white cursor-pointer'
                    )}
                  >
                    {boardingPoints.map((bp) => (
                      <option key={bp.id} value={bp.id}>
                        {bp.label}
                      </option>
                    ))}
                  </select>
                </div>
              </FormSection>

              {/* Terms */}
              <div className="flex items-start gap-3 py-2">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  {...register('agreeToTerms', {
                    required: 'You must agree to the terms',
                  })}
                  className="mt-0.5 w-4 h-4 accent-[#F97316] cursor-pointer"
                  aria-describedby={errors.agreeToTerms ? 'terms-error' : undefined}
                />
                <div>
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-sm text-[#1E293B] cursor-pointer"
                  >
                    I agree to the{' '}
                    <a href="/terms" className="text-[#F97316] hover:underline">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-[#F97316] hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                  {errors.agreeToTerms && (
                    <p id="terms-error" className="text-red-500 text-xs mt-1" role="alert">
                      {errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit (mobile shows here too) */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full h-12 rounded-lg font-medium text-base text-white',
                  'bg-[#F97316] hover:bg-[#EA580C]',
                  'transition-all hover:-translate-y-0.5',
                  'hover:shadow-[0_4px_12px_rgba(249,115,22,0.35)]',
                  'disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none',
                  'focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2'
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing…
                  </span>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </div>

            {/* ── RIGHT: Summary (40%) ─────────────────────────── */}
            <aside className="w-full lg:w-[360px] flex-shrink-0">
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5 sticky top-[136px]">
                <h2 className="text-[18px] font-semibold text-[#1E293B]">Trip Summary</h2>

                {/* Bus info */}
                <div className="bg-[#F8FAFC] rounded-lg p-4 space-y-1.5">
                  <p className="text-sm font-semibold text-[#1E293B]">{bus.busType}</p>
                  <p className="text-sm text-[#64748B]">{from} → {to}</p>
                  <p className="text-sm text-[#64748B]">
                    {formattedDate} · {bus.departureTime} → {bus.arrivalTime}
                  </p>
                  <p className="text-sm text-[#64748B]">{bus.operatorName}</p>
                </div>

                <div className="h-px bg-[#E2E8F0]" />

                {/* Passengers & Seats */}
                <div>
                  <p className="text-sm font-semibold text-[#1E293B] mb-2">
                    Passengers: {seatIds.length}
                  </p>
                  <p className="text-sm text-[#64748B]">
                    Seats: {seatIds.join(', ')}
                  </p>
                </div>

                <div className="h-px bg-[#E2E8F0]" />

                {/* Fare breakdown */}
                <div className="space-y-2.5">
                  <h3 className="text-sm font-semibold text-[#1E293B]">Fare Details</h3>
                  <FareRow
                    label={`Base Fare (${seatIds.length} × ₹${pricePerSeat.toLocaleString('en-IN')})`}
                    value={baseFare}
                  />
                  <FareRow label={`Tax (${TAX_RATE * 100}%)`} value={tax} />
                  <FareRow label="Service Fee" value={SERVICE_FEE} />
                  <div className="h-px bg-[#E2E8F0]" />
                  <FareRow label="Total Amount" value={total} bold />
                </div>

                <div className="h-px bg-[#E2E8F0]" />

                {/* Edit seats */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full border-[#E2E8F0] text-[#1E293B] hover:bg-slate-50 h-10"
                >
                  Edit Seats
                </Button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

// ── Helper sub-components ──────────────────────────────────────────────────

function ProgressSteps({
  steps,
  currentStep,
}: Readonly<{
  steps: string[]
  currentStep: number
}>) {
  return (
    <nav aria-label="Booking progress" className="flex items-center gap-2">
      {steps.map((step, idx) => {
        const isComplete = idx < currentStep
        const isCurrent = idx === currentStep
        let stepColorClass = 'bg-white border-[#E2E8F0] text-[#64748B]'
        if (isComplete) stepColorClass = 'bg-[#10B981] border-[#10B981] text-white'
        else if (isCurrent) stepColorClass = 'bg-[#F97316] border-[#F97316] text-white'
        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2',
                  stepColorClass
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isComplete ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium hidden sm:block',
                  isCurrent ? 'text-[#1E293B]' : 'text-[#64748B]'
                )}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 sm:w-16 rounded-full',
                  idx < currentStep ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'
                )}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}

function FormSection({
  title,
  children,
}: Readonly<{
  title: string
  children: React.ReactNode
}>) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
      <h2 className="text-[16px] font-semibold text-[#1E293B] mb-5">{title}</h2>
      {children}
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
