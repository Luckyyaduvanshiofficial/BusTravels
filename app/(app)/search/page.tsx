import type { Metadata } from 'next'
import { SearchHero } from './components/SearchHero'
import { PopularRoutes } from './components/PopularRoutes'
import { WhyCharter } from './components/WhyCharter'
export const metadata: Metadata = {
  title: 'Search Buses | Charter',
  description:
    'Search and book verified bus operators. Compare prices, amenities, and schedules.',
}
/**
 * Search Page - Charter Bus Rental Platform
 * Spec: search.md - PAGE 1: SEARCH PAGE
 *
 * 1. Navy hero section with search card + quick filters
 * 2. Popular routes section (#F8FAFC bg)
 * 3. Why choose Charter section (white bg)
 */
export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <SearchHero />
      <PopularRoutes />
      <WhyCharter />
    </div>
  )
}
