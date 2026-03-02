'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, MapPin, Utensils } from 'lucide-react'
import type { VehicleDetail } from '@/lib/search-types'

interface VehicleTabsProps {
  vehicle: VehicleDetail
}

export default function VehicleTabs({ vehicle }: Readonly<VehicleTabsProps>) {
  return (
    <Tabs defaultValue="overview" className="mt-6">
      <TabsList className="w-full grid grid-cols-4 h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1">
        <TabsTrigger
          value="overview"
          className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1E293B] text-[#64748B] font-medium"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="amenities"
          className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1E293B] text-[#64748B] font-medium"
        >
          Amenities
        </TabsTrigger>
        <TabsTrigger
          value="policies"
          className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1E293B] text-[#64748B] font-medium"
        >
          Policies
        </TabsTrigger>
        <TabsTrigger
          value="faq"
          className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1E293B] text-[#64748B] font-medium"
        >
          FAQ
        </TabsTrigger>
      </TabsList>

      {/* Overview */}
      <TabsContent value="overview" className="mt-6 space-y-6">
        <PointsSection
          title="Boarding Points"
          icon={<MapPin className="w-4 h-4 text-emerald-500" />}
          points={vehicle.boardingPoints.map((p) => ({ time: p.time, location: p.name }))}
          color="emerald"
        />
        <div className="h-px bg-[#E2E8F0]" />
        <PointsSection
          title="Dropping Points"
          icon={<MapPin className="w-4 h-4 text-rose-500" />}
          points={vehicle.droppingPoints.map((p) => ({ time: p.time, location: p.name }))}
          color="rose"
        />
        {vehicle.restStops.length > 0 && (
          <>
            <div className="h-px bg-[#E2E8F0]" />
            <PointsSection
              title="Rest Stops"
              icon={<Utensils className="w-4 h-4 text-amber-500" />}
              points={vehicle.restStops.map((s) => ({ time: s.time, location: s.name }))}
              color="amber"
            />
          </>
        )}
      </TabsContent>

      {/* Amenities */}
      <TabsContent value="amenities" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {vehicle.amenities.map((item) => (
            <div key={item} className="flex items-center gap-2 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-sm text-[#1E293B]">{item}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Policies */}
      <TabsContent value="policies" className="mt-6 space-y-4">
        <PolicyBlock title="Cancellation Policy">
          <ul className="list-disc list-inside text-sm text-[#64748B] space-y-1">
            {vehicle.cancellationPolicy.map((line, idx) => (
              <li key={`cancel-${idx}`}>{line}</li>
            ))}
          </ul>
        </PolicyBlock>
        <PolicyBlock title="Baggage Policy">
          <p className="text-sm text-[#64748B]">Each passenger is allowed 1 piece of luggage (max 15 kg). Extra charges apply for overweight baggage.</p>
        </PolicyBlock>
        <PolicyBlock title="General Rules">
          <ul className="list-disc list-inside text-sm text-[#64748B] space-y-1">
            <li>No smoking on the vehicle</li>
            <li>Report to boarding point 10 minutes early</li>
            <li>Valid ID proof required during journey</li>
          </ul>
        </PolicyBlock>
      </TabsContent>

      {/* FAQ */}
      <TabsContent value="faq" className="mt-6 space-y-3">
        {[
          { q: 'Is the AC on throughout the journey?', a: 'Yes, AC runs throughout the journey. Temperature is maintained at 22–24°C.' },
          { q: 'Are there charging points on the bus?', a: 'Yes, each seat has a dedicated USB and 3-pin charging socket.' },
          { q: 'Is there WiFi on the bus?', a: 'Premium routes offer complimentary WiFi. Check the amenities list for this vehicle.' },
          { q: 'Can I choose my seat?', a: 'Yes, seat selection is available when booking and you can change seats up to 4 hours before departure.' },
        ].map(({ q, a }) => (
          <div key={q} className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
            <p className="text-sm font-semibold text-[#1E293B] mb-1">{q}</p>
            <p className="text-sm text-[#64748B]">{a}</p>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  )
}

function PointsSection({
  title,
  icon,
  points,
  color,
}: Readonly<{
  title: string
  icon: React.ReactNode
  points: { time: string; location: string }[]
  color: 'emerald' | 'rose' | 'amber'
}>) {
  const dotColor = {
    emerald: 'bg-emerald-400',
    rose: 'bg-rose-400',
    amber: 'bg-amber-400',
  }[color]

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-sm font-semibold text-[#1E293B]">{title}</h3>
      </div>
      <div className="relative pl-6 space-y-3">
        <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-[#E2E8F0]" />
        {points.map((p, idx) => (
          <div key={`${p.time}-${idx}`} className="relative">
            <div className={`absolute -left-4 top-1.5 w-2 h-2 rounded-full ${dotColor}`} />
            <p className="text-xs text-[#64748B] font-medium">{p.time}</p>
            <p className="text-sm text-[#1E293B]">{p.location}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PolicyBlock({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
      <h3 className="text-sm font-semibold text-[#1E293B] mb-2">{title}</h3>
      {children}
    </div>
  )
}
