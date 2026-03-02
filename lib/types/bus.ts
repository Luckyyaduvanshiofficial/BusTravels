/**
 * BusBook Bus Types
 * 
 * TypeScript interfaces matching the Supabase public.buses table.
 */

// Bus list response from search endpoint
export interface Bus {
  id: string;
  name: string;
  bus_type: string;
  seating_capacity: number;
  ac_type: 'ac' | 'non_ac' | 'partial_ac';
  per_km_rate: number;
  base_fare: number;
  home_city: string;
  rating_avg: number;
  rating_count: number;
  operator_name: string;
  thumbnail_url: string | null;
  amenities: string[] | Record<string, boolean>;
  is_active: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
}

export interface SearchFilters {
  from_location: string;
  to_location: string;
  date: string;
  passengers: number;
}

export interface BusPhoto {
  id: number;
  photo_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface BusAmenity {
  id: number;
  name: string;
  icon: string;
}

export interface BusOperator {
  id: string;
  company_name: string;
  is_verified: boolean;
  rating_avg: number;
  total_trips: number;
  created_at: string;
  city: string;
  phone?: string;
}

export interface BusDetail {
  id: string;
  name: string;
  description: string;
  registration_number: string;
  bus_type: string;
  model_name: string;
  manufacture_year: number;
  seating_capacity: number;
  ac_type: 'ac' | 'non_ac' | 'partial_ac';
  per_km_rate: number;
  base_fare: number;
  driver_allowance: number;
  night_charges: number;
  home_city: string;
  home_state: string;
  operating_routes: Record<string, unknown>[];
  insurance_expiry?: string;
  permit_expiry?: string;
  fitness_expiry?: string;
  pollution_expiry?: string;
  thumbnail_url: string | null;
  images: Record<string, unknown>[];
  amenities: Record<string, boolean> | string[];
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  rejection_reason?: string;
  is_active: boolean;
  is_available: boolean;
  rating_avg: number;
  rating_count: number;
  total_bookings: number;
  total_earnings: number;
  total_trips: number;
  total_km: number;
  operator_id: string;
  approved_by_id?: string;
  operator?: BusOperator;
  photos?: BusPhoto[];
  reviews?: BusReview[];
  created_at: string;
  updated_at: string;
}

export interface BusReview {
  id: number;
  customer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
  photos: string[];
}

// Bus type display labels
export const BUS_TYPE_LABELS: Record<string, string> = {
  luxury_coach: 'Luxury Coach',
  standard: 'Standard Bus',
  mini_bus: 'Mini Bus',
  volvo: 'Volvo',
  sleeper: 'Sleeper Bus',
  tempo_traveller: 'Tempo Traveller',
  ac_seater: 'AC Seater',
  non_ac_seater: 'Non-AC Seater',
};

// AC type display labels
export const AC_TYPE_LABELS: Record<string, string> = {
  ac: 'AC',
  non_ac: 'Non AC',
  partial_ac: 'Partial AC',
};