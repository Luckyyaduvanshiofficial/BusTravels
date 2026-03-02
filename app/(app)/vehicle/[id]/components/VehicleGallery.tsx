'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VehicleGalleryProps {
  images: string[]
  busName: string
}

const gallerySlide = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] } },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
}

export default function VehicleGallery({ images, busName }: Readonly<VehicleGalleryProps>) {
  const [[activeIdx, direction], setSlide] = useState([0, 0])

  if (!images.length) {
    return (
      <div className="w-full rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center" style={{ aspectRatio: '2/1', maxHeight: 400 }}>
        <span className="text-5xl" aria-hidden="true">🚌</span>
      </div>
    )
  }

  const go = (next: number) => {
    const d = next > activeIdx ? 1 : -1
    setSlide([Math.max(0, Math.min(images.length - 1, next)), d])
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative w-full rounded-xl overflow-hidden bg-slate-100"
        style={{ aspectRatio: '2/1', maxHeight: 400 }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={activeIdx}
            src={images[activeIdx]}
            alt={`${busName} — photo ${activeIdx + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            variants={gallerySlide}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
          />
        </AnimatePresence>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => go(activeIdx - 1)}
              disabled={activeIdx === 0}
              aria-label="Previous photo"
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 z-10',
                'w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center',
                'hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
              )}
            >
              <ChevronLeft className="w-5 h-5 text-[#1E293B]" />
            </button>
            <button
              onClick={() => go(activeIdx + 1)}
              disabled={activeIdx === images.length - 1}
              aria-label="Next photo"
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 z-10',
                'w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center',
                'hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
              )}
            >
              <ChevronRight className="w-5 h-5 text-[#1E293B]" />
            </button>
          </>
        )}

        {/* Counter badge */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
          {activeIdx + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              onClick={() => go(idx)}
              aria-label={`Photo ${idx + 1}`}
              aria-current={activeIdx === idx}
              className={cn(
                'flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all relative',
                activeIdx === idx ? 'border-[#F97316]' : 'border-transparent opacity-60 hover:opacity-90'
              )}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
