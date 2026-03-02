import { createClient } from '@/lib/supabase/client'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const supabase = createClient()
  // Use getSession() for client-side token retrieval (display purposes only).
  // The server-side API routes validate via getUser() independently.
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(session?.access_token && {
      Authorization: `Bearer ${session.access_token}`,
    }),
    ...options.headers,
  }

  const url = endpoint.startsWith('/api/')
    ? endpoint // Already a full Next.js API route
    : `${API_BASE}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || error.error || `API Error: ${response.status}`)
  }

  const data = await response.json()
  
  // Handle DRF pagination seamlessly
  if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
    return data.results as T
  }
  
  return data
}

// Types
export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: 'customer' | 'operator' | 'admin'
  is_verified: boolean
  commission_rate?: number
}

export interface OperatorProfile {
  id: string
  user: User
  license_number: string
  rc_number: string
  is_verified: boolean
}

export interface Bus {
  id: string
  operator: string
  operator_name?: string
  name: string
  model_name?: string | null
  bus_type: string
  seating_capacity: number
  ac_type: 'ac' | 'non_ac'
  base_fare: number
  images: string[]
  is_active?: boolean
}

export interface BookingRequest {
  id: string
  booking_number?: string
  customer: string
  customer_name?: string
  bus: string
  bus_details?: Bus
  pickup_location: string
  drop_location: string
  trip_date: string
  passenger_count: number
  customer_phone: string
  status: 'pending' | 'contacted' | 'completed'
  commission_amount?: number
  notes?: string | null
  created_at: string
}

// Auth
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, role: 'customer' | 'operator') {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  
  // Get role from user metadata
  const role = user.user_metadata?.role as 'customer' | 'operator' | 'admin' | undefined
  
  // Fetch full user from our API route
  try {
    const response = await fetch('/api/auth/user')
    if (response.ok) {
      return await response.json()
    }
  } catch {
    // Fallback to Supabase metadata
  }
  
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name || '',
    phone: user.user_metadata?.phone || '',
    role: role || 'customer',
    is_verified: false,
  }
}

// Buses
export async function getBuses(): Promise<Bus[]> {
  return fetchApi<Bus[]>('/api/buses')
}

export async function getMyBuses(): Promise<Bus[]> {
  return fetchApi<Bus[]>('/api/buses?mine=1')
}

export async function getBus(id: string): Promise<Bus> {
  return fetchApi<Bus>(`/api/buses/${id}`)
}

export async function createBus(data: Partial<Bus>): Promise<Bus> {
  return fetchApi<Bus>('/api/buses', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateBus(id: string, data: Partial<Bus>): Promise<Bus> {
  return fetchApi<Bus>(`/api/buses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteBus(id: string): Promise<void> {
  await fetchApi(`/api/buses/${id}`, { method: 'DELETE' })
}

// Booking Requests
export async function getBookingRequests(): Promise<BookingRequest[]> {
  return fetchApi<BookingRequest[]>('/api/bookings')
}

export async function getMyBookingRequests(): Promise<BookingRequest[]> {
  return fetchApi<BookingRequest[]>('/api/bookings?mine=1')
}

export async function getOperatorBookingRequests(): Promise<BookingRequest[]> {
  return fetchApi<BookingRequest[]>('/api/bookings?operator=1')
}

export async function createBookingRequest(data: {
  bus: string
  pickup_location: string
  drop_location: string
  trip_date: string
  passenger_count: number
  customer_phone: string
}): Promise<BookingRequest> {
  return fetchApi<BookingRequest>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Operator Profile
export async function completeOperatorProfile(data: {
  license_number: string
  rc_number: string
}): Promise<User> {
  return fetchApi<User>('/api/operator/complete-profile', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Admin
export async function verifyOperator(userId: string | number): Promise<User> {
  return fetchApi<User>(`/api/admin/operators/${userId}/verify`, {
    method: 'POST',
  })
}

export async function getUnverifiedOperators(): Promise<User[]> {
  return fetchApi<User[]>('/api/admin/operators?unverified=1')
}

export async function getAllOperators(): Promise<User[]> {
  return fetchApi<User[]>('/api/admin/operators?role=operator')
}
