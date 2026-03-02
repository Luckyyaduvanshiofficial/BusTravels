'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CalendarDays, Clock, User, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/customer/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/customer/bookings', icon: CalendarDays, label: 'Bookings' },
  { href: '/customer/past-trips', icon: Clock, label: 'Past' },
  { href: '/customer/profile', icon: User, label: 'Profile' },
  { href: '/customer/payments', icon: CreditCard, label: 'Payments' },
]

export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-100 safe-area-pb"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-safe">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/')
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              aria-current={active ? 'page' : undefined}
            >
              <tab.icon
                className={cn(
                  'h-5.5 w-5.5 transition-colors',
                  active ? 'text-saffron' : 'text-neutral-400',
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-semibold transition-colors',
                  active ? 'text-saffron' : 'text-neutral-400',
                )}
              >
                {tab.label}
              </span>
              {active && (
                <span className="absolute -top-0.5 h-0.5 w-6 bg-saffron rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
