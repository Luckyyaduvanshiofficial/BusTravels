'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VEHICLE_TYPES } from '@/lib/data/landing'

export function SearchWidget() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState('')
  const [vehicleType, setVehicleType] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [suggestedLocations, setSuggestedLocations] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const suggestionRef = useRef<HTMLDivElement>(null)

  // Top preset locations in Jaipur
  const POPULAR_LOCATIONS = [
    'Jaipur Railway Station',
    'Sindhi Camp Bus Stand',
    '200ft Bypass, Jaipur',
    'Mansarovar, Jaipur',
    'Vaishali Nagar, Jaipur',
    'Vidhyadhar Nagar, Jaipur',
    'Tonk Road, Jaipur'
  ]

  // Handle click outside for suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced Auto-suggest mock
  const handleLocationChange = (val: string) => {
    setLocation(val)
    setActiveSuggestionIndex(-1)
    if (val.length > 1) {
      const filtered = POPULAR_LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(val.toLowerCase())
      )
      setSuggestedLocations(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSelectLocation = (loc: string) => {
    setLocation(loc)
    setShowSuggestions(false)
    setActiveSuggestionIndex(-1)
  }

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestedLocations.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestedLocations.length)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestionIndex((prev) => (prev <= 0 ? suggestedLocations.length - 1 : prev - 1))
      return
    }

    if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
      e.preventDefault()
      handleSelectLocation(suggestedLocations[activeSuggestionIndex])
      return
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveSuggestionIndex(-1)
    }
  }

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault()
    
    // Analytics event hook
    console.log('Event: search_started', { location, date, passengers, vehicleType })

    setLoading(true)
    const params = new URLSearchParams()
    if (location)    params.set('pickup', location)
    if (date)        params.set('date', date)
    if (passengers)  params.set('passengers', passengers)
    if (vehicleType) params.set('type', vehicleType)
    
    router.push(`/search?${params.toString()}`)
    
    // Analytics event hook
    console.log('Event: search_completed', { location, date, passengers, vehicleType })
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] p-5 sm:p-8 space-y-5 relative z-20"
      aria-label="Bus search form"
    >
      {/* Location Input with Auto-suggest */}
      <div className="relative" ref={suggestionRef}>
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-saffron" aria-hidden="true" />
        <Input
          type="text"
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
          onKeyDown={handleLocationKeyDown}
          onFocus={() => {
            if (location.length > 1) setShowSuggestions(true);
          }}
          placeholder="Pickup location (e.g., Jaipur Railway Station)"
          className="pl-11 h-13 text-base border-gray-200 focus:border-saffron focus:ring-saffron/20 rounded-xl"
          aria-label="Pickup location"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls="location-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={activeSuggestionIndex >= 0 ? `location-option-${activeSuggestionIndex}` : undefined}
          required
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestedLocations.length > 0 && (
          <ul id="location-suggestions" role="listbox" className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
            {suggestedLocations.map((loc, index) => (
              <li key={loc} id={`location-option-${index}`} role="option" aria-selected={activeSuggestionIndex === index}>
                <button
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm text-gray-700 outline-none ${activeSuggestionIndex === index ? 'bg-orange-50' : 'hover:bg-gray-50 focus:bg-gray-50'}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSelectLocation(loc)
                  }}
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {loc}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Date + Passengers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative flex-1">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-royalBlue" aria-hidden="true" />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="pl-11 h-13 text-base border-gray-200 w-full focus:border-royalBlue focus:ring-royalBlue/20 rounded-xl appearance-none"
            aria-label="Travel date"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className="relative flex-1">
          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-royalBlue" aria-hidden="true" />
          <Input
            type="number"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            placeholder="Passengers"
            min={1}
            max={65}
            className="pl-11 h-13 text-base border-gray-200 focus:border-royalBlue w-full focus:ring-royalBlue/20 rounded-xl"
            aria-label="Number of passengers"
          />
        </div>
      </div>

      {/* Vehicle Type Pills */}
      <fieldset aria-labelledby="vehicle-type-label" className="border-0 p-0 m-0">
        <p id="vehicle-type-label" className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Vehicle Type (Optional)
        </p>
        <div className="flex flex-wrap gap-2">
          {VEHICLE_TYPES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVehicleType(vehicleType === v.id ? null : v.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-saffron/50 ${
                vehicleType === v.id
                  ? 'bg-saffron border-saffron text-white shadow-sm'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-saffron/60 hover:text-saffron'
              }`}
              aria-pressed={vehicleType === v.id}
            >
              {v.label}
            </button>
          ))}
        </div>
      </fieldset>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-14 gradient-saffron text-white text-lg font-semibold rounded-xl shadow-[0_4px_20px_rgba(255,107,53,0.4)] hover:shadow-[0_6px_28px_rgba(255,107,53,0.55)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Searching Fleets…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Search className="w-5 h-5" aria-hidden="true" />
            Find Vehicles
          </span>
        )}
      </Button>
    </form>
  )
}
