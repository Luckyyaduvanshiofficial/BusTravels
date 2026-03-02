'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star, Phone, MessageCircle, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DriverCardProps {
  name: string
  rating?: number
  totalTrips?: number
  driverSince?: string
  phone?: string
  avatarUrl?: string
  contactRevealTime?: string   // "2025-03-15 06:00"
  isContactRevealed?: boolean
}

const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2UyZThmMCIvPjwvc3ZnPg=='

export function DriverCard({
  name,
  rating,
  totalTrips,
  driverSince,
  phone,
  avatarUrl,
  contactRevealTime,
  isContactRevealed = false,
}: DriverCardProps) {
  const whatsappLink = phone
    ? `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hi ${name}, I have an upcoming booking.`
      )}`
    : '#'

  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
        Driver Information
      </h3>

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-100">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${name}'s photo`}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-royalBlue/10">
              <span className="text-2xl font-bold text-royalBlue">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Verified badge */}
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
            <Shield className="h-3 w-3 text-white" fill="white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="font-heading font-semibold text-neutral-800 text-base">{name}</p>

          {typeof rating === 'number' && (
            <div className="flex items-center gap-1 mt-0.5 mb-1">
              <Star className="h-3.5 w-3.5 text-goldAccent fill-goldAccent" />
              <span className="text-sm font-semibold text-neutral-700">{rating.toFixed(1)}</span>
              {typeof totalTrips === 'number' && (
                <span className="text-xs text-neutral-400">({totalTrips} trips)</span>
              )}
            </div>
          )}

          {driverSince && (
            <p className="text-xs text-neutral-500">Driver since {driverSince}</p>
          )}
        </div>
      </div>

      {/* Contact section */}
      <div className="mt-4 pt-4 border-t border-neutral-100">
        {isContactRevealed && phone ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <a href={`tel:${phone}`} className="flex-1">
              <Button variant="outline" className="w-full h-10 rounded-xl text-sm font-semibold" aria-label={`Call ${name}`}>
                <Phone className="h-4 w-4 mr-2 text-royalBlue" />
                {phone}
              </Button>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full h-10 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-3">
            <Clock className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Contact Not Yet Available</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Driver&apos;s contact will be revealed 2 hours before your trip.
                {contactRevealTime && (
                  <> Available from <span className="font-semibold">{contactRevealTime}</span></>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
