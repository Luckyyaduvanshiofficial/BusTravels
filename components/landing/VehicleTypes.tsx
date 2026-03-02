'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const VEHICLES = [
  {
    id: 'tavera',
    name: 'Tavera',
    tagline: 'City commutes & short trips',
    capacity: '7 Passengers',
    pricePerDay: '₹3,500',
    pricePerKm: '₹10',
    perfectFor: ['Airport pickups', 'City transfers', 'Small family trips'],
    amenities: ['AC & Music', 'Comfortable seats', 'Luggage space', 'GPS tracking'],
    image: '/images/vehicles/tavera.jpg',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'innova',
    name: 'Innova Crysta',
    tagline: 'Premium family comfort',
    capacity: '7 Passengers',
    pricePerDay: '₹5,000',
    pricePerKm: '₹12',
    perfectFor: ['Family trips (7 pax)', 'Airport pickups', 'Short tours'],
    amenities: ['AC, Music, GPS', 'Premium seats', 'USB charging', 'Ample legroom'],
    image: '/images/vehicles/innova.jpg',
    color: 'from-blue-500 to-royalBlue',
  },
  {
    id: 'tempo',
    name: 'Tempo Traveller',
    tagline: 'Group trips made easy',
    capacity: '12–17 Passengers',
    pricePerDay: '₹7,000',
    pricePerKm: '₹14',
    perfectFor: ['Pilgrimage tours', 'Corporate outings', 'Family gatherings'],
    amenities: ['AC, Music, GPS', 'Pushback seats', '2×2 layout', 'Water bottles'],
    image: '/images/vehicles/tempo.jpg',
    color: 'from-green-500 to-forestGreen',
  },
  {
    id: 'mini-bus',
    name: 'Mini Bus',
    tagline: 'Wedding transport & events',
    capacity: '20–35 Passengers',
    pricePerDay: '₹10,000',
    pricePerKm: '₹16',
    perfectFor: ['Wedding baraat', 'Religious groups', 'School excursions'],
    amenities: ['AC & Entertainment', 'Reclining seats', 'Mic system', 'Decorated on request'],
    image: '/images/vehicles/mini-bus.jpg',
    color: 'from-purple-500 to-deepPurple',
  },
  {
    id: 'volvo',
    name: 'Volvo Bus',
    tagline: 'Long-distance luxury',
    capacity: '40–50 Passengers',
    pricePerDay: '₹18,000',
    pricePerKm: '₹20',
    perfectFor: ['Long-distance tours', 'Corporate travel', 'Festival groups'],
    amenities: ['AC, Wi-Fi, TV', 'Airplane-style seats', 'Reading lights', 'Onboard restroom'],
    image: '/images/vehicles/volvo.jpg',
    color: 'from-saffron to-terracotta',
  },
]

export function VehicleTypes() {
  const [active, setActive] = useState(VEHICLES[1]) // Innova by default
  const sectionRef = useRef<HTMLElement>(null)

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

  return (
    <section
      id="vehicle-types"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-white"
      aria-labelledby="fleet-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-royalBlue text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Our Fleet
          </span>
          <h2 id="fleet-heading" className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Choose Your Vehicle
          </h2>
          <p className="font-hindi text-xl text-gray-500">हमारे वाहन</p>
        </div>

        {/* Tab Navigation */}
        <nav
          className="flex flex-nowrap overflow-x-auto gap-2 mb-10 pb-2 reveal"
          aria-label="Vehicle type tabs"
          role="tablist"
        >
          {VEHICLES.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={active.id === v.id}
              aria-controls={`panel-${v.id}`}
              onClick={() => setActive(v)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                active.id === v.id
                  ? 'bg-saffron text-white shadow-[0_4px_12px_rgba(255,107,53,0.35)]'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-saffron'
              }`}
            >
              {v.name}
            </button>
          ))}
        </nav>

        {/* Content Panel */}
        <div
          id={`panel-${active.id}`}
          role="tabpanel"
          className="reveal grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center"
        >
          {/* Image */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)] relative">
            <div
              className={`w-full aspect-[16/10] bg-gradient-to-br flex items-center justify-center`}
              role="img"
              aria-label={`${active.name} vehicle`}
            >
              <Image
                src={active.image}
                alt={active.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              {/* Fallback label */}
              <span className="absolute text-white font-heading text-3xl font-bold opacity-30 select-none z-0">
                {active.name}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">{active.name}</h3>
              <p className="text-gray-500 mt-1">{active.tagline}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-orange-50 text-saffron text-sm font-semibold rounded-lg">
                👥 {active.capacity}
              </span>
            </div>

            {/* Perfect for */}
            <div>
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Perfect For</p>
              <ul className="space-y-1.5">
                {active.perfectFor.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Amenities */}
            <div>
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Amenities</p>
              <div className="grid grid-cols-2 gap-1.5">
                {active.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-forestGreen flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-warmBeige border border-goldAccent/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Starting From</p>
              <p className="font-heading text-2xl font-bold text-gray-900">
                {active.pricePerDay}
                <span className="text-base font-normal text-gray-500">/day</span>
              </p>
              <p className="text-sm text-gray-500">+ {active.pricePerKm}/km (outstation)</p>
            </div>

            {/* CTA */}
            <Link href={`/search?type=${active.id}`}>
              <Button className="w-full h-12 gradient-saffron text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(255,107,53,0.38)] hover:-translate-y-0.5 transition-all">
                Book {active.name}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
