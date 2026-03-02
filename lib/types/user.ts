// User types - Matches Supabase public.users table
export interface User {
  id: string;
  supabase_uid?: string;
  phone: string;
  name?: string;
  email?: string;
  role: 'customer' | 'operator' | 'admin';
  avatar_url?: string;

  // Operator-specific fields
  company_name?: string;
  company_logo?: string;
  company_description?: string;
  gst_number?: string;
  pan_number?: string;

  // Bank details
  bank_name?: string;
  bank_account?: string;
  bank_ifsc?: string;
  upi_id?: string;

  // Address
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  // Verification
  is_verified: boolean;
  verified_at?: string;
  verified_by_id?: string;
  rejection_reason?: string;

  // Profile
  profile_completion: number;
  is_new: boolean;
  new_badge_expires_at?: string;

  // Commission & earnings
  commission_rate: number;
  total_earnings: number;

  // Stats
  rating_avg: number;
  rating_count: number;
  total_bookings: number;

  // Metadata
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Document {
  id: string;
  user_id: string;
  document_type: 'aadhar' | 'pan' | 'driving_license' | 'rc_book' | 'insurance' | 'permit' | 'fitness' | 'pollution' | 'gst' | 'other';
  document_number?: string;
  document_url: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  expiry_date?: string;
  uploaded_at: string;
  verified_at?: string;
  verified_by?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  notification_type: 'booking_confirmed' | 'payment_received' | 'review_added' | 'document_verified' | 'bus_approved' | 'general' | 'booking_cancelled' | 'booking_rejected' | 'payout_sent';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}
