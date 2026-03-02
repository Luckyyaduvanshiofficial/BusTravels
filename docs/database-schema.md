# 🗄️ DATABASE SCHEMA & RELATIONSHIPS

## Complete PostgreSQL Schema for Supabase

```
┌─────────────────────────────────────────────────────────┐
│              DATABASE STRUCTURE                         │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐
│    profiles      │ (Extends Supabase auth.users)
├──────────────────┤
│ id (UUID) PK     │───┐
│ role             │   │
│ full_name        │   │
│ phone_number UK  │   │
│ avatar_url       │   │
│ created_at       │   │
└──────────────────┘   │
                       │
        ┌──────────────┴──────────────┐
        │ (1 Driver owns many)        │
        ▼                             ▼
┌──────────────────┐          ┌──────────────────┐
│    vehicles      │          │    bookings      │
├──────────────────┤          ├──────────────────┤
│ id (UUID) PK     │────┐     │ id (UUID) PK     │
│ driver_id FK ────┼────┘     │ booking_code UK  │
│ vehicle_type     │     │    │ customer_id FK ──┼─→ profiles(id)
│ vehicle_name     │     │    │ driver_id FK ────┼─→ profiles(id)
│ registration_num │     └────┼─ vehicle_id FK   │
│ seating_capacity │          │ pickup_location  │
│ amenities (JSON) │          │ dropoff_location │
│ base_price/day   │          │ pickup_datetime  │
│ price_per_km     │          │ return_datetime  │
│ photos (JSON)    │          │ trip_type        │
│ is_approved      │          │ customer_offer_$ │
│ is_active        │          │ driver_counter_$ │
│ operating_cities │          │ final_agreed_$   │
│ created_at       │          │ status           │
└──────────────────┘          │ payment_method   │
                              │ payment_status   │
                              │ driver_contact_  │
                              │   revealed       │
                              │ customer_notes   │
                              │ driver_notes     │
                              │ created_at       │
                              └──────────────────┘
                                      │
                                      │ (1 booking has 0..1 payment)
                                      ▼
                              ┌──────────────────┐
                              │    payments      │
                              ├──────────────────┤
                              │ id (UUID) PK     │
                              │ booking_id FK    │
                              │ amount           │
                              │ cashfree_order_id│
                              │ cashfree_pay_id  │
                              │ status           │
                              │ metadata (JSON)  │
                              │ created_at       │
                              └──────────────────┘
                                      │
                                      │ (1 booking has 0..1 review)
                                      ▼
                              ┌──────────────────┐
                              │    reviews       │
                              ├──────────────────┤
                              │ id (UUID) PK     │
                              │ booking_id FK UK │
                              │ customer_id FK   │
                              │ driver_id FK     │
                              │ vehicle_id FK    │
                              │ rating (1-5)     │
                              │ comment          │
                              │ created_at       │
                              └──────────────────┘
```

## SQL Schema (Copy-Paste into Supabase)

### 1. Profiles Table
```sql
-- Extends Supabase auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'driver', 'admin')),
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_phone ON profiles(phone_number);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### 2. Vehicles Table
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Vehicle Details
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
  -- Example: ["url1", "url2", "url3", "url4", "url5", "url6"]
  
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

-- RLS Policies
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved vehicles"
ON vehicles FOR SELECT
USING (is_approved = TRUE AND is_active = TRUE);

CREATE POLICY "Drivers can manage own vehicles"
ON vehicles FOR ALL
USING (auth.uid() = driver_id);

CREATE POLICY "Admins can manage all vehicles"
ON vehicles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### 3. Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,
  
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
  
  -- Status
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
  CHECK (pickup_datetime < return_datetime OR return_datetime IS NULL)
);

-- Auto-generate booking code
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

-- Indexes
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_driver ON bookings(driver_id);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_pickup_date ON bookings(pickup_datetime);
CREATE INDEX idx_bookings_code ON bookings(booking_code);

-- RLS Policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = customer_id);

CREATE POLICY "Drivers can view assigned bookings"
ON bookings FOR SELECT
USING (auth.uid() = driver_id);

CREATE POLICY "Customers can create bookings"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Drivers can update booking status"
ON bookings FOR UPDATE
USING (auth.uid() = driver_id);

CREATE POLICY "Admins can view all bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### 4. Payments Table
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

-- RLS Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own booking payments"
ON payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = payments.booking_id
    AND (bookings.customer_id = auth.uid() OR bookings.driver_id = auth.uid())
  )
);
```

### 5. Reviews Table (Optional - v2)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) UNIQUE,
  customer_id UUID REFERENCES profiles(id),
  driver_id UUID REFERENCES profiles(id),
  vehicle_id UUID REFERENCES vehicles(id),
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_driver ON reviews(driver_id);
CREATE INDEX idx_reviews_vehicle ON reviews(vehicle_id);

-- RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
ON reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Customers can create reviews for own bookings"
ON reviews FOR INSERT
WITH CHECK (
  auth.uid() = customer_id
  AND EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = reviews.booking_id
    AND bookings.customer_id = auth.uid()
    AND bookings.status = 'completed'
  )
);
```

## Supabase Storage Buckets

```sql
-- Create storage bucket for vehicle photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-photos', 'vehicle-photos', true);

-- Allow authenticated users to upload
CREATE POLICY "Drivers can upload vehicle photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vehicle-photos'
  AND auth.role() = 'authenticated'
);

-- Anyone can view photos
CREATE POLICY "Anyone can view vehicle photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle-photos');

-- Drivers can delete own photos
CREATE POLICY "Drivers can delete own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vehicle-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Key Database Features:

### 1. Auto-Generated Booking Codes
- Format: BUS12345
- Unique 5-digit number
- Triggered on INSERT

### 2. Row Level Security (RLS)
- Customers: See only own bookings
- Drivers: See only assigned bookings
- Admins: See everything

### 3. Cascade Deletes
- Delete driver → deletes their vehicles
- Delete vehicle → keeps bookings (for history)
- Delete booking → deletes payment record

### 4. JSON Fields for Flexibility
- `amenities`: ["AC", "Music", "WiFi"]
- `photos`: ["url1", "url2", "url3"]
- `operating_cities`: ["Jaipur", "Jodhpur"]

### 5. Check Constraints
- Seating capacity > 0
- Rating between 1-5
- Prices > 0
- Return date after pickup date

### 6. Indexes for Performance
- Foreign keys indexed
- Status fields indexed
- Phone numbers indexed
- Frequently queried columns indexed

## Sample Data (For Testing)

```sql
-- Create admin user (do this AFTER signing up via Supabase Auth)
INSERT INTO profiles (id, role, full_name, phone_number)
VALUES (
  'YOUR-UUID-FROM-AUTH',
  'admin',
  'Admin User',
  '+919876543210'
);

-- Create sample driver
INSERT INTO profiles (id, role, full_name, phone_number)
VALUES (
  gen_random_uuid(),
  'driver',
  'Ramesh Kumar',
  '+919876543211'
);

-- Create sample vehicle
INSERT INTO vehicles (
  driver_id,
  vehicle_type,
  vehicle_name,
  registration_number,
  seating_capacity,
  base_price_per_day,
  price_per_km,
  amenities,
  is_approved,
  operating_cities
) VALUES (
  (SELECT id FROM profiles WHERE phone_number = '+919876543211'),
  'innova',
  'White Innova Crysta',
  'RJ-14-AB-1234',
  7,
  5000,
  12,
  '["AC", "Music System", "GPS"]',
  true,
  '["Jaipur", "Jodhpur"]'
);
```

## Database Statistics Queries

```sql
-- Total bookings
SELECT COUNT(*) FROM bookings;

-- Bookings by status
SELECT status, COUNT(*) FROM bookings GROUP BY status;

-- Total revenue
SELECT SUM(final_agreed_price) FROM bookings WHERE payment_status = 'paid';

-- Average booking value
SELECT AVG(final_agreed_price) FROM bookings WHERE status = 'completed';

-- Top drivers by bookings
SELECT 
  p.full_name,
  COUNT(b.id) as total_bookings
FROM profiles p
JOIN bookings b ON p.id = b.driver_id
WHERE p.role = 'driver'
GROUP BY p.full_name
ORDER BY total_bookings DESC
LIMIT 10;
```

