import Image from 'next/image'
import { Star, ShieldCheck, Languages, Navigation } from 'lucide-react'
import { DRIVER_PROFILES } from '@/lib/data/landing'

export function DriverProfiles() {
  return (
    <section className="py-20 sm:py-28 bg-white border-t border-gray-100" id="trusted-drivers" aria-labelledby="drivers-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-royalBlue font-bold tracking-wider uppercase text-sm mb-3 block">Safety First</span>
          <h2 id="drivers-heading" className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Meet Our <span className="text-saffron">Verified Expert</span> Drivers
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Every driver goes through a strict background check and has years of experience on Rajasthan&apos;s roads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {DRIVER_PROFILES.map((driver, idx) => (
            <div 
              key={driver.id} 
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative group animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'both' }}
              itemScope
              itemType="https://schema.org/Person"
            >
              {/* Top verification badge */}
              <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg z-10" title="Verified Background Check">
                <ShieldCheck className="w-5 h-5" />
              </div>

              {/* Photo */}
              <div className="relative w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-saffron/20 transition-colors">
                <Image
                  src={driver.imageUrl}
                  alt={`Photo of ${driver.name}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  loading="lazy"
                  itemProp="image"
                />
              </div>

              {/* Details */}
              <div className="text-center mb-5">
                <h3 className="font-bold text-xl text-gray-900" itemProp="name">{driver.name}</h3>
                <div className="flex items-center justify-center gap-1 mt-1 font-medium text-gray-700">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{driver.rating}</span>
                  <span className="text-gray-400 font-normal text-sm ml-1">({driver.trips}+ trips)</span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex items-start gap-3">
                  <Navigation className="w-4 h-4 text-royalBlue mt-0.5 shrink-0" aria-hidden="true" />
                  <span><strong>Experience:</strong> <span itemProp="jobTitle">{driver.experience} on route</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <Languages className="w-4 h-4 text-royalBlue mt-0.5 shrink-0" aria-hidden="true" />
                  <span><strong>Languages:</strong> {driver.languages.join(', ')}</span>
                </div>
                <div className="mt-3 inline-block bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium border border-gray-200 w-full text-center">
                  Specializes in: {driver.specialization}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
