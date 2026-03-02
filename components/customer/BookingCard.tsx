'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, Users, MessageCircle, Eye, X, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CustomerBooking } from '@/lib/customer-types'
import { STATUS_CONFIG } from '@/lib/customer-types'
import { cn } from '@/lib/utils'

interface BookingCardProps {
  booking: CustomerBooking
  onCancel?: (id: string) => void
  onRate?: (id: string) => void
  compact?: boolean
}

const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgZmlsbD0iI2UyZThmMCIvPjwvc3ZnPg=='

export function BookingCard({ booking, onCancel, onRate, compact = false }: Readonly<BookingCardProps>) {
  const shouldReduce = useReducedMotion()
  const config = STATUS_CONFIG[booking.status]

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
    hover: { y: shouldReduce ? 0 : -4, boxShadow: '0 10px 40px rgba(0,0,0,0.12)' },
  }

  const whatsappLink = `https://wa.me/${booking.driver_phone?.replaceAll(/\D/g, '')}?text=${encodeURIComponent(
    `Hi, I have a booking ${booking.booking_number} – ${booking.pickup_location} to ${booking.drop_location} on ${new Date(booking.trip_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
  )}`

  const tripDate = new Date(booking.trip_date)
  const formattedDate = tripDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm"
    >
      {/* Status accent bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 rounded-t-2xl',
          booking.status === 'confirmed' && 'bg-green-500',
          booking.status === 'pending' && 'bg-amber-400',
          booking.status === 'cancelled' && 'bg-red-400',
          booking.status === 'completed' && 'bg-purple-500',
        )}
      />

      <div className={cn('flex gap-4 p-5 pt-6', compact && 'p-4 pt-5')}>
        {/* Vehicle Image */}
        {!compact && (
          <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
            <Image
              src={booking.vehicle_image || '/images/vehicles/default-bus.jpg'}
              alt={booking.vehicle_name || 'Bus image'}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              sizes="96px"
            />
          </div>
        )}

        {/* Details */}
        <div className="flex-1 min-w-0">
          {/* Route */}
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-3.5 w-3.5 text-saffron flex-shrink-0" />
            <span className="font-heading font-semibold text-neutral-800 text-sm truncate">
              {booking.pickup_location}
            </span>
            <span className="text-neutral-400 text-xs">→</span>
            <span className="font-heading font-semibold text-neutral-800 text-sm truncate">
              {booking.drop_location}
            </span>
          </div>

          {/* Booking number */}
          <p className="text-xs text-neutral-500 mb-2 font-mono">#{booking.booking_number}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
              {booking.trip_time && ` @ ${booking.trip_time}`}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {booking.passenger_count} passengers
            </span>
            {booking.vehicle_name && (
              <span className="text-neutral-400 truncate">{booking.vehicle_name}</span>
            )}
          </div>

          {/* Bottom row: status + price + actions */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full',
                  config.bgColor,
                  config.color,
                )}
              >
                {config.icon} {config.label}
              </span>
              <span className="text-sm font-bold text-neutral-800">
                ₹{booking.total_amount.toLocaleString('en-IN')}
                {booking.payment_status === 'paid' && (
                  <span className="text-xs font-normal text-green-600 ml-1">Paid</span>
                )}
                {booking.payment_status === 'pending' && (
                  <span className="text-xs font-normal text-amber-600 ml-1">Due</span>
                )}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" asChild className="h-7 px-2.5 text-xs rounded-lg">
                <Link href={`/customer/bookings/${booking.id}`}>
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Link>
              </Button>
              {booking.driver_phone && booking.status === 'confirmed' && (
                <Button size="sm" asChild className="h-7 px-2.5 text-xs rounded-lg bg-green-500 hover:bg-green-600 text-white">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    WhatsApp
                  </a>
                </Button>
              )}
              {booking.status === 'pending' && onCancel && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2.5 text-xs rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onCancel(booking.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              )}
              {booking.status === 'completed' && !booking.customer_rating && (
                <Button
                  size="sm"
                  className="h-7 px-2.5 text-xs rounded-lg bg-saffron hover:bg-saffron-dark text-white"
                  onClick={onRate ? () => onRate(booking.id) : undefined}
                >
                  <Star className="h-3 w-3 mr-1" />
                  Rate
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
