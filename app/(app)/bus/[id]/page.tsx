import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/BookingForm'
import { Users, Snowflake } from 'lucide-react'

interface BusPageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function BusPage({ params }: Readonly<BusPageProps>) {
  const { id } = await params
  if (!id) {
    notFound()
  }

  const supabase = await createClient()
  const { data: bus, error } = await supabase
    .from('buses')
    .select(`
      *,
      operator:users!buses_operator_id_f54c6fdd_fk_users_id(name, email)
    `)
    .eq('id', id)
    .single()

  if (error || !bus) {
    console.error('Failed to fetch bus:', error)
    notFound()
  }

  const acLabel = bus.ac_type === 'ac' ? 'AC' : 'Non-AC'
  const busTypeLabel = (bus.bus_type || '').replaceAll('_', ' ')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bus Details */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* Image */}
            <div className="relative aspect-[16/9] bg-muted">
              {bus.images?.[0] ? (
                <Image
                  src={bus.images[0]}
                  alt={bus.name || bus.model_name || "Bus Image"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground bg-muted">
                  No image available
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-display font-bold text-foreground mb-1 tracking-tight">
                    {bus.name || bus.model_name}
                  </h1>
                  <p className="text-muted-foreground font-medium">{bus.model_name} • {busTypeLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">Starting from</p>
                  <p className="text-3xl font-display font-bold text-accent">
                    ₹{(bus.base_fare || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border border-border">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">{bus.seating_capacity} seats</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border border-border">
                  <Snowflake className="h-5 w-5 text-muted-foreground" />
                   <span className="text-sm font-semibold text-foreground">{acLabel}</span>
                </div>
              </div>

              {/* Operator Info */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Operator</h3>
                <p className="font-display font-medium text-lg text-foreground">
                  {bus.operator?.name || bus.operator?.email || 'Assigned Operator'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingForm busId={bus.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
