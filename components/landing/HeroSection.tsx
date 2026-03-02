'use client'

import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { SearchWidget } from './SearchWidget'

const HERO_BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iOTAiIGZpbGw9IiMzOTQ4NWEiLz48L3N2Zz4='

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col"
      aria-label="Hero – Book a Bus"
    >
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 -z-10 bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000"
          alt="Decorated Indian tourist bus on the highway"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover opacity-80"
          placeholder="blur"
          blurDataURL={HERO_BLUR_PLACEHOLDER}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-royalBlue-dark/70 via-royalBlue/50 to-deepPurple/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16">
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <p className="font-hindi text-xl sm:text-2xl text-white/90 tracking-wide leading-relaxed animate-fade-in">
            आपकी यात्रा, हमारी जिम्मेदारी
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
            Book Buses for Weddings,{' '}
            <span className="text-saffron">Tours & Trips</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 font-medium max-w-xl mx-auto leading-relaxed drop-shadow-md">
            Jaipur & Rajasthan&rsquo;s most trusted bus booking platform.{' '}
            <span className="font-bold text-white">100+ verified operators.</span>
          </p>
        </div>

        {/* Search Widget V2 */}
        <div className="w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <SearchWidget />
        </div>

        {/* Trust badges below widget */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8 text-white text-sm animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          {['✅ Verified Drivers', '🛡️ Insured Vehicles', '💬 WhatsApp Support', '🏆 4.5★ Rated'].map(
            (badge) => (
              <span key={badge} className="bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 font-semibold shadow-sm border border-white/20">
                {badge}
              </span>
            )
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="relative z-10 pb-8 flex justify-center mt-auto">
        <a href="#how-it-works" aria-label="Scroll down" className="animate-bounce-arrow text-white/70 hover:text-white transition-colors focus:ring-2 focus:ring-white rounded-full">
          <ChevronDown className="w-9 h-9" />
        </a>
      </div>
    </section>
  )
}
