# 🏗️ BUS BOOKING PLATFORM — SYSTEM ARCHITECTURE & DESIGN

**Version:** 1.0  
**Date:** March 1, 2026  
**Status:** Ready to Build

---

## 📊 ARCHITECTURE OVERVIEW

### Tech Stack Summary

```
┌─────────────────────────────────────────────┐
│           CLIENT LAYER (Browser)            │
│  • Next.js 14 PWA (Customer/Driver/Admin)   │
│  • Tailwind CSS + Shadcn UI                 │
│  • TypeScript                               │
└──────────────────┬──────────────────────────┘
                   │ HTTPS/REST
┌──────────────────▼──────────────────────────┐
│        APPLICATION LAYER (Vercel)           │
│  • Next.js API Routes (/api/*)              │
│  • Server Components (SSR)                  │
│  • Middleware (Auth Check)                  │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
┌───────▼────┐ ┌──▼─────┐ ┌─▼─────────┐
│  Supabase  │ │Cashfree│ │   MSG91   │
│    Cloud   │ │Payment │ │    SMS    │
│            │ │        │ │           │
│• Postgres  │ │• Orders│ │• OTP      │
│• Auth      │ │• Webhook│ │• Notif   │
│• Storage   │ └────────┘ └───────────┘
│• Realtime  │
└────────────┘
```

---

## 🗂️ DATABASE ARCHITECTURE

### Table Structure & Relationships

```
profiles (1) ──────── (*) vehicles
   │                        │
   │                        │
   │ (1)                (*) │
   │                        │
   └──────── bookings ──────┘
              │
              │ (1)
              │
              ▼ (0..1)
           payments
              │
              │ (1)
              │
              ▼ (0..1)
           reviews
```

### Core Tables

#### 1. `profiles` (User Management)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('customer', 'driver', 'admin')),
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_phone ON profiles(phone_number);
```

**Purpose:** Extends Supabase Auth with custom user data  
**Access Control:** Users can only read/update their own profile  

---

#### 2. `vehicles` (Vehicle Inventory)

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Vehicle Info
  vehicle_type TEXT NOT NULL CHECK (
    vehicle_type IN ('tavera', 'innova', 'tempo_traveller', 'mini_bus', 'volvo_bus')
  ),
  vehicle_name TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  seating_capacity INTEGER NOT NULL CHECK (seating_capacity > 0),
  
  -- Features
  amenities JSONB DEFAULT '[]'::jsonb,
  -- Example: ["AC", "Music System", "Pushback Seats", "WiFi"]
  
  -- Pricing
  base_price_per_day DECIMAL(10,2) NOT NULL CHECK (base_price_per_day > 0),
  price_per_km DECIMAL(10,2) NOT NULL CHECK (price_per_km > 0),
  
  -- Media
  photos JSONB DEFAULT '[]'::jsonb,
  -- Example: ["url1", "url2", ...]
  
  -- Status
  is_approved BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Operating Area
  operating_cities JSONB DEFAULT '["Jaipur"]'::jsonb,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_vehicles_driver ON vehicles(driver_id);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX idx_vehicles_approved ON vehicles(is_approved, is_active);
CREATE INDEX idx_vehicles_cities ON vehicles USING GIN (operating_cities);
```

**Purpose:** Store all vehicle details and pricing  
**Access Control:**  

- Public: Read approved & active vehicles only  
- Drivers: Full CRUD on own vehicles  
- Admin: Full CRUD on all vehicles  

---

#### 3. `bookings` (Booking Management)

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL DEFAULT ('BUS' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0')),
  
  -- Parties
  customer_id UUID REFERENCES profiles(id),
  driver_id UUID REFERENCES profiles(id),
  vehicle_id UUID REFERENCES vehicles(id),
  
  -- Trip Details
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT,
  pickup_datetime TIMESTAMP NOT NULL,
  return_datetime TIMESTAMP,
  trip_type TEXT CHECK (trip_type IN ('one_way', 'round_trip', 'multi_day')),
  passenger_count INTEGER,
  
  -- Price Negotiation
  customer_offer_price DECIMAL(10,2),
  driver_counter_price DECIMAL(10,2),
  final_agreed_price DECIMAL(10,2),
  
  -- Status (See State Machine diagram)
  status TEXT NOT NULL DEFAULT 'pending_driver_response' CHECK (
    status IN (
      'pending_driver_response',
      'driver_countered',
      'accepted',
      'rejected',
      'customer_cancelled',
      'trip_ongoing',
      'completed',
      'customer_paid'
    )
  ),
  
  -- Payment
  payment_method TEXT CHECK (payment_method IN ('cash', 'online')),
  payment_status TEXT DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'refunded')
  ),
  
  -- Contact Reveal
  driver_contact_revealed BOOLEAN DEFAULT FALSE,
  contact_revealed_at TIMESTAMP,
  
  -- Notes
  customer_notes TEXT,
  driver_notes TEXT,
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Constraints
  CHECK (pickup_datetime < return_datetime OR return_datetime IS NULL),
  CHECK (final_agreed_price > 0 OR final_agreed_price IS NULL)
);

-- Indexes
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_driver ON bookings(driver_id);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_pickup_date ON bookings(pickup_datetime);
CREATE INDEX idx_bookings_code ON bookings(booking_code);

-- Function to auto-generate booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_code := 'BUS' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_code
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION generate_booking_code();
```

**Purpose:** Core booking lifecycle management  
**Key Features:**  

- Price negotiation support (offer → counter → accept)  
- Delayed driver contact reveal (2hr before trip)  
- Complete status tracking  

---

#### 4. `payments` (Payment Records)


```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  
  -- Cashfree Integration
  cashfree_order_id TEXT UNIQUE,
  cashfree_payment_id TEXT,
  payment_session_id TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'success', 'failed', 'refunded')
  ),
  
  -- Metadata
  payment_method TEXT,
  utr_number TEXT,
  bank_reference TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_cashfree_order ON payments(cashfree_order_id);
CREATE INDEX idx_payments_status ON payments(status);
```

**Purpose:** Track all payment transactions  
**Integration:** Cashfree webhook updates this table  

---

#### 5. `reviews` (Customer Feedback - v2)

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  customer_id UUID REFERENCES profiles(id),
  driver_id UUID REFERENCES profiles(id),
  vehicle_id UUID REFERENCES vehicles(id),
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(booking_id) -- One review per booking
);

-- Indexes
CREATE INDEX idx_reviews_driver ON reviews(driver_id);
CREATE INDEX idx_reviews_vehicle ON reviews(vehicle_id);
```

---

## 🔐 ROW LEVEL SECURITY (RLS) POLICIES

### Global Security Setup

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

### Profile Policies

```sql
-- Users can view their own profile
CREATE POLICY "view_own_profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "admin_view_all_profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Vehicle Policies

```sql
-- Anyone can view approved vehicles
CREATE POLICY "public_view_approved_vehicles"
ON vehicles FOR SELECT
USING (is_approved = TRUE AND is_active = TRUE);

-- Drivers can manage their own vehicles
CREATE POLICY "driver_manage_own_vehicles"
ON vehicles FOR ALL
USING (auth.uid() = driver_id);

-- Admins can manage all vehicles
CREATE POLICY "admin_manage_all_vehicles"
ON vehicles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Booking Policies

```sql
-- Customers can view their own bookings
CREATE POLICY "customer_view_own_bookings"
ON bookings FOR SELECT
USING (auth.uid() = customer_id);

-- Drivers can view bookings for their vehicles
CREATE POLICY "driver_view_assigned_bookings"
ON bookings FOR SELECT
USING (auth.uid() = driver_id);

-- Customers can create bookings
CREATE POLICY "customer_create_booking"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = customer_id);

-- Drivers can update booking status
CREATE POLICY "driver_update_booking"
ON bookings FOR UPDATE
USING (auth.uid() = driver_id)
WITH CHECK (auth.uid() = driver_id);

-- Admins can view all bookings
CREATE POLICY "admin_view_all_bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Payment Policies

```sql
-- Users can view payments for their bookings
CREATE POLICY "view_own_booking_payments"
ON payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = payments.booking_id
    AND (bookings.customer_id = auth.uid() OR bookings.driver_id = auth.uid())
  )
);

-- Only backend can insert payments (via service role)
-- No INSERT policy for regular users
```

---

## 🎨 FRONTEND ARCHITECTURE

### Next.js 14 App Router Structure

```
src/
├── app/
│   ├── layout.tsx                   # Root layout (global)
│   ├── page.tsx                     # Landing page
│   │
│   ├── (public)/                    # Public route group
│   │   ├── search/
│   │   │   └── page.tsx             # Search results
│   │   └── vehicle/
│   │       └── [id]/
│   │           └── page.tsx         # Vehicle details
│   │
│   ├── (auth)/                      # Auth route group
│   │   ├── layout.tsx               # Auth layout
│   │   ├── login/
│   │   │   └── page.tsx             # Phone OTP login
│   │   └── register/
│   │       └── page.tsx             # Role selection
│   │
│   ├── (customer)/                  # Customer portal
│   │   ├── layout.tsx               # Customer layout + nav
│   │   └── dashboard/
│   │       ├── page.tsx             # My bookings
│   │       ├── bookings/
│   │       │   └── [id]/
│   │       │       └── page.tsx     # Booking details
│   │       ├── checkout/
│   │       │   └── [id]/
│   │       │       └── page.tsx     # Payment page
│   │       └── profile/
│   │           └── page.tsx         # Profile settings
│   │
│   ├── (driver)/                    # Driver portal
│   │   ├── layout.tsx               # Driver layout + nav
│   │   └── dashboard/
│   │       ├── page.tsx             # Booking requests
│   │       ├── vehicles/
│   │       │   ├── page.tsx         # My vehicles
│   │       │   ├── add/
│   │       │   │   └── page.tsx     # Add vehicle
│   │       │   └── [id]/
│   │       │       └── edit/
│   │       │           └── page.tsx # Edit vehicle
│   │       ├── bookings/
│   │       │   └── page.tsx         # All bookings
│   │       ├── earnings/
│   │       │   └── page.tsx         # Payment history
│   │       └── profile/
│   │           └── page.tsx         # Profile settings
│   │
│   ├── (admin)/                     # Admin portal
│   │   ├── layout.tsx               # Admin layout + nav
│   │   └── dashboard/
│   │       ├── page.tsx             # Stats overview
│   │       ├── drivers/
│   │       │   └── page.tsx         # Driver approvals
│   │       ├── vehicles/
│   │       │   └── page.tsx         # Vehicle approvals
│   │       ├── bookings/
│   │       │   └── page.tsx         # All bookings
│   │       └── reports/
│   │           └── page.tsx         # Analytics
│   │
│   └── api/                         # API Routes (see API section)
│       ├── auth/
│       ├── vehicles/
│       ├── bookings/
│       ├── payments/
│       ├── admin/
│       └── notifications/
│
├── components/
│   ├── ui/                          # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── language-toggle.tsx
│   │
│   ├── vehicle/
│   │   ├── vehicle-card.tsx
│   │   ├── vehicle-gallery.tsx
│   │   ├── amenities-list.tsx
│   │   └── price-display.tsx
│   │
│   ├── booking/
│   │   ├── booking-form.tsx
│   │   ├── price-negotiation.tsx
│   │   ├── booking-card.tsx
│   │   ├── status-badge.tsx
│   │   └── trip-details.tsx
│   │
│   ├── driver/
│   │   ├── booking-request-card.tsx
│   │   ├── accept-reject-actions.tsx
│   │   ├── earnings-chart.tsx
│   │   └── vehicle-form.tsx
│   │
│   └── admin/
│       ├── approval-card.tsx
│       ├── stats-widget.tsx
│       └── data-table.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   ├── middleware.ts           # Auth middleware
│   │   └── queries.ts              # Reusable queries
│   │
│   ├── api/
│   │   └── client.ts               # API client wrapper
│   │
│   ├── cashfree.ts                 # Cashfree helpers
│   ├── msg91.ts                    # SMS helpers
│   └── utils.ts                    # Utilities
│
├── hooks/
│   ├── useAuth.ts                  # Auth state
│   ├── useBookings.ts              # Booking operations
│   ├── useVehicles.ts              # Vehicle operations
│   └── usePayment.ts               # Payment operations
│
├── types/
│   └── index.ts                    # TypeScript types
│
└── middleware.ts                   # Next.js middleware (auth check)
```

---

## 🔌 API ROUTES ARCHITECTURE

### Complete API Endpoint Map

```typescript
// app/api/auth/send-otp/route.ts
POST /api/auth/send-otp
Body: { phone_number: string }
Response: { success: boolean }

// app/api/auth/verify-otp/route.ts
POST /api/auth/verify-otp
Body: { phone_number: string, otp: string }
Response: { success: boolean, user: User, session: Session }

// app/api/auth/logout/route.ts
POST /api/auth/logout
Response: { success: boolean }

// ──────────────────────────────────────────

// app/api/vehicles/search/route.ts
GET /api/vehicles/search
Query: {
  vehicle_type?: string,
  seating_capacity?: number,
  pickup_date?: string,
  operating_city?: string
}
Response: { vehicles: Vehicle[] }

// app/api/vehicles/[id]/route.ts
GET /api/vehicles/[id]
Response: { vehicle: Vehicle }

// app/api/vehicles/create/route.ts
POST /api/vehicles/create
Body: {
  vehicle_type: string,
  vehicle_name: string,
  registration_number: string,
  seating_capacity: number,
  base_price_per_day: number,
  price_per_km: number,
  amenities: string[],
  operating_cities: string[]
}
Response: { vehicle: Vehicle }

// app/api/vehicles/[id]/update/route.ts
PATCH /api/vehicles/[id]/update
Body: { ...updates }
Response: { vehicle: Vehicle }

// app/api/vehicles/[id]/delete/route.ts
DELETE /api/vehicles/[id]/delete
Response: { success: boolean }

// app/api/vehicles/upload-photo/route.ts
POST /api/vehicles/upload-photo
Body: FormData (image file)
Response: { url: string }

// ──────────────────────────────────────────

// app/api/bookings/create/route.ts
POST /api/bookings/create
Body: {
  vehicle_id: string,
  pickup_location: string,
  dropoff_location?: string,
  pickup_datetime: string,
  return_datetime?: string,
  trip_type: string,
  passenger_count: number,
  customer_offer_price: number,
  customer_notes?: string
}
Response: { booking: Booking }

// app/api/bookings/[id]/route.ts
GET /api/bookings/[id]
Response: { booking: Booking }

// app/api/bookings/my-bookings/route.ts
GET /api/bookings/my-bookings
Query: { status?: string }
Response: { bookings: Booking[] }

// app/api/bookings/[id]/accept/route.ts
PATCH /api/bookings/[id]/accept
Response: { booking: Booking }

// app/api/bookings/[id]/counter/route.ts
PATCH /api/bookings/[id]/counter
Body: { counter_price: number }
Response: { booking: Booking }

// app/api/bookings/[id]/reject/route.ts
PATCH /api/bookings/[id]/reject
Body: { rejection_reason: string }
Response: { booking: Booking }

// app/api/bookings/[id]/cancel/route.ts
PATCH /api/bookings/[id]/cancel
Response: { booking: Booking }

// app/api/bookings/[id]/complete/route.ts
PATCH /api/bookings/[id]/complete
Response: { booking: Booking }

// ──────────────────────────────────────────

// app/api/payments/create-order/route.ts
POST /api/payments/create-order
Body: {
  booking_id: string,
  amount: number
}
Response: {
  payment_session_id: string,
  order_id: string
}

// app/api/payments/webhook/route.ts
POST /api/payments/webhook
Body: Cashfree webhook payload
Response: { success: boolean }

// app/api/payments/verify/route.ts
POST /api/payments/verify
Body: { order_id: string }
Response: { status: string, payment: Payment }

// ──────────────────────────────────────────

// app/api/admin/drivers/approve/route.ts
PATCH /api/admin/drivers/approve
Body: { driver_id: string }
Response: { success: boolean }

// app/api/admin/vehicles/approve/route.ts
PATCH /api/admin/vehicles/approve
Body: { vehicle_id: string }
Response: { success: boolean }

// app/api/admin/stats/route.ts
GET /api/admin/stats
Response: {
  total_bookings: number,
  pending_approvals: number,
  total_revenue: number,
  active_drivers: number
}

// ──────────────────────────────────────────

// app/api/notifications/send-sms/route.ts
POST /api/notifications/send-sms
Body: {
  phone_number: string,
  message: string
}
Response: { success: boolean }

// app/api/notifications/reveal-contact/route.ts
POST /api/notifications/reveal-contact
Body: { booking_id: string }
Response: {
  driver_phone: string,
  revealed_at: timestamp
}
```

---

## 🔄 STATE MANAGEMENT

### React Query (TanStack Query) Setup

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// hooks/useBookings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'my-bookings'],
    queryFn: async () => {
      const res = await fetch('/api/bookings/my-bookings')
      return res.json()
    },
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
    },
  })
}
```

---

## 📱 REAL-TIME UPDATES (Supabase Realtime)

### Subscribe to Booking Updates

```typescript
// hooks/useRealtimeBookings.ts
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtimeBookings(userId: string, role: 'customer' | 'driver') {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const channel = supabase
      .channel('booking-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: role === 'customer' 
            ? `customer_id=eq.${userId}`
            : `driver_id=eq.${userId}`
        },
        (payload) => {
          console.log('Booking updated:', payload)
          queryClient.invalidateQueries(['bookings'])
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, role, queryClient])
}
```

---

## 💳 PAYMENT INTEGRATION

### Cashfree Flow Detailed

```typescript
// lib/cashfree.ts
import { Cashfree } from 'cashfree-pg'

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID!
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET!
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION

export async function createPaymentOrder(
  bookingId: string,
  amount: number,
  customerPhone: string,
  customerName: string
) {
  const orderRequest = {
    order_amount: amount,
    order_currency: 'INR',
    order_id: `ORDER_${bookingId}`,
    customer_details: {
      customer_id: customerPhone,
      customer_phone: customerPhone,
      customer_name: customerName,
    },
    order_meta: {
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/customer/checkout/${bookingId}/success`,
      notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
    },
  }
  
  const response = await Cashfree.PGCreateOrder('2023-08-01', orderRequest)
  return response.data
}

// Webhook handler
export async function handlePaymentWebhook(payload: any) {
  // Verify signature
  const signature = payload.signature
  // ... verify signature logic
  
  if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK') {
    const orderId = payload.data.order.order_id
    const bookingId = orderId.replace('ORDER_', '')
    
    // Update booking & payment
    await supabase
      .from('bookings')
      .update({ payment_status: 'paid', status: 'customer_paid' })
      .eq('id', bookingId)
    
    await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        amount: payload.data.order.order_amount,
        cashfree_order_id: orderId,
        cashfree_payment_id: payload.data.payment.cf_payment_id,
        status: 'success',
      })
    
    // Send SMS to driver
    await sendSMS(driverPhone, `Payment received for booking ${bookingCode}`)
  }
}
```

---

## 📧 SMS NOTIFICATIONS

### MSG91 Integration

```typescript
// lib/msg91.ts
export async function sendSMS(phoneNumber: string, message: string) {
  const response = await fetch('https://api.msg91.com/api/v5/flow/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authkey': process.env.MSG91_AUTH_KEY!,
    },
    body: JSON.stringify({
      flow_id: process.env.MSG91_FLOW_ID!,
      sender: 'BUSAPP',
      mobiles: phoneNumber,
      VAR1: message,
    }),
  })
  
  return response.json()
}

// SMS Templates
export const SMS_TEMPLATES = {
  BOOKING_CREATED: (driverName: string, customerName: string, price: number) =>
    `New booking request from ${customerName}. Offered price: ₹${price}. Check dashboard to accept.`,
  
  BOOKING_ACCEPTED: (driverName: string, vehicleName: string) =>
    `Your booking confirmed! Driver: ${driverName}, Vehicle: ${vehicleName}. Contact revealed 2hr before trip.`,
  
  BOOKING_REJECTED: (reason: string) =>
    `Sorry, driver unavailable. Reason: ${reason}. Browse other vehicles.`,
  
  PAYMENT_RECEIVED: (amount: number, bookingCode: string) =>
    `Payment ₹${amount} received for booking #${bookingCode}.`,
  
  CONTACT_REVEAL: (driverName: string, driverPhone: string) =>
    `Your trip starts soon! Driver: ${driverName}, Contact: ${driverPhone}`,
}
```

---

## 🔒 AUTHENTICATION MIDDLEWARE

### Next.js Middleware for Protected Routes

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Get user profile to check role
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    const path = req.nextUrl.pathname
    
    // Protect customer routes
    if (path.startsWith('/customer') && profile?.role !== 'customer') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    // Protect driver routes
    if (path.startsWith('/driver') && profile?.role !== 'driver') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    // Protect admin routes
    if (path.startsWith('/admin') && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  } else {
    // Redirect to login if not authenticated
    if (
      req.nextUrl.pathname.startsWith('/customer') ||
      req.nextUrl.pathname.startsWith('/driver') ||
      req.nextUrl.pathname.startsWith('/admin')
    ) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  return res
}

export const config = {
  matcher: ['/customer/:path*', '/driver/:path*', '/admin/:path*'],
}
```

---

## 📦 DEPLOYMENT ARCHITECTURE

### Vercel Deployment

```bash
# Environment Variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... # For server-side only

CASHFREE_CLIENT_ID=xxx
CASHFREE_CLIENT_SECRET=xxx
CASHFREE_ENV=PRODUCTION

MSG91_AUTH_KEY=xxx
MSG91_FLOW_ID=xxx

NEXT_PUBLIC_BASE_URL=https://yourapp.com
```

```bash
# Deploy to Vercel
npm run build
vercel --prod

# OR connect GitHub repo for auto-deploy
```

### Supabase Deployment

```bash
# Initialize Supabase project
npx supabase init

# Run migrations locally
npx supabase db push

# Deploy to Supabase cloud (automatic via dashboard)
```

---

## 🧪 TESTING STRATEGY

### Unit Tests (Vitest)

```typescript
// __tests__/lib/pricing.test.ts
import { describe, it, expect } from 'vitest'
import { calculateTripPrice } from '@/lib/pricing'

describe('Pricing Calculator', () => {
  it('should calculate one-way trip price correctly', () => {
    const price = calculateTripPrice({
      basePricePerDay: 10000,
      pricePerKm: 15,
      distance: 180,
      tripType: 'one_way',
    })
    
    expect(price).toBe(11700) // 10000 + (80 * 15)
  })
})
```

### Integration Tests (Playwright)

```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test'

test('customer can create booking', async ({ page }) => {
  // Login
  await page.goto('/login')
  await page.fill('[name="phone"]', '+919876543210')
  await page.click('button:has-text("Send OTP")')
  await page.fill('[name="otp"]', '123456')
  await page.click('button:has-text("Verify")')
  
  // Search vehicle
  await page.goto('/search')
  await page.selectOption('[name="vehicle_type"]', 'innova')
  await page.fill('[name="pickup_location"]', 'Jaipur Railway Station')
  await page.click('button:has-text("Search")')
  
  // Select vehicle
  await page.click('.vehicle-card:first-child')
  
  // Create booking
  await page.fill('[name="customer_offer_price"]', '5000')
  await page.click('button:has-text("Send Request")')
  
  // Verify success
  await expect(page.locator('text=Request sent')).toBeVisible()
})
```

---

## 📊 MONITORING & ANALYTICS

### Supabase Logs

```sql
-- Query slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Monitor table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Google Analytics (Optional)

```typescript
// lib/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export const event = ({ action, category, label, value }: any) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### 1. Database Indexes (Already Added Above)

- Indexes on foreign keys
- Indexes on frequently queried columns
- GIN index on JSONB columns

### 2. Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['supabase.co'],
    formats: ['image/webp'],
  },
}

// Usage
<Image
  src={vehicle.photos[0]}
  alt={vehicle.name}
  width={400}
  height={300}
  loading="lazy"
/>
```

### 3. API Route Caching

```typescript
// app/api/vehicles/search/route.ts
export const revalidate = 60 // Cache for 60 seconds

export async function GET(request: Request) {
  // ... query logic
}
```

### 4. React Server Components

```typescript
// app/vehicle/[id]/page.tsx
async function VehiclePage({ params }: { params: { id: string } }) {
  // This runs on server, no client JS needed
  const vehicle = await getVehicle(params.id)
  
  return <VehicleDetails vehicle={vehicle} />
}
```

---

## 📈 SCALABILITY CONSIDERATIONS

### Current Architecture Limits

- **Supabase Free Tier:** 500MB DB, 1GB storage, 50K monthly active users
- **Vercel Free Tier:** 100GB bandwidth/month
- **Expected Load (Year 1):** 5,000 bookings = ~50MB data

### When to Upgrade

- **Database:** When approaching 400MB (upgrade to Pro: $25/mo for 8GB)
- **Storage:** When approaching 800MB (Pro tier: 100GB)
- **API Calls:** Supabase limits are generous (5M reads/month on free tier)

### Horizontal Scaling (Future)

- Add read replicas for heavy queries
- Implement Redis caching for hot data
- CDN for static assets (Vercel does this automatically)

---

## 🔐 SECURITY BEST PRACTICES

### 1. Environment Variables

```
✅ Never commit .env to Git
✅ Use different keys for dev/prod
✅ Rotate secrets every 3 months
✅ Use Vercel's encrypted env vars
```

### 2. API Security

```typescript
// Rate limiting (use Vercel Edge Config)
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')
  const { success } = await ratelimit.limit(ip!)
  
  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }
  
  // ... proceed
}
```

### 3. Input Validation

```typescript
import { z } from 'zod'

const bookingSchema = z.object({
  vehicle_id: z.string().uuid(),
  pickup_location: z.string().min(3),
  pickup_datetime: z.string().datetime(),
  customer_offer_price: z.number().positive(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const validated = bookingSchema.parse(body) // Throws if invalid
  
  // ... proceed
}
```

---

## 📚 DEVELOPER ONBOARDING

### Getting Started

```bash
# 1. Clone repo
git clone <repo-url>
cd bus-booking-app

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Fill in Supabase + Cashfree keys

# 4. Run locally
npm run dev

# 5. Access app
# http://localhost:3000
```

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx supabase db reset    # Reset local DB
npx supabase db push     # Push migrations to remote

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run Playwright tests

# Deployment
vercel --prod            # Deploy to Vercel
```

---

## 🎯 SUCCESS METRICS

### Key Performance Indicators (KPIs)

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Registered Drivers | 10 | 50 |
| Active Vehicles | 20 | 100 |
| Total Bookings | 50 | 500 |
| Booking Acceptance Rate | >70% | >80% |
| Payment Success Rate | >90% | >95% |
| Customer Satisfaction | >4.0/5 | >4.5/5 |
| Platform Uptime | >99% | >99.5% |

### Analytics to Track

- Booking funnel: Search → View → Request → Accept → Pay
- Driver response time (target: <2 hours)
- Customer acquisition cost
- Average booking value
- Most popular vehicle types
- Peak booking hours/days

---

## END OF ARCHITECTURE DOCUMENT

This architecture is designed for:
✅ **Rapid Development** (4 weeks)
✅ **Zero Infrastructure Costs** (Supabase + Vercel free tiers)
✅ **Scalability** (Handle 10K bookings without upgrades)
✅ **Security** (RLS policies + JWT auth)
✅ **Maintainability** (Clean code structure)

Ready to build! 🚀
