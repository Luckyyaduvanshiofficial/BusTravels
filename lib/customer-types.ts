// ============================================================
// Customer App Types
// ============================================================

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface CustomerBooking {
  id: string
  booking_number: string
  pickup_location: string
  drop_location: string
  trip_date: string           // ISO date string
  trip_time?: string          // "08:00 AM" – undefined when API provides no time
  passenger_count: number
  status: BookingStatus
  vehicle_name: string
  vehicle_type: string
  vehicle_image?: string
  vehicle_registration?: string
  vehicle_amenities?: string[]
  driver_name?: string
  driver_rating?: number
  driver_trips?: number
  driver_phone?: string       // revealed 2h before trip
  driver_since?: string
  base_price: number
  distance_charge?: number
  discount?: number
  total_amount: number
  payment_method?: string
  payment_status: 'paid' | 'pending' | 'refunded'
  customer_notes?: string
  created_at: string
  contacted_at?: string
  paid_at?: string
  driver_accepted_at?: string
  trip_type?: 'one_way' | 'round_trip'
  customer_rating?: number
  customer_review?: string
}

export interface CustomerProfile {
  id: string
  full_name: string
  phone: string
  email?: string
  avatar_url?: string
  date_of_birth?: string
  city?: string
  preferred_language?: 'hindi' | 'english' | 'both'
  notifications_sms: boolean
  notifications_email: boolean
  notifications_push: boolean
  default_passengers?: number
  member_since: string
  total_trips?: number
  loyalty_points?: number
}

export interface RewardTier {
  name: string
  points_required: number
  reward_description: string
  reward_value: string
  is_unlocked: boolean
}

export interface Transaction {
  id: string
  booking_id?: string
  booking_number?: string
  amount: number
  type: 'payment' | 'refund' | 'wallet_credit' | 'wallet_debit'
  status: 'success' | 'pending' | 'failed'
  method?: string
  created_at: string
}

export interface PaymentMethod {
  id: string
  type: 'upi' | 'card' | 'netbanking' | 'wallet'
  label: string
  is_default?: boolean
  masked_details: string
}

export const STATUS_CONFIG: Record<BookingStatus, {
  label: string
  color: string
  bgColor: string
  icon: string
}> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: '⏳',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: '✅',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: '❌',
  },
  completed: {
    label: 'Completed',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: '🎉',
  },
}
