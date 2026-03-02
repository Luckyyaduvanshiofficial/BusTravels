'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bus, Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface LandingNavbarProps {
  lang?: 'en' | 'hi'
  onLangChange?: (lang: 'en' | 'hi') => void
}

export function LandingNavbar({ lang = 'en', onLangChange }: LandingNavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { href: '/search',            label: 'Search Buses' },
    { href: '#how-it-works',      label: 'How It Works' },
    { href: '#vehicle-types',     label: 'Our Fleet' },
    { href: '/operator/register', label: 'Partner With Us' },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-saffron text-white shadow-sm">
              <Bus className="w-5 h-5" />
            </div>
            <span
              className={`text-xl font-bold font-heading tracking-tight transition-colors ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              BusYatra
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-saffron ${
                  scrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => onLangChange?.(lang === 'en' ? 'hi' : 'en')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                scrolled
                  ? 'border-gray-300 text-gray-600 hover:border-saffron hover:text-saffron'
                  : 'border-white/60 text-white/90 hover:bg-white/10'
              }`}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>

            <Link href="/operator/login">
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm font-semibold transition-colors ${
                  scrolled
                    ? 'text-gray-700 hover:text-saffron'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Operator Login
              </Button>
            </Link>

            <Link href="/search">
              <Button
                size="sm"
                className="gradient-saffron text-white font-semibold rounded-xl px-5 shadow-[0_4px_14px_rgba(255,107,53,0.45)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.6)] hover:-translate-y-0.5 transition-all"
              >
                Book a Bus
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-saffron text-white">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span className="font-bold font-heading text-gray-900">BusYatra</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1 rounded-md text-gray-500 hover:text-gray-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col px-4 py-6 gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-orange-50 hover:text-saffron transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <Link href="/operator/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Operator Login</Button>
                  </Link>
                  <Link href="/search" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full gradient-saffron text-white">Book a Bus</Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  )
}
