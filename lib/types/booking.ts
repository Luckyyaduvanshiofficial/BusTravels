// Booking types - Matches Supabase public.booking_requests table
export interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  bus_id: string;

  // Trip details
  trip_type: string;
  pickup_location: string;
  pickup_city: string;
  drop_location: string;
  drop_city: string;
  trip_date: string;
  return_date?: string;
  pickup_time?: string;
  estimated_distance: number;
  estimated_duration: number;
  passenger_count: number;
  special_requests?: string;

  // Customer info snapshot
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  alternate_phone?: string;

  // Pricing breakdown
  base_amount: number;
  per_km_amount: number;
  driver_allowance: number;
  night_charges: number;
  toll_estimate: number;
  gst_amount: number;
  discount_amount: number;
  total_amount: number;

  // Commission
  commission_rate: number;
  commission_amount: number;
  operator_payout: number;

  // Payment
  payment_mode: string;
  payment_status: 'pending' | 'advance_paid' | 'fully_paid' | 'refund_pending' | 'refund_failed' | 'refunded';
  amount_paid: number;
  amount_due: number;
  payment_gateway_order_id?: string;

  // Status
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled_by_customer' | 'cancelled_by_operator' | 'expired';
  operator_response_at?: string;
  rejection_reason?: string;

  // Cancellation
  cancelled_at?: string;
  cancellation_reason?: string;
  cancelled_by_id?: string;

  // Refund
  refund_status?: string;
  refund_amount: number;

  // Completion
  completed_at?: string;

  // Notes
  notes?: string;
  operator_notes?: string;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type TripType = 'one_way' | 'round_trip' | 'multi_day';

export type Purpose = 'wedding' | 'religious' | 'family_trip' | 'corporate' | 'school_tour' | 'other';

export type PaymentMode = 'full_online' | 'advance' | 'pay_to_driver';

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'expired' | 'payment_failed';

export interface TripDetailsForm {
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  returnDate: string | null;
  pickupTime: string;
  tripType: TripType;
  passengers: number;
  purpose: Purpose;
  specialRequests: string;
}

export interface PriceCalculationRequest {
  bus_id: string;
  pickup_location: string;
  drop_location: string;
  trip_date: string;
  return_date: string | null;
  pickup_time?: string;
  trip_type: TripType;
  passenger_count: number;
}

export interface PriceBreakdownItem {
  base_amount: number;
  km_charges: number;
  driver_allowance: number;
  night_charges: number;
  toll_estimate: number;
  gst_amount: number;
}

export interface PriceCalculationResponse {
  bus_id: string;
  bus_name: string;
  base_amount: number;
  distance_km: number;
  per_km_amount: number;
  driver_allowance: number;
  night_charges: number;
  toll_estimate: number;
  gst_amount: number;
  discount_amount: number;
  total_amount: number;
  breakdown: PriceBreakdownItem;
}

export interface CreateBookingRequest {
  bus: string;
  pickup_location: string;
  pickup_city?: string;
  drop_location: string;
  drop_city?: string;
  trip_date: string;
  return_date: string | null;
  pickup_time?: string;
  trip_type: TripType;
  passenger_count: number;
  special_requests?: string;
  payment_mode: PaymentMode;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  alternate_phone?: string;
  notes?: string;
}

export interface BookingBus {
  id: string;
  name: string;
  model_name: string;
  bus_type: string;
  seating_capacity: number;
  ac_type: string;
  base_fare: number;
  images: string[];
}

export interface BookingOperator {
  id: string;
  company_name: string;
  is_verified: boolean;
}

export interface BookingDetail {
  id: string;
  booking_number: string;
  status: BookingStatus;
  bus: BookingBus;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pickup_location: string;
  pickup_city: string;
  drop_location: string;
  drop_city: string;
  trip_date: string;
  pickup_time: string;
  return_date: string | null;
  trip_type: TripType;
  passenger_count: number;
  special_requests: string;
  total_amount: number;
  base_amount: number;
  payment_mode: PaymentMode;
  payment_status: string;
  rejection_reason: string | null;
  notes: string | null;
  operator_notes: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface PaymentInitiation {
  payment_session_id: string;
  payment_url: string;
  amount: number;
}

export interface CouponValidation {
  valid: boolean;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  message: string;
}

export interface BookingFlowState {
  currentStep: number;
  busId: number | null;
  tripDetails: TripDetailsForm | null;
  priceCalculation: PriceCalculationResponse | null;
  selectedPaymentMode: PaymentMode | null;
  couponCode: string;
  couponDiscount: number;
  termsAccepted: boolean;
}
