import type { Metadata } from 'next'
import {
  LandingNavbar,
  HeroSection,
  PopularRoutes,
  HowItWorks,
  VehicleTypes,
  UseCases,
  DriverProfiles,
  TrustSafety,
  Testimonials,
  FinalCTA,
  LandingFooter,
  SEOSchema
} from '@/components/landing'

export const metadata: Metadata = {
  metadataBase: new URL('https://busbookingapp.com'),
  title: 'BusYatra – Book Buses in Jaipur for Weddings, Tours & Trips',
  description: 'Book premium buses and tempo travellers for weddings, religious tours & family trips in Jaipur and Rajasthan. 100+ verified operators, transparent pricing, 24/7 support.',
  keywords: 'Bus booking Jaipur, Rent bus Jaipur, Wedding bus hire, Khatu Shyam ji bus, Volvo bus rental Rajasthan, Tempo traveller on rent in Jaipur',
  alternates: { 
    canonical: 'https://busbookingapp.com/' 
  },
  openGraph: {
    title: 'BusYatra – Book Buses in Jaipur for Weddings, Tours & Trips',
    description: 'Book buses for weddings, religious tours & family trips in Jaipur and Rajasthan. 100+ verified operators, transparent pricing, 24/7 support.',
    url: 'https://busbookingapp.com',
    siteName: 'BusYatra',
    images: [
      {
        url: 'https://busbookingapp.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BusYatra – Premium Bus Booking in Jaipur',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BusYatra – Book Buses in Jaipur',
    description: 'Book buses for weddings, religious tours & family trips in Jaipur and Rajasthan.',
    images: ['https://busbookingapp.com/images/twitter-card.jpg'],
  },
}

export default function LandingPage() {
  return (
    <>
      <SEOSchema />
      
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:px-4 focus:py-2 focus:bg-saffron focus:text-white focus:z-[60] focus:fixed focus:top-4 focus:left-4 rounded-lg font-semibold">
        Skip to main content
      </a>

      <LandingNavbar />

      <main id="main-content">
        {/* S1 – Hero */}
        <HeroSection />

        {/* S2 - Popular Routes (NEW) */}
        <PopularRoutes />

        {/* S3 – How It Works */}
        <HowItWorks />

        {/* S4 – Vehicle Types */}
        <VehicleTypes />

        {/* S5 – Use Cases */}
        <UseCases />

        {/* S6 - Driver Profiles (NEW) */}
        <DriverProfiles />

        {/* S7 – Trust & Safety */}
        <TrustSafety />

        {/* S8 – Testimonials */}
        <Testimonials />

        {/* S9 – Final CTA */}
        <FinalCTA />
      </main>

      {/* S10 – Footer */}
      <LandingFooter />

      {/* Floating WhatsApp Button (mobile) */}
      <a
        href="https://wa.me/919876543210?text=Hello%20BusYatra!%20I%20want%20to%20book%20a%20bus."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-5 z-50 sm:hidden w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg animate-whatsapp-pulse"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.503" />
        </svg>
      </a>
    </>
  )
}

