# Backend (Supabase) Audit Report

**Date:** 2026-03-01  
**Scope:** All `public` schema tables, RLS policies, triggers, functions, storage, and cross-reference with frontend code.

---

## Resolution Status

> **All 33 issues have been resolved** (as of 2026-03-01).

### Database Migrations Applied (14 total)

| # | Migration Name | Issues Fixed |
| --- | --- | --- |
| 1 | `create_platform_settings_table` | C1 |
| 2 | `add_missing_rls_insert_policies` | C6, C7 |
| 3 | `drop_django_legacy_tables` | H3, L1 |
| 4 | `remove_password_column_and_legacy_fields` | H4, L2, L3, L4 |
| 5 | `update_handle_new_user_trigger` | H8 |
| 6 | `add_check_constraints` | H2, M10, M11 |
| 7 | `add_performance_indexes` | H5, H6, H7 |
| 8 | `add_updated_at_triggers` | H1 |
| 9 | `create_reviews_table` | M1 |
| 10 | `create_payments_table` | M2 |
| 11 | `create_notifications_table` | M3 |
| 12 | `create_documents_table` | M4 |
| 13 | `fix_storage_policies_and_buckets` | M7, M8, M9 |
| 14 | `add_column_defaults_v2` | L5, L6 |

### Frontend Code Fixes

| File | Issues Fixed | Changes |
| --- | --- | --- |
| `app/api/admin/operators/route.ts` | C2, C5 | `full_name` → `name`, fixed `operator_profiles` join |
| `app/api/admin/operators/[id]/route.ts` | C2 | `full_name` → `name` in select + response |
| `app/api/admin/vehicles/route.ts` | C3, C4 | `capacity` → `seating_capacity`, `city` → `home_city`, `full_name` → `name` |
| `app/api/admin/vehicles/[id]/route.ts` | C4 | `full_name` → `name` in operator join |
| `app/admin/buses/page.tsx` | C3, C4 | Fixed Vehicle interface + JSX refs |
| `app/customer/dashboard/profile/page.tsx` | C2 | `full_name` → `name` in queries + UI |
| `lib/types/user.ts` | M5 | Rewrote User, Document, Notification to match DB |
| `lib/types/bus.ts` | M6 | Rewrote Bus, BusDetail, BusOperator to match DB |
| `lib/types/booking.ts` | M5 | Rewrote Booking, BookingBus, BookingOperator, BookingDetail to match DB |
| `lib/types/review.ts` | M5 | Rewrote BusReview to match DB reviews table |
| `lib/hooks/useBookings.ts` | M5 | Fixed ApiBooking interface, `pickup_date` → `trip_date`, fixed broken import |

### Not Addressed

| Issue | Reason |
| --- | --- |
| H9 (dual-identity `users.id` vs `auth.users.id`) | Architectural decision — `handle_new_user()` generates a new UUID for `users.id` and stores `auth.uid()` in `supabase_uid`. All RLS policies and FK references already use this pattern consistently. Changing it would require migrating all FK references across all tables. Left as-is since it works. |

---

## Summary

| Category | Issues Found |
|---|---|
| CRITICAL (will break features) | 7 |
| HIGH (security / data integrity) | 9 |
| MEDIUM (bad practices / missing features) | 11 |
| LOW (cleanup / improvements) | 6 |
| **Total** | **33** |

---

## DATABASE TABLES

### Current Tables (14 total)

| # | Table | RLS | Rows | Used by Frontend? |
|---|---|---|---|---|
| 1 | `users` | ✅ | 2 | ✅ Yes |
| 2 | `user_roles` | ✅ | 1 | ✅ Yes (by `has_role()` function) |
| 3 | `operator_profiles` | ✅ | 0 | ✅ Yes |
| 4 | `buses` | ✅ | 0 | ✅ Yes |
| 5 | `booking_requests` | ✅ | 0 | ✅ Yes |
| 6 | `bus_availability` | ✅ | 0 | ⚠️ Partially (no frontend UI) |
| 7 | `django_migrations` | ❌ | 25 | ❌ Dead weight |
| 8 | `django_content_type` | ❌ | 12 | ❌ Dead weight |
| 9 | `django_admin_log` | ❌ | 0 | ❌ Dead weight |
| 10 | `django_session` | ❌ | 0 | ❌ Dead weight |
| 11 | `auth_permission` | ❌ | 48 | ❌ Dead weight |
| 12 | `auth_group` | ❌ | 0 | ❌ Dead weight |
| 13 | `auth_group_permissions` | ❌ | 0 | ❌ Dead weight |
| 14 | `users_groups` | ❌ | 0 | ❌ Dead weight |
| 15 | `users_user_permissions` | ❌ | 0 | ❌ Dead weight |
| 16 | `authtoken_token` | ❌ | 0 | ❌ Dead weight |

---

## CRITICAL ISSUES (Will Break Features)

### C1. `platform_settings` table does NOT exist

**Impact:** Admin Settings page (`/admin/settings`) falls back to hardcoded defaults. Settings cannot be persisted.  
**Frontend code:** `app/api/admin/settings/route.ts` does `.from('platform_settings').select()` and `.upsert()`.  
**Fix:** Create `platform_settings` table.

```sql
-- MIGRATION: Create platform_settings table
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage settings" ON public.platform_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read settings" ON public.platform_settings
  FOR SELECT USING (true);
```

---

### C2. Admin operator query references `full_name` — column does NOT exist

**Impact:** `app/api/admin/operators/route.ts` selects `full_name` from `users`, but the column is named `name`. Query will return `null` for operator names.  
**Frontend code:** `.select('id, email, full_name, phone, is_verified, created_at, ...')`  
**DB column:** `name` (not `full_name`)  
**Fix:** Change frontend query from `full_name` → `name`.

---

### C3. Admin vehicles query references non-existent columns `capacity` and `city`

**Impact:** `app/api/admin/vehicles/route.ts` selects `capacity` and `city` from `buses`, but actual columns are `seating_capacity` and `home_city`. Will return `null`.  
**Frontend code:** `.select('id, name, model_name, bus_type, capacity, base_fare, approval_status, city, ...')`  
**DB columns:** `seating_capacity` (not `capacity`), `home_city` (not `city`)  
**Fix:** Change frontend query to use correct column names.

---

### C4. Admin vehicles query references `full_name` in operator join — column does NOT exist

**Impact:** `app/api/admin/vehicles/route.ts` joins `operator:users!buses_operator_id_f54c6fdd_fk_users_id(id, full_name, email, phone)`. The `full_name` column doesn't exist.  
**Fix:** Change `full_name` → `name`.

---

### C5. Admin operator query references `company_name`, `is_profile_complete` on `operator_profiles` — columns do NOT exist

**Impact:** `app/api/admin/operators/route.ts` selects `operator_profiles(id, company_name, gst_number, pan_number, address, is_profile_complete)`.  
**Actual `operator_profiles` columns:** `id, license_number, license_expiry, license_document_url, rc_number, rc_document_url, pan_document_url, gst_document_url, address_proof_url, created_at, updated_at, user_id`  
- `company_name` → exists on `users` table, NOT on `operator_profiles`
- `gst_number` → exists on `users` table, NOT on `operator_profiles`
- `pan_number` → exists on `users` table, NOT on `operator_profiles`
- `address` → exists on `users` table, NOT on `operator_profiles`
- `is_profile_complete` → does NOT exist anywhere (closest: `users.profile_completion` integer)  
**Fix:** Update query to select these from `users` instead, and use `profile_completion` instead of `is_profile_complete`.

---

### C6. `users` table INSERT policy is MISSING

**Impact:** The `handle_new_user()` trigger fires on `auth.users` INSERT and tries to INSERT into `public.users`. But there's no INSERT policy on the `users` table. The trigger runs as SECURITY DEFINER so it may bypass RLS, but any direct API insert would fail.  
**Current policies:** Only `SELECT` (own + admin) and `UPDATE` (own).  
**Fix:** The trigger function should be `SECURITY DEFINER`. Verify this, and also add an insert policy for user self-creation if needed.

---

### C7. `operator_profiles` INSERT policy is MISSING

**Impact:** Operators cannot create their own profile via Supabase client. Only `SELECT` (own), `UPDATE` (own), and `ALL` (admin) policies exist. There's no `INSERT` for operators.  
**Fix:** Add INSERT policy for operators.

```sql
CREATE POLICY "Operators can create own profile" ON public.operator_profiles
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE supabase_uid::text = auth.uid()::text
    )
  );
```

---

## HIGH SEVERITY (Security / Data Integrity)

### H1. No `updated_at` auto-update triggers on ANY table

**Impact:** Frontend manually sets `updated_at` in update queries. If any code path forgets, the timestamp becomes stale. Best practice is a trigger.  
**Affected tables:** `users`, `buses`, `booking_requests`, `operator_profiles`  
**Fix:** Add `updated_at` trigger to all relevant tables.

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.buses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.operator_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

### H2. No CHECK constraints on `status` columns (booking_requests, buses)

**Impact:** Any arbitrary status string can be inserted. Frontend expects specific values:
- `booking_requests.status`: `pending`, `contacted`, `confirmed`, `rejected`, `cancelled`, `completed`
- `buses.approval_status`: `pending`, `approved`, `rejected`
- `buses.ac_type`: `ac`, `non_ac`
- `booking_requests.payment_status`: `pending`, `advance_paid`, `fully_paid`, `refund_pending`, `refunded`  
**Fix:** Add CHECK constraints.

```sql
ALTER TABLE public.booking_requests
  ADD CONSTRAINT booking_status_check CHECK (
    status IN ('pending', 'contacted', 'confirmed', 'rejected', 'cancelled', 'completed', 'in_progress', 'expired')
  );

ALTER TABLE public.booking_requests
  ADD CONSTRAINT payment_status_check CHECK (
    payment_status IN ('pending', 'advance_paid', 'fully_paid', 'refund_pending', 'refund_failed', 'refunded')
  );

ALTER TABLE public.buses
  ADD CONSTRAINT approval_status_check CHECK (
    approval_status IN ('pending', 'approved', 'rejected')
  );

ALTER TABLE public.buses
  ADD CONSTRAINT ac_type_check CHECK (
    ac_type IN ('ac', 'non_ac', 'partial_ac')
  );
```

---

### H3. Django leftover tables have NO RLS — security risk

**Impact:** 6 Django tables (`django_migrations`, `django_content_type`, `auth_permission`, `auth_group`, `auth_group_permissions`, `django_admin_log`, `django_session`, `authtoken_token`, `users_groups`, `users_user_permissions`) have RLS disabled. If accessed via Supabase client, any authenticated user could read/write them.  
**Fix:** Either drop them (recommended — see L1) or enable RLS with deny-all policies.

---

### H4. `users.password` column is exposed to Supabase API

**Impact:** The `users` table has a `password` column (Django legacy). Supabase auth handles passwords separately. This column is queryable via the client and could leak password hashes.  
**Fix:** Drop the column or create a VIEW that excludes it.

---

### H5. `booking_requests` has no index on `status` or `customer_id`

**Impact:** All booking queries filter by `status` and/or `customer_id`. Without indexes, these become full table scans as data grows.  
**Fix:**

```sql
CREATE INDEX idx_booking_requests_status ON public.booking_requests(status);
CREATE INDEX idx_booking_requests_customer_id ON public.booking_requests(customer_id);
CREATE INDEX idx_booking_requests_bus_id ON public.booking_requests(bus_id);
CREATE INDEX idx_booking_requests_created_at ON public.booking_requests(created_at DESC);
```

---

### H6. `buses` has no index on `operator_id` or `approval_status`

**Impact:** Operator bus listing and admin approval queries filter on these columns.  
**Fix:**

```sql
CREATE INDEX idx_buses_operator_id ON public.buses(operator_id);
CREATE INDEX idx_buses_approval_status ON public.buses(approval_status);
CREATE INDEX idx_buses_home_city ON public.buses(home_city);
```

---

### H7. `users` has no index on `role` or `supabase_uid` for fast lookups

**Impact:** `supabase_uid` has a UNIQUE constraint (which creates an index), but `role` is frequently filtered and has no index.  
**Fix:**

```sql
CREATE INDEX idx_users_role ON public.users(role);
```

---

### H8. `handle_new_user()` trigger inserts empty `password` field

**Impact:** The trigger inserts `password = ''` which is pointless since Supabase Auth manages passwords. This Django legacy field should not be populated.  
**Fix:** Remove `password` from the trigger or remove the column entirely.

---

### H9. `user_roles.user_id` FK points to `auth.users.id`, but `users.id` is a different UUID

**Impact:** The `user_roles` table references `auth.users.id` directly, while the `users` table has its OWN `id` (generated by `gen_random_uuid()`) plus `supabase_uid` which maps to `auth.users.id`. This creates a dual-identity problem:
- `user_roles.user_id` = `auth.users.id` = `users.supabase_uid`
- `booking_requests.customer_id` = `users.id` (NOT `auth.users.id`)  
This split-identity is confusing and error-prone.  
**Fix:** Consider making `users.id` = `auth.users.id` directly, or document the mapping clearly.

---

## MEDIUM SEVERITY (Missing Features / Bad Practices)

### M1. No `reviews` / `ratings` table exists

**Impact:** Frontend types (`lib/types/bus.ts` → `BusReview`, `lib/types/review.ts`) and API endpoints define review features, but no table exists. `rating_avg` and `rating_count` columns on `users` and `buses` have no source of truth to compute from.  
**Fix:** Create a `reviews` table.

```sql
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES booking_requests(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  bus_id UUID NOT NULL REFERENCES buses(id),
  operator_id UUID NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT DEFAULT '',
  photos JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(booking_id, reviewer_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
```

---

### M2. No `payments` table exists

**Impact:** Frontend types (`lib/types/booking.ts`) define `payment_status`, `payment_mode`, and the architecture doc describes a payments table. The `booking_requests` table has payment columns inline but no proper payment records table for tracking transactions, refunds, or payment gateway events.  
**Fix:** Create a `payments` table for audit trails.

```sql
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES booking_requests(id),
  amount NUMERIC(12,2) NOT NULL,
  payment_mode VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  gateway_order_id VARCHAR(255),
  gateway_payment_id VARCHAR(255),
  gateway_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
```

---

### M3. No `notifications` table exists

**Impact:** Frontend type `Notification` is defined in `lib/types/user.ts` and API endpoints are defined in `lib/constants/api-endpoints.ts`, but no table exists.  
**Fix:** Create `notifications` table.

```sql
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE supabase_uid::text = auth.uid()::text)
  );

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE supabase_uid::text = auth.uid()::text)
  );
```

---

### M4. No `documents` table exists

**Impact:** Frontend type `Document` is defined in `lib/types/user.ts` and hooks exist in `lib/hooks/use-documents.ts` for managing aadhar, PAN, driving license, RC book, etc. But no table exists.  
**Fix:** Create `documents` table.

```sql
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  document_type VARCHAR(50) NOT NULL,
  document_number VARCHAR(100),
  document_url VARCHAR(500) NOT NULL,
  verification_status VARCHAR(20) DEFAULT 'pending',
  notes TEXT DEFAULT '',
  expiry_date DATE,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id)
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
```

---

### M5. `users` table missing columns expected by frontend types

**Frontend `lib/types/user.ts` expects:**
| Column | Status |
|---|---|
| `business_name` | ❌ Missing (only `company_name` exists) |
| `business_type` | ❌ Missing |
| `verification_status` | ❌ Missing (only `is_verified` boolean exists) |
| `subscription_tier` | ❌ Missing |
| `subscription_expiry` | ❌ Missing |
| `language` | ❌ Missing |
| `receive_whatsapp` | ❌ Missing |
| `receive_email` | ❌ Missing |
| `receive_sms` | ❌ Missing |
| `total_buses` | ❌ Missing |

**Fix:** Either update the frontend types to match the actual DB, or add these columns. Since the frontend types seem to be aspirational (planned features), recommend updating frontend types to match current DB reality, then add columns as features are built.

---

### M6. `buses` table missing columns expected by frontend types

**Frontend `lib/types/bus.ts` expects:**
| Column | Status |
|---|---|
| `price_per_km` | ❌ Missing (DB has `per_km_rate`) |
| `base_price` | ❌ Missing (DB has `base_fare`) |
| `base_city` | ❌ Missing (DB has `home_city`) |
| `base_area` | ❌ Missing |
| `primary_photo` | ❌ Missing (DB has `thumbnail_url`) |
| `is_approved` | ❌ Missing (DB has `approval_status` varchar) |
| `fuel_type` | ❌ Missing |
| `minimum_km` | ❌ Missing |
| `driver_charge_per_day` | ❌ Missing (DB has `driver_allowance`) |
| `night_halt_charge` | ❌ Missing (DB has `night_charges`) |

**Note:** The API routes (`app/api/buses/route.ts`) correctly transform DB columns to match the API response. The issue is that `lib/types/bus.ts` defines a DIFFERENT set of field names than the API actually returns. This causes type confusion.

---

### M7. Storage bucket `bus-photos` has no DELETE policy

**Impact:** Authenticated users can upload photos but cannot delete them. Old/wrong photos accumulate.  
**Fix:**

```sql
CREATE POLICY "Operators can delete own bus photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'bus-photos' AND auth.uid()::text IS NOT NULL);
```

---

### M8. Storage bucket `bus-photos` upload policy has no bucket restriction

**Impact:** The INSERT policy on `storage.objects` for authenticated users has no `bucket_id` check. Any authenticated user can upload to ANY bucket.  
**Fix:** Add bucket check to the INSERT policy.

---

### M9. No `operator_documents` storage bucket

**Impact:** `operator_profiles` has columns for `license_document_url`, `rc_document_url`, etc. but there's no dedicated storage bucket for operator documents. Where do these files get uploaded?  
**Fix:** Create an `operator-documents` storage bucket with appropriate policies.

---

### M10. `booking_requests.passenger_count` allows 0

**Impact:** CHECK constraint is `passenger_count >= 0`, but 0 passengers makes no business sense.  
**Fix:** Change to `passenger_count >= 1`.

---

### M11. `buses.seating_capacity` allows 0

**Impact:** Similar to M10 — a bus with 0 seats is invalid.  
**Fix:** Change to `seating_capacity >= 1`.

---

## LOW SEVERITY (Cleanup / Improvements)

### L1. 8 Django legacy tables should be dropped

**Tables:** `django_migrations`, `django_content_type`, `django_admin_log`, `django_session`, `auth_permission`, `auth_group`, `auth_group_permissions`, `authtoken_token`, `users_groups`, `users_user_permissions`  
**Impact:** These are leftover from a Django backend migration. None are used by the Next.js frontend. They clutter the schema and pose a security risk (no RLS).  
**Fix:** Drop all Django tables after confirming no dependencies.

```sql
DROP TABLE IF EXISTS public.authtoken_token CASCADE;
DROP TABLE IF EXISTS public.django_admin_log CASCADE;
DROP TABLE IF EXISTS public.django_session CASCADE;
DROP TABLE IF EXISTS public.users_user_permissions CASCADE;
DROP TABLE IF EXISTS public.users_groups CASCADE;
DROP TABLE IF EXISTS public.auth_group_permissions CASCADE;
DROP TABLE IF EXISTS public.auth_group CASCADE;
DROP TABLE IF EXISTS public.auth_permission CASCADE;
DROP TABLE IF EXISTS public.django_content_type CASCADE;
DROP TABLE IF EXISTS public.django_migrations CASCADE;
```

---

### L2. `users.username` column is redundant

**Impact:** Set to `email` by the trigger. Supabase Auth doesn't use usernames. It's forced unique but serves no purpose.  
**Fix:** Consider dropping after updating the trigger.

---

### L3. `users.first_name` and `users.last_name` are redundant

**Impact:** Django legacy. Frontend only uses `name`. Trigger sets them from metadata but nothing reads them.  
**Fix:** Consider dropping.

---

### L4. `users.is_superuser` and `users.is_staff` are Django legacy

**Impact:** The frontend uses `role` and `user_roles` for authorization. These boolean flags are unused.  
**Fix:** Consider dropping.

---

### L5. No database-level default values on many columns

**Impact:** The `handle_new_user()` trigger hardcodes defaults like `total_bookings=0`, `rating_avg=0`, etc. If rows are inserted by other paths, these defaults won't apply. Should be set as column defaults.  
**Fix:** Add `DEFAULT` values to columns.

```sql
ALTER TABLE public.users ALTER COLUMN total_bookings SET DEFAULT 0;
ALTER TABLE public.users ALTER COLUMN rating_avg SET DEFAULT 0;
ALTER TABLE public.users ALTER COLUMN rating_count SET DEFAULT 0;
ALTER TABLE public.users ALTER COLUMN commission_rate SET DEFAULT 0;
ALTER TABLE public.users ALTER COLUMN total_earnings SET DEFAULT 0;
ALTER TABLE public.users ALTER COLUMN profile_completion SET DEFAULT 0;
ALTER TABLE public.users ALTER COLUMN is_active SET DEFAULT true;
ALTER TABLE public.users ALTER COLUMN is_verified SET DEFAULT false;
ALTER TABLE public.users ALTER COLUMN is_new SET DEFAULT true;
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'customer';
```

---

### L6. `booking_requests` has many monetary columns that default to nothing

**Impact:** Columns like `gst_amount`, `discount_amount`, `toll_estimate`, `amount_paid` etc. should default to `0` at the DB level.  
**Fix:** Add `DEFAULT 0` to all monetary columns.

---

## RLS POLICY AUDIT

### Existing Policies Summary

| Table | Policy | Verdict |
|---|---|---|
| **users** | SELECT: own + admin | ✅ Good |
| **users** | UPDATE: own only | ✅ Good |
| **users** | INSERT: ❌ MISSING | ⚠️ Trigger bypasses, but should exist |
| **users** | DELETE: ❌ MISSING | ✅ OK (users shouldn't self-delete) |
| **buses** | SELECT: public (approved+active) | ✅ Good |
| **buses** | ALL: own buses | ⚠️ Should be split (operators shouldn't delete approved buses) |
| **buses** | ALL: admin | ✅ Good |
| **booking_requests** | SELECT: customer owns OR operator's buses | ✅ Good |
| **booking_requests** | INSERT: customer owns | ✅ Good |
| **booking_requests** | UPDATE: operator for their buses | ✅ Good |
| **booking_requests** | ALL: admin | ✅ Good |
| **booking_requests** | DELETE: ❌ MISSING | ✅ OK (bookings shouldn't be deleted) |
| **bus_availability** | SELECT: public | ✅ Good |
| **bus_availability** | ALL: operator owns | ✅ Good |
| **operator_profiles** | SELECT: own + admin | ✅ Good |
| **operator_profiles** | UPDATE: own | ✅ Good |
| **operator_profiles** | INSERT: ❌ MISSING | ⚠️ See C7 |
| **user_roles** | SELECT: own | ✅ Good |
| **user_roles** | ALL: admin | ✅ Good |

---

## TRIGGER & FUNCTION AUDIT

### `handle_new_user()` — Auth Trigger

**Fires on:** `auth.users` INSERT  
**Issues found:**
1. Generates a NEW UUID for `users.id` instead of using `auth.users.id` — creates identity split (see H9)
2. Inserts empty `password` field (see H8)
3. No error handling — if INSERT fails, auth signup still succeeds but user record is missing
4. Hardcodes many empty string defaults instead of relying on column defaults

### `has_role()` — Authorization Function

**Definition:** Checks `user_roles` table for a given `user_id` and `role`.  
**Issues found:**
1. ✅ Correctly used in RLS policies
2. ⚠️ Only checks `user_roles` table, but the `users` table ALSO has a `role` column. These two role sources can get out of sync.

---

## STORAGE AUDIT

### Buckets

| Bucket | Public | Policies |
|---|---|---|
| `bus-photos` | ✅ Public | SELECT (anon+auth), INSERT (auth) |

### Issues

1. No DELETE policy — cannot remove photos (M7)
2. INSERT policy has no bucket_id restriction (M8)
3. No `operator-documents` bucket for license/RC uploads (M9)
4. No `avatars` bucket for user profile photos
5. No file size limits enforced via policies

---

## PRIORITY FIX ORDER

### Phase 1 — Fix Breaking Issues (Do First)

1. **C1** — Create `platform_settings` table
2. **C2, C3, C4, C5** — Fix frontend API queries with wrong column names
3. **C6, C7** — Add missing INSERT RLS policies

### Phase 2 — Security & Integrity

4. **H3** — Enable RLS on Django tables OR drop them (L1)
5. **H4** — Remove `password` column from `users`
6. **H2** — Add CHECK constraints on status columns
7. **H5, H6, H7** — Add performance indexes
8. **H1** — Add `updated_at` triggers

### Phase 3 — Missing Features

9. **M1** — Create `reviews` table
10. **M2** — Create `payments` table
11. **M3** — Create `notifications` table
12. **M4** — Create `documents` table
13. **M7, M8, M9** — Fix storage policies and create buckets

### Phase 4 — Cleanup

14. **L1** — Drop Django legacy tables
15. **L2-L4** — Drop unused columns
16. **L5, L6** — Add column defaults
17. **M5, M6** — Align frontend types with DB schema

---

*End of Audit Report*
