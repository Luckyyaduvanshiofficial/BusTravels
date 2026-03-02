'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Handshake, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STEPS = [
  {
    number: '01',
    icon: Search,
    iconColor: 'text-saffron',
    iconBg: 'bg-orange-50',
    title: 'Search & Select',
    titleHindi: 'खोजें और चुनें',
    description:
      'Browse 100+ verified buses across Jaipur & Rajasthan. Filter by vehicle type, capacity, and price. Compare operators side-by-side.',
  },
  {
    number: '02',
    icon: Handshake,
    iconColor: 'text-royalBlue',
    iconBg: 'bg-blue-50',
    title: 'Negotiate & Book',
    titleHindi: 'बातचीत करें और बुक करें',
    description:
      'Propose your price directly. Verified operators respond in minutes. Confirm your booking with a small advance payment.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    iconColor: 'text-forestGreen',
    iconBg: 'bg-green-50',
    title: 'Travel with Peace',
    titleHindi: 'सुकून से यात्रा करें',
    description:
      "Driver's contact and real-time location shared 2 hours before departure. 24/7 customer support throughout your trip.",
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'))
          }
        })
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-warmBeige"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-14 reveal">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-saffron text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Simple Process
          </span>
          <h2
            id="how-it-works-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-2"
          >
            How BusYatra Works
          </h2>
          <p className="font-hindi text-xl text-gray-500 mb-4">कैसे काम करता है</p>
          <p className="text-gray-600 max-w-lg mx-auto">
            Book your bus in 3 simple steps. No middlemen, transparent pricing,
            and verified operators every time.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <article
                key={step.number}
                className={`reveal reveal-delay-${i + 1} card-hover relative bg-white rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]`}
              >
                {/* Step number badge */}
                <span className="absolute top-6 right-6 w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-sm font-bold text-royalBlue font-heading">
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center mb-6`}
                  aria-hidden
                >
                  <Icon className={`w-8 h-8 ${step.iconColor}`} />
                </div>

                <h3 className="font-heading text-xl font-bold text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="font-hindi text-sm text-gray-400 mb-3">{step.titleHindi}</p>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </article>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 reveal">
          <Link href="/search">
            <Button className="gradient-saffron text-white px-8 h-13 text-base font-semibold rounded-xl shadow-[0_4px_14px_rgba(255,107,53,0.38)] hover:shadow-[0_6px_22px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 transition-all">
              Start Searching
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
