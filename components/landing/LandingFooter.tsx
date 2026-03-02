import Link from 'next/link'
import type { SVGProps } from 'react'
import { Bus, Mail, MapPin, Phone, MessageCircle } from 'lucide-react'

// Twitter/X icon as custom SVG (Lucide deprecated Twitter)
const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.907-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
)

const SimpleFacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.998 12c0 6.625-5.373 12-11.998 12C5.373 24 0 18.625 0 12 0 5.375 5.373 0 11.999 0 18.625 0 23.998 5.375 23.998 12zM16.577 12h-2.514v8.001h-3.58V12H9.188v-3.177h1.295V6.31c0-1.802.877-4.148 4.15-4.148l2.163.009V6.19H14.89c-.74 0-.977.372-.977.918V8.82h3.249l-.413 3.179z" />
  </svg>
)

const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const COLUMNS = [
  {
    heading: 'About',
    links: [
      { label: 'About BusYatra', href: '#' },
      { label: 'How It Works',    href: '#how-it-works' },
      { label: 'Our Fleet',       href: '#vehicle-types' },
      { label: 'Blog',            href: '#' },
    ],
  },
  {
    heading: 'For Operators',
    links: [
      { label: 'Register as Operator', href: '/operator/register' },
      { label: 'Operator Login',       href: '/operator/login' },
      { label: 'Operator Dashboard',   href: '/operator/dashboard' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy',   href: '#' },
      { label: 'Refund Policy',    href: '#' },
      { label: 'Cookie Policy',    href: '#' },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="bg-[#2C2C2C] text-white" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-saffron flex items-center justify-center flex-shrink-0">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading">BusYatra</span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              Jaipur&apos;s most trusted bus booking platform for weddings, religious tours, and family trips. आपकी यात्रा, हमारी जिम्मेदारी।
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: SimpleFacebookIcon, href: 'https://facebook.com/BusYatra', label: 'Facebook' },
                { icon: InstagramIcon,      href: 'https://instagram.com/BusYatra', label: 'Instagram' },
                { icon: XIcon,             href: 'https://twitter.com/BusYatra', label: 'Twitter / X' },
                { icon: MessageCircle,     href: 'https://wa.me/919876543210', label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-saffron hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/55 text-sm hover:text-white hover:underline decoration-saffron decoration-2 underline-offset-2 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="block">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">Contact</h3>
            <address className="not-italic space-y-3 text-sm">
              <a
                href="mailto:hello@busyatra.com"
                className="flex items-center gap-2.5 text-white/55 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                hello@busyatra.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 text-white/55 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                +91-98765-43210
              </a>
              <div className="flex items-start gap-2.5 text-white/55">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Jaipur, Rajasthan 302001</span>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} BusYatra. Made with ❤️ in Jaipur.
          </p>
          <p className="font-hindi text-white/25 text-sm">
            आपकी सेवा में सदा तत्पर
          </p>
        </div>
      </div>
    </footer>
  )
}
