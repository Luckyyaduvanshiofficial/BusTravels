'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  User,
  CreditCard,
  Gift,
  HelpCircle,
  Settings,
  LogOut,
  Bus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/customer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/customer/bookings', icon: CalendarDays, label: 'My Bookings' },
  { href: '/customer/past-trips', icon: Clock, label: 'Past Trips' },
  { href: '/customer/profile', icon: User, label: 'Profile' },
  { href: '/customer/payments', icon: CreditCard, label: 'Payments' },
  { href: '/customer/rewards', icon: Gift, label: 'Rewards' },
  { href: '/customer/help', icon: HelpCircle, label: 'Help' },
]

export function DashboardNav() {
  const pathname = usePathname()
  const shouldReduce = useReducedMotion()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign-out failed:', error.message)
      return
    }
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-neutral-100 min-h-screen sticky top-0 h-screen">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-6 py-5 border-b border-neutral-100">
        <div className="w-8 h-8 rounded-lg bg-saffron flex items-center justify-center">
          <Bus className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="font-heading font-bold text-lg text-neutral-900">BusBook</span>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 py-4 overflow-y-auto" aria-label="Dashboard navigation">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron',
                active
                  ? 'text-saffron bg-saffron/8'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50',
              )}
            >
              {active && (
                <motion.div
                  layoutId="navActive"
                  className="absolute inset-0 bg-saffron/8 rounded-xl"
                  transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon
                className={cn('h-4.5 w-4.5 relative z-10', active ? 'text-saffron' : 'text-neutral-400')}
              />
              <span className="relative z-10">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom: settings + signout */}
      <div className="px-3 pb-4 border-t border-neutral-100 pt-3 space-y-0.5">
        <Link
          href="/customer/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
            pathname === '/customer/settings'
              ? 'text-saffron bg-saffron/8'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50',
          )}
        >
          <Settings className="h-4.5 w-4.5 text-neutral-400" />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <LogOut className="h-4.5 w-4.5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
