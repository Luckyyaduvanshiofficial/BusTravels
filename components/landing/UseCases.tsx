'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const USE_CASES = [
  {
    id: 'wedding',
    emoji: '💐',
    label: 'Weddings',
    labelHindi: 'शादी-बारात',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Decorated bus for a wedding',
    gradientFallback: 'from-pink-400 to-rose-500',
    heading: 'Barat Transport Made Easy',
    description:
      'Make your barat procession unforgettable. Decorated buses, on-time pickup, and professional drivers who understand wedding logistics.',
    highlights: [
      'Decorated buses on request (marigolds, ribbons)',
      'Transport 50–300 guests comfortably',
      'Coordination with wedding planner',
      'Available across Rajasthan',
    ],
    priceRange: '₹12,000 – ₹30,000 per bus',
    routes: [
      { from: 'Jaipur', to: 'Bharatpur', km: '180 km' },
      { from: 'Jaipur', to: 'Jodhpur',   km: '335 km' },
      { from: 'Jaipur', to: 'Udaipur',   km: '420 km' },
    ],
  },
  {
    id: 'religious',
    emoji: '🕉️',
    label: 'Religious Tours',
    labelHindi: 'तीर्थ यात्रा',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Family at a temple',
    gradientFallback: 'from-amber-400 to-yellow-500',
    heading: 'Spiritual Journeys, Comfortable Travel',
    description:
      'Visit the most sacred places in Rajasthan with your family. Comfortable tempo travellers and mini buses for group pilgrimages.',
    highlights: [
      'Khatu Shyam Ji, Salasar Balaji, Pushkar',
      'Experienced drivers on pilgrimage routes',
      'Group bookings with elderly-friendly vehicles',
      'Flexible return timing',
    ],
    priceRange: '₹8,000 – ₹18,000 per bus',
    routes: [
      { from: 'Jaipur', to: 'Khatu Shyam',    km: '80 km' },
      { from: 'Jaipur', to: 'Salasar Balaji', km: '170 km' },
      { from: 'Jaipur', to: 'Pushkar',         km: '145 km' },
    ],
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧',
    label: 'Family Trips',
    labelHindi: 'पारिवारिक यात्रा',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Family group on a trip',
    gradientFallback: 'from-green-400 to-teal-500',
    heading: 'Create Memories Together',
    description:
      'Plan the perfect family outing with a private bus. All generations travel together — no splitting up, no coordination hassle.',
    highlights: [
      '3-generation family trips',
      'Ranthambore, Jaipur city tours',
      'Child-friendly vehicles',
      'Picnic & leisure packages',
    ],
    priceRange: '₹5,000 – ₹14,000 per bus',
    routes: [
      { from: 'Jaipur', to: 'Ranthambore', km: '180 km' },
      { from: 'Jaipur', to: 'Ajmer',       km: '135 km' },
      { from: 'Jaipur', to: 'Mandawa',     km: '170 km' },
    ],
  },
]

function revealEntry(entry: IntersectionObserverEntry) {
  if (!entry.isIntersecting) return
  entry.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'))
}

export function UseCases() {
  const [active, setActive] = useState(USE_CASES[0])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(revealEntry),
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-[linear-gradient(135deg,#fff7f3_0%,#fff4ed_100%)]"
      aria-labelledby="use-cases-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 reveal">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-saffron text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Every Occasion
          </span>
          <h2 id="use-cases-heading" className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
            Perfect for Every Occasion
          </h2>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 reveal" role="tablist">
          {USE_CASES.map((uc) => (
            <button
              key={uc.id}
              role="tab"
              aria-selected={active.id === uc.id}
              aria-controls={`uc-panel-${uc.id}`}
              onClick={() => setActive(uc)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                active.id === uc.id
                  ? 'bg-saffron text-white border-saffron shadow-[0_4px_12px_rgba(255,107,53,0.35)]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-saffron/50 hover:text-saffron'
              }`}
            >
              <span aria-hidden="true">{uc.emoji}</span>
              <span>{uc.label}</span>
              <span className="font-hindi text-xs opacity-75">{uc.labelHindi}</span>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div
          id={`uc-panel-${active.id}`}
          role="tabpanel"
          key={active.id}
          className="reveal grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
        >
          {/* Image */}
          <div
            className={`rounded-2xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.12)] aspect-[4/3] bg-gradient-to-br ${active.gradientFallback} relative flex items-center justify-center`}
          >
            <Image
              src={active.image}
              alt={active.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <span className="absolute z-10 text-white font-heading text-4xl font-bold opacity-20 select-none" aria-hidden="true">
              {active.emoji}
            </span>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.07)] space-y-5">
            <div>
              <h3 className="font-heading text-2xl font-bold text-gray-900">{active.heading}</h3>
              <p className="text-gray-600 mt-2 leading-relaxed">{active.description}</p>
            </div>

            <ul className="space-y-2">
              {active.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-gray-700">
                  <span className="text-saffron mt-0.5 flex-shrink-0">✓</span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="bg-warmBeige border border-goldAccent/25 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Price Range</p>
              <p className="text-lg font-bold text-gray-900 font-heading">{active.priceRange}</p>
            </div>

            <Link href={`/search?occasion=${active.id}`}>
              <Button className="w-full h-12 gradient-saffron text-white font-semibold rounded-xl hover:-translate-y-0.5 transition-all">
                Book for {active.label}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="mt-8 reveal">
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              Popular Routes for {active.label}
            </p>
            <div className="flex flex-wrap gap-3">
              {active.routes.map((r) => (
                <Link
                  key={`${r.from}-${r.to}`}
                  href={`/search?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-orange-50 rounded-xl text-sm text-gray-700 hover:text-saffron transition-colors group"
                >
                  <span>{r.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-saffron" />
                  <span>{r.to}</span>
                  <span className="text-xs text-gray-400 ml-1">({r.km})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
