'use client'

import { useState, useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Menu, X, Bus, User, LogOut, LayoutDashboard } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'

interface NavUser {
  email: string
  role: string
  is_verified?: boolean
}

interface NavLink {
  href: string
  label: string
  icon?: LucideIcon
}

function getNavLinks(user: NavUser | null): NavLink[] {
  return [
    { href: '/search', label: 'Buses' },
    ...(user ? [] : [{ href: '/operator/login', label: 'Partner with Us' }]),
  ]
}

function getUserLinks(user: NavUser | null): NavLink[] {
  if (!user) return []
  const roleLinksMap: Record<string, NavLink[]> = {
    customer: [{ href: '/customer/dashboard', label: 'My Bookings', icon: Bus }],
    operator: [{ href: '/operator/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    admin: [{ href: '/admin/dashboard', label: 'Admin Panel', icon: LayoutDashboard }],
  }
  return roleLinksMap[user.role] ?? []
}

function isAuthPage(pathname: string | null): boolean {
  if (!pathname) return false
  return ['/login', '/register', '/operator/login', '/admin/login'].some(p => pathname.startsWith(p))
}

/* Desktop authentication section */
function DesktopAuthSection(
  { user, loading, onSignOut }: Readonly<{ user: NavUser | null; loading: boolean; onSignOut: () => void }>
) {
  if (loading) {
    return <Skeleton className="h-8 w-20 rounded" />
  }

  if (!user) {
    return (
      <>
        <Link href="/login">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-display font-semibold tracking-wide">
            Sign In
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm" className="bg-primary hover:bg-primary-dark text-white font-display font-semibold tracking-wide shadow-md shadow-primary/20 rounded-full px-6">
            Get Started
          </Button>
        </Link>
      </>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full border border-border">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
          {user.email}
        </span>
        <VerifiedBadge user={user} />
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onSignOut}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}

function VerifiedBadge({ user }: Readonly<{ user: NavUser }>) {
  if (user.role !== 'operator') return null
  const verified = user.is_verified
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${
      verified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning-dark'
    }`}>
      {verified ? '✓' : '!'}
    </span>
  )
}

/* Mobile bottom auth actions */
function MobileAuthFooter(
  { user, onSignOut, onClose }: Readonly<{ user: NavUser | null; onSignOut: () => void; onClose: () => void }>
) {
  if (user) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start text-muted-foreground border-border"
        onClick={() => { onSignOut(); onClose() }}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      <Link href="/login" onClick={onClose}>
        <Button variant="outline" className="w-full border-border text-foreground">
          Sign In
        </Button>
      </Link>
      <Link href="/register" onClick={onClose}>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Get Started
        </Button>
      </Link>
    </div>
  )
}

export function Navbar() {
  const [user, setUser] = useState<NavUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkUser() {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      if (supabaseUser) {
        setUser({
          email: supabaseUser.email || '',
          role: supabaseUser.user_metadata?.role || 'customer',
          is_verified: supabaseUser.user_metadata?.is_verified,
        })
      }
      setLoading(false)
    }
    checkUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  if (isAuthPage(pathname)) return null

  const navLinks = getNavLinks(user)
  const userLinks = getUserLinks(user)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Bus className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute -inset-1 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary font-display">
            CHARTER
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors font-display tracking-wide relative py-1 ${
                pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </Link>
          ))}
          {userLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors font-display tracking-wide relative py-1 flex items-center gap-1.5 ${
                pathname?.startsWith(link.href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
              {pathname?.startsWith(link.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <DesktopAuthSection user={user} loading={loading} onSignOut={handleSignOut} />
          <ThemeSwitcher />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-background p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <Bus className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold tracking-tight text-primary font-display">
                    CHARTER
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {userLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname?.startsWith(link.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-border">
                <MobileAuthFooter user={user} onSignOut={handleSignOut} onClose={() => setMobileOpen(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
