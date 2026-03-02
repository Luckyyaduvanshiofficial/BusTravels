'use client'

import { motion } from 'framer-motion'
import { SearchCard } from './SearchCard'
import { QuickFilters } from './QuickFilters'
import { heroText, heroSubtext } from '@/lib/animations'

/**
 * Hero section for Search Page.
 * Spec: Navy Blue #1E293B bg, 500px desktop / 400px mobile
 * Heading: 48px Bold White
 * Subtitle: 16px Regular rgba(255,255,255,0.8)
 * Search card: 900px max-width, elevated
 */
export function SearchHero() {
  return (
    <section
      className="relative bg-[#1E293B] flex items-center justify-center"
      style={{ minHeight: 'clamp(400px, 60vh, 500px)' }}
      aria-label="Search for buses"
    >
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
        {/* Heading */}
        <motion.h1
          variants={heroText}
          initial="hidden"
          animate="visible"
          className="text-[clamp(32px,5vw,48px)] font-bold text-white text-center mb-4 leading-tight max-w-3xl"
        >
          Find your perfect ride
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={heroSubtext}
          initial="hidden"
          animate="visible"
          className="text-base text-white/80 text-center mb-8 max-w-xl leading-relaxed"
        >
          Book luxury buses, sleepers, and seaters for your next journey across
          the country with verified operators.
        </motion.p>

        {/* Search Card */}
        <div className="w-full max-w-[900px]">
          <SearchCard />
        </div>

        {/* Quick Filters */}
        <QuickFilters />
      </div>
    </section>
  )
}
