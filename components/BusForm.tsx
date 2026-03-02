'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createBus, updateBus } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { Bus } from '@/lib/types'

interface BusFormProps {
  bus?: Bus
}

export function BusForm({ bus }: Readonly<BusFormProps>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: bus?.name || '',
    model_name: bus?.model_name || '',
    bus_type: bus?.bus_type || 'mini_bus',
    seating_capacity: bus?.seating_capacity?.toString() || '',
    ac_type: bus?.ac_type || 'ac',
    base_fare: bus?.base_fare?.toString() || '',
    images: bus?.images?.join(', ') || '',
  })

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/operator/login')
        return
      }

      const busData = {
        name: formData.name,
        model_name: formData.model_name,
        bus_type: formData.bus_type,
        seating_capacity: Number.parseInt(formData.seating_capacity),
        ac_type: formData.ac_type,
        base_fare: Number.parseFloat(formData.base_fare),
        images: formData.images ? formData.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
      }

      if (bus) {
        await updateBus(bus.id, busData)
      } else {
        await createBus(busData)
      }

      router.push('/operator/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save bus')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{bus ? 'Edit Bus' : 'Add New Bus'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bus Name</Label>
              <Input
                id="name"
                placeholder="e.g., Deluxe Coach"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model_name">Model</Label>
              <Input
                id="model_name"
                placeholder="e.g., Volvo 9600"
                value={formData.model_name}
                onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bus_type">Bus Type</Label>
              <Select
                value={formData.bus_type}
                onValueChange={(value) => setFormData({ ...formData, bus_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mini_bus">Mini Bus</SelectItem>
                  <SelectItem value="medium_bus">Medium Bus</SelectItem>
                  <SelectItem value="luxury_coach">Luxury Coach</SelectItem>
                  <SelectItem value="tempo_traveller">Tempo Traveller</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ac_type">AC Type</Label>
              <Select
                value={formData.ac_type}
                onValueChange={(value) => setFormData({ ...formData, ac_type: value as 'ac' | 'non_ac' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ac">AC</SelectItem>
                  <SelectItem value="non_ac">Non-AC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seating_capacity">Seating Capacity</Label>
              <Input
                id="seating_capacity"
                type="number"
                min="1"
                placeholder="e.g., 45"
                value={formData.seating_capacity}
                onChange={(e) => setFormData({ ...formData, seating_capacity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_fare">Base Fare (₹)</Label>
              <Input
                id="base_fare"
                type="number"
                min="0"
                placeholder="e.g., 5000"
                value={formData.base_fare}
                onChange={(e) => setFormData({ ...formData, base_fare: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Image URLs (comma separated)</Label>
            <Input
              id="images"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            />
            <p className="text-xs text-zinc-500">Separate multiple URLs with commas</p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800" disabled={loading}>
              {loading ? 'Saving...' : null}
              {!loading && bus ? 'Update Bus' : null}
              {!loading && !bus ? 'Add Bus' : null}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
