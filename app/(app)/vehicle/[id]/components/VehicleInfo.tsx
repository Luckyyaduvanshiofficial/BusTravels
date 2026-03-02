'use client'

import { CheckCircle, MapPin, Phone, Star, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VehicleDetail } from '@/lib/search-types'

interface VehicleInfoProps {
  vehicle: VehicleDetail
}

export default function VehicleInfo({ vehicle }: VehicleInfoProps) {
  return (
    <div className="space-y-5">
      {/* Header row */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">{vehicle.busName}</h1>
            <p className="text-[#64748B] text-sm mt-0.5">{vehicle.busType} · {vehicle.operatorName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#1E293B]">
              ₹{vehicle.pricePerSeat.toLocaleString('en-IN')}
            </p>
            <p className="text-[#64748B] text-xs">per seat</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {vehicle.operatorVerified && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Operator
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {vehicle.rating.toFixed(1)} ({vehicle.reviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Description */}
      {vehicle.description && (
        <p className="text-sm text-[#64748B] leading-relaxed">{vehicle.description}</p>
      )}

      {/* Key specs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Seats', value: `${vehicle.totalSeats}` },
          { label: 'AC', value: vehicle.amenities.includes('AC') ? 'Yes' : 'No' },
          // TODO: expose avgSpeed from API/VehicleDetail type; using placeholder for now
          { label: 'Avg. Speed', value: typeof (vehicle as { avgSpeed?: unknown }).avgSpeed === 'number'
            ? `${(vehicle as { avgSpeed: number }).avgSpeed} km/h`
            : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] font-medium uppercase tracking-wide">{label}</p>
            <p className="text-base font-semibold text-[#1E293B] mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Amenities quick grid */}
      <div>
        <h2 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wide mb-3">
          Amenities
        </h2>
        <div className="grid grid-cols-2 gap-1.5">
          {vehicle.amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2 text-sm text-[#1E293B]">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              {amenity}
            </div>
          ))}
        </div>
      </div>

      {/* Operator contact card */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">
            {vehicle.operatorName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1E293B]">{vehicle.operatorName}</p>
          <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" /> {vehicle.fromCity} → {vehicle.toCity}
          </p>
        </div>
      </div>
    </div>
  )
}
