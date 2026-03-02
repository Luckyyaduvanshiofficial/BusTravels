'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getBus } from '@/lib/api'
import { BusForm } from '@/components/BusForm'
import type { Bus } from '@/lib/types'

interface EditBusPageProps {
  params: Promise<{ id: string }>
}

export default function EditBusPage({ params }: EditBusPageProps) {
  const [bus, setBus] = useState<Bus | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadBus() {
      const { id: busIdStr } = await params
      if (!busIdStr) {
        notFound()
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/operator/login')
        return
      }

      const role = user.user_metadata?.role
      if (role !== 'operator') {
        router.push('/')
        return
      }

      try {
        const busData = await getBus(busIdStr)
        setBus(busData)
      } catch (error) {
        console.error('Failed to fetch bus:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadBus()
  }, [params, supabase, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto animate-pulse">
          <div className="h-8 bg-zinc-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-zinc-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/operator/dashboard')}
          className="text-sm text-zinc-500 hover:text-zinc-700 mb-4"
        >
          ← Back to My Buses
        </button>
        {bus && <BusForm bus={bus} />}
      </div>
    </div>
  )
}
