import type { Metadata } from 'next'
import { Suspense } from 'react'
import VehicleDetailClient from './VehicleDetailClient'

export const metadata: Metadata = {
  title: 'Vehicle Details — Charter Bus',
  description: 'View bus details, amenities, seat layout and reviews before booking.',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<VehicleDetailSkeleton />}>
      <VehicleDetailClient id={id} />
    </Suspense>
  )
}

function VehicleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-pulse">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="h-[400px] bg-slate-200 rounded-xl" />
        <div className="h-8 w-64 bg-slate-200 rounded-lg" />
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="h-48 bg-slate-200 rounded-xl" />
      </div>
    </div>
  )
}
