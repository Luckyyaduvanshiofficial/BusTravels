// Review types - Matches Supabase public.reviews table
export interface BusReview {
  id: string;
  booking_id: string;
  customer_id: string;
  bus_id: string;

  // Rating (1-5)
  rating: number;

  // Content
  comment?: string;

  // Status
  is_approved: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
}

// Flattened review for display (with joined customer data)
export interface ReviewWithCustomer extends BusReview {
  customer_name: string;
  customer_avatar?: string;
}
