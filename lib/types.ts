export type UserRole = 'customer' | 'operator' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  is_verified: boolean
  commission_rate?: number
}

export interface DriverProfile {
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
  driver_name?: string
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

export interface BookingFormData {
  bus: string
  pickup_location: string
  drop_location: string
  trip_date: string
  passenger_count: number
  customer_phone: string
}

export interface BusFormData {
  name: string
  model: string
  bus_type: string
  seating_capacity: number
  ac_type: 'ac' | 'non_ac'
  base_amount: number
  images: string[]
}
