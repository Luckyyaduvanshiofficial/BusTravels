// Payment types - Mirror Django Payment model
export interface Payment {
  id: string;
  booking: string;
  payment_type: 'advance' | 'full' | 'remaining';
  payment_method: 'cashfree' | 'razorpay' | 'cash' | 'bank_transfer';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  
  // Gateway details
  gateway_payment_id?: string;
  gateway_order_id?: string;
  gateway_signature?: string;
  
  // Failure & refund
  failure_reason?: string;
  refund_id?: string;
  refund_amount?: number;
  refund_status?: 'initiated' | 'processed' | 'failed';
  
  // Idempotency
  idempotency_key: string;
  
  // Metadata
  payment_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  paid_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_booking_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  description?: string;
  terms?: string;
  created_by?: string;
  created_at: string;
}

export interface CouponUsage {
  id: string;
  coupon: string;
  user: string;
  booking: string;
  discount_amount: number;
  used_at: string;
}
