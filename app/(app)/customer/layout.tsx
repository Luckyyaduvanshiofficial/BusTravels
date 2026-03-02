import { DashboardNav } from '@/components/customer/DashboardNav'
import { MobileTabBar } from '@/components/customer/MobileTabBar'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <DashboardNav />

      {/* Main content */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <MobileTabBar />
    </div>
  )
}
