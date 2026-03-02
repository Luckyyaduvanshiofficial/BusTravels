import Link from 'next/link'
import { Search, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const WHATSAPP_NUMBER = '+919876543210'
const WHATSAPP_MESSAGE = encodeURIComponent('Hello BusYatra! I want to book a bus for my trip.')

export function FinalCTA() {
  return (
    <section
      id="cta"
      className="py-20 sm:py-28 gradient-orange-pink relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-white/8 blur-3xl" aria-hidden />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
        {/* Heading */}
        <div>
          <h2 id="cta-heading" className="font-heading text-3xl sm:text-5xl font-bold text-white leading-tight">
            Ready to Book Your Ride?
          </h2>
          <p className="font-hindi text-xl sm:text-2xl text-white/80 mt-2">
            अपनी यात्रा आज ही बुक करें
          </p>
        </div>

        <p className="text-white/80 text-base sm:text-lg max-w-md mx-auto">
          Join 1,000+ happy customers from Rajasthan who trust BusYatra for every journey.
        </p>

        {/* Primary CTA */}
        <Link href="/search" className="block">
          <Button
            size="lg"
            className="w-full sm:w-[400px] h-14 bg-white text-saffron font-bold text-lg rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)] hover:scale-105 transition-all"
          >
            <Search className="mr-2 w-5 h-5" />
            Search Vehicles
          </Button>
        </Link>

        <p className="text-white/60 text-sm font-medium select-none">— or —</p>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full sm:w-[400px] mx-auto"
          aria-label="Chat on WhatsApp"
        >
          <Button
            size="lg"
            className="w-full h-14 bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold text-lg rounded-2xl animate-whatsapp-pulse hover:scale-105 transition-all"
          >
            <MessageCircle className="mr-2 w-5 h-5" />
            Chat on WhatsApp
          </Button>
          <p className="text-white/60 text-xs mt-2">+91-98765-43210 · We reply in minutes</p>
        </a>
      </div>
    </section>
  )
}
