'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getBuses } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Search, MapPin, Users, Calendar as CalendarIcon, Filter } from 'lucide-react'
import { AddressAutocomplete } from '@/components/AddressAutocomplete'
import type { Bus } from '@/lib/types'

export default function SearchPage() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)
  
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState('1')

  useEffect(() => {
    async function fetchBuses() {
      try {
        const data = await getBuses()
        setBuses(data)
        setFilteredBuses([])
      } catch (error) {
        console.error('Failed to fetch buses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBuses()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
    // Simplified filter logic for mockup
    const results = buses.filter(bus => 
      bus.seating_capacity >= parseInt(passengers || '1')
    )
    setFilteredBuses(results)
  }

  return (
    <div className="bg-zinc-50 min-h-screen pb-20">
      {/* Search Header */}
      <div className="bg-primary text-primary-foreground pt-12 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
            Find your perfect ride
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl font-medium">
            Book luxury buses, sleepers, and seaters for your next journey across the country with verified operators.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-20 relative z-20">
        <Card className="shadow-2xl shadow-black/5 border-0 rounded-2xl overflow-hidden mb-12">
          <CardContent className="p-2 sm:p-4">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                <div className="relative">
                  <AddressAutocomplete
                    placeholder="From City"
                    value={from}
                    onChange={setFrom}
                    icon={<MapPin className="h-5 w-5 text-muted-foreground mr-1" />}
                  />
                </div>
                <div className="relative">
                  <AddressAutocomplete
                    placeholder="To City"
                    value={to}
                    onChange={setTo}
                    icon={<MapPin className="h-5 w-5 text-muted-foreground mr-1" />}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground mr-1" />
                  </div>
                  <Input 
                    type="date" 
                    className="pl-10 h-14 bg-muted/30 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary font-medium rounded-xl text-foreground"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-muted-foreground mr-1" />
                  </div>
                  <Input 
                    type="number" 
                    min="1"
                    placeholder="Passengers" 
                    className="pl-10 h-14 bg-muted/30 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary font-medium rounded-xl"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="h-14 px-8 bg-accent hover:bg-accent-dark text-accent-foreground rounded-xl shadow-lg shadow-accent/20 font-display font-semibold tracking-wide md:w-auto w-full">
                <Search className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Search Route</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold tracking-tight">Available Buses</h2>
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-dashed h-9">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredBuses.length === 0 ? (
              <Card className="bg-white border-dashed text-center py-20 rounded-2xl">
                <BusIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No buses found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">We couldn't find any buses matching your search criteria. Try adjusting your dates or destinations.</p>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredBuses.map((bus) => (
                  <Card key={bus.id} className="overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all duration-300 border-border/60 bg-white group rounded-2xl flex flex-col md:flex-row">
                    <div className="md:w-[280px] h-48 md:h-auto shrink-0 relative overflow-hidden bg-muted">
                      {bus.images?.[0] ? (
                        <img 
                          src={bus.images[0]} 
                          alt={bus.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BusIcon className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-white/95 backdrop-blur-sm text-zinc-900 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                          {bus.bus_type}
                        </span>
                        <span className="bg-primary/95 backdrop-blur-sm text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                          {bus.ac_type === 'ac' ? 'AC' : 'Non-AC'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                        <div>
                          <h3 className="text-2xl font-display font-bold mb-1 text-zinc-900">{bus.name}</h3>
                          <p className="text-muted-foreground font-medium text-sm flex items-center">
                            Operated by {bus.operator_name || 'Verified Partner'}
                            <span className="inline-flex ml-2 items-center justify-center bg-green-100 text-green-700 h-4 w-4 rounded-full text-[10px]">✓</span>
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-3xl font-display font-bold text-primary">₹{bus.base_fare || 1500}</p>
                          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Per Seat</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-zinc-100">
                        <div>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Seats Available</p>
                          <p className="font-medium text-sm">{bus.seating_capacity} seats</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Model</p>
                          <p className="font-medium text-sm">{bus.model_name || 'Standard'}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 mt-auto justify-end">
                        <Link href={`/bus/${bus.id}`}>
                          <Button variant="outline" className="w-full sm:w-auto font-semibold border-zinc-300 rounded-xl h-12 px-6">
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/bus/${bus.id}?book=true`}>
                          <Button className="w-full sm:w-auto bg-zinc-900 hover:bg-black text-white font-semibold shadow-lg shadow-black/10 rounded-xl h-12 px-10">
                            Select Seats
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-border">
            <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-zinc-700">Ready to travel?</h3>
            <p className="text-muted-foreground/80 max-w-sm mx-auto font-medium">Enter your travel details above to find the best verified operators and deals.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function BusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6v6" />
      <path d="M15 6v6" />
      <path d="M2 12h19.6" />
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
      <circle cx="7" cy="18" r="2" />
      <path d="M9 18h5" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  )
}
