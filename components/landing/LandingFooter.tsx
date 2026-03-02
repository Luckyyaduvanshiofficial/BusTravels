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
    <footer className="bg-[#1a1a1a] text-white" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-5">
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
                { icon: SimpleFacebookIcon, href: '#', label: 'Facebook' },
                { icon: XIcon,             href: '#', label: 'Twitter / X' },
                { icon: MessageCircle,  href: 'https://wa.me/919876543210', label: 'WhatsApp' },
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
          <div className="hidden md:block">
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
