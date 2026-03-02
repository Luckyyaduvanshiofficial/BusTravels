'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/data/landing'

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = TESTIMONIALS.length
  const visibleCount = 3 // Show up to 3 on large screens

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total)
  }, [total])

  // Auto-play
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(next, 5000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, next])

  // Reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            e.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'))
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Compute visible indices (carousel wraps)
  const visibleIndices = Array.from({ length: Math.min(visibleCount, total) }, (_, i) =>
    (current + i) % total
  )

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-warmBeige"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-saffron text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Reviews
          </span>
          <h2 id="testimonials-heading" className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="font-hindi text-xl text-gray-500">ग्राहक समीक्षाएं</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 reveal">
          {visibleIndices.map((idx, i) => {
            const t = TESTIMONIALS[idx]
            return (
              <article
                key={`${t.id}-${i}`}
                className="bg-white rounded-2xl p-7 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-l-4 border-saffron relative"
                aria-label={`Testimonial by ${t.name}`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-5 h-5 fill-goldAccent text-goldAccent" />
                  ))}
                </div>

                {/* Occasion tag */}
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-saffron bg-orange-50 rounded-full mb-3">
                  {t.role}
                </span>

                {/* Quote */}
                <blockquote className="quote-open text-gray-700 text-[15px] leading-relaxed italic mb-5">
                  {t.text}
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                    aria-hidden
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-royalBlue text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.location}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-saffron hover:text-saffron transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                onClick={() => setCurrent(i)}
                className={`transition-all rounded-full ${
                  i === current
                    ? 'w-6 h-2.5 bg-saffron'
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonial"
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-saffron hover:text-saffron transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
