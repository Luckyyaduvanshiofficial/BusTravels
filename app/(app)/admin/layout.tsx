// Admin Dashboard Layout
import { ErrorBoundary } from '@/components/error-boundary';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Dashboard | Bus Booking',
  description: 'Platform administration',
};

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          {/* Admin Navigation */}
          <header className="bg-muted/30 border-b border-border sticky top-0 z-50 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="font-display font-bold text-xl tracking-tight text-primary flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" aria-hidden="true" />
                  {' '}
                  ADMIN PORTAL
                </span>
                <nav className="hidden md:flex gap-6 text-sm font-medium">
                  <Link href="/admin/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
                  <Link href="/admin/users" className="text-muted-foreground hover:text-primary transition-colors">Users</Link>
                  <Link href="/admin/operators" className="text-muted-foreground hover:text-primary transition-colors">Operators</Link>
                  <Link href="/admin/buses" className="text-muted-foreground hover:text-primary transition-colors">Buses</Link>
                  <Link href="/admin/bookings" className="text-muted-foreground hover:text-primary transition-colors">Bookings</Link>
                  <Link href="/admin/reports" className="text-muted-foreground hover:text-primary transition-colors">Reports</Link>
                  <Link href="/admin/settings" className="text-muted-foreground hover:text-primary transition-colors">Settings</Link>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
