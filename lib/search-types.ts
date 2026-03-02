/**
 * Extended types for Charter Bus Rental Platform
 * Covers: Search, Results, Seat Selection, Booking, Vehicle Detail
 */

// ─── Existing types (kept from lib/types.ts) ─────────────────────────────

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

// ─── Search ────────────────────────────────────────────────────────────────

export interface SearchParams {
  from: string
  to: string
  date: string          // ISO date string YYYY-MM-DD
  passengers: number
}

export type VehicleTypeFilter =
  | 'all'
  | 'ac_sleeper'
  | 'non_ac_sleeper'
  | 'seater'
  | 'luxury'

export type DepartureTimeFilter =
  | 'morning'    // 06:00 – 11:59
  | 'afternoon'  // 12:00 – 17:59
  | 'evening'    // 18:00 – 21:59
  | 'night'      // 22:00 – 05:59

export interface BusFilters {
  vehicleTypes: VehicleTypeFilter[]
  priceRange: [number, number]     // [min, max] in ₹
  departureTimes: DepartureTimeFilter[]
  amenities: string[]
  minRating: number
}

export const DEFAULT_FILTERS: BusFilters = {
  vehicleTypes: [],
  priceRange: [500, 5000],
  departureTimes: [],
  amenities: [],
  minRating: 0,
}

// ─── Results / Bus Listing ─────────────────────────────────────────────────

export type SortOption = 'price_asc' | 'price_desc' | 'rating_desc' | 'duration_asc'

export interface BusRoute {
  id: string
  busId: string
  busName: string
  busType: string             // 'AC Sleeper' | 'Non-AC Sleeper' | 'Seater' | 'Luxury'
  operatorName: string
  operatorVerified: boolean
  fromCity: string
  toCity: string
  departureTime: string       // '22:00'
  arrivalTime: string         // '04:00'
  durationHours: number       // 6
  pricePerSeat: number        // 850
  totalSeats: number
  availableSeats: number
  rating: number              // 4.5
  reviewCount: number
  amenities: string[]
  images: string[]
  deckType: 'single' | 'double'
}

// ─── Popular Routes ────────────────────────────────────────────────────────

export interface PopularRoute {
  id: string
  from: string
  to: string
  startingPrice: number
  imageUrl: string
}

// ─── Seat Selection ────────────────────────────────────────────────────────

export type SeatStatus = 'available' | 'booked' | 'selected' | 'ladies'

export interface Seat {
  id: string
  number: string        // 'U12', 'L05' etc.
  deck: 'upper' | 'lower'
  row: number
  col: number
  status: SeatStatus
  price: number
}

export interface SeatLayout {
  upperDeck: Seat[][]      // rows × cols
  lowerDeck: Seat[][]
  seatsPerRow: [number, number]  // [left, right] split e.g. [2, 1]
}

// ─── Booking ───────────────────────────────────────────────────────────────

export interface PassengerDetail {
  seatId: string
  seatNumber: string
  name: string
  age: string
  gender: 'male' | 'female' | 'other'
}

export interface BookingContact {
  email: string
  phone: string
}

export interface BoardingPoint {
  id: string
  name: string
  time: string
  address: string
}

export interface FareBreakdown {
  baseFare: number
  tax: number
  serviceFee: number
  total: number
}

export interface BookingSession {
  route: BusRoute | null
  selectedSeats: Seat[]
  passengers: PassengerDetail[]
  contact: BookingContact
  boardingPoint: BoardingPoint | null
  fareBreakdown: FareBreakdown
}

// ─── Reviews ───────────────────────────────────────────────────────────────

export interface Review {
  id: string
  authorName: string
  rating: number
  title: string
  body: string
  travelDate: string
  verified: boolean
  createdAt: string
}

// ─── Vehicle Detail ────────────────────────────────────────────────────────

export interface VehicleDetail extends BusRoute {
  description: string
  totalReviews: number
  overallRating: number
  allAmenities: { icon: string; label: string }[]
  boardingPoints: BoardingPoint[]
  droppingPoints: BoardingPoint[]
  restStops: { time: string; name: string; duration: number }[]
  cancellationPolicy: string[]
  reviews: Review[]
}

// ─── Utility ──────────────────────────────────────────────────────────────

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
