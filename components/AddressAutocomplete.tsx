'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { MapPin } from 'lucide-react'

interface AddressAutocompleteProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  icon?: React.ReactNode
  id?: string
  required?: boolean
  className?: string
}

interface GeoapifyFeature {
  properties: {
    formatted: string;
    city?: string;
    state?: string;
  }
}

export function AddressAutocomplete({ 
  placeholder, 
  value, 
  onChange, 
  icon,
  id,
  required,
  className = "h-14 bg-muted/30 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary font-medium rounded-xl"
}: Readonly<AddressAutocompleteProps>) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<GeoapifyFeature[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!query || query.length < 3 || query === value) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=3e0d641800a34959a79c1695dea89686`,
          { headers: { Accept: 'application/json' } }
        )
        const data = await response.json()
        if (data?.features) {
          setResults(data.features)
          setIsOpen(true)
        }
      } catch (error) {
        console.error('Error fetching autocomplete:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchPlaces()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, value])

  const handleSelect = (result: GeoapifyFeature) => {
    const cityName = result.properties.city || result.properties.formatted.split(',')[0]
    setQuery(cityName)
    onChange(cityName)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        {icon || <MapPin className="h-5 w-5 text-muted-foreground mr-1" />}
      </div>
      <Input
        id={id}
        required={required}
        type="text"
        placeholder={placeholder || "Search location..."}
        className={`pl-10 w-full ${className}`}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          if (!isOpen && e.target.value.length >= 3) {
             setIsOpen(true)
          }
        }}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true)
        }}
      />
      
      {isOpen && (results.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-sm text-center text-muted-foreground">Searching...</div>
          ) : (
            <ul className="py-2">
              {results.map((result) => (
                <li key={result.properties.formatted} className="px-4 py-3">
                  <button
                    type="button"
                    className="w-full text-left hover:bg-muted/50 cursor-pointer text-sm flex flex-col"
                    onClick={() => handleSelect(result)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleSelect(result)
                      }
                    }}
                  >
                    <span className="font-semibold text-zinc-900">
                      {result.properties.city || result.properties.formatted.split(',')[0]}
                    </span>
                    <span className="text-muted-foreground text-xs mt-0.5 truncate flex items-center">
                       <MapPin className="h-3 w-3 inline mr-1 opacity-50"/> 
                       {result.properties.formatted}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
