# Codebase Overview

This repository is a **Next.js App Router bus-booking platform** (BusYatra) with customer, operator, and admin experiences in a single codebase.

## Stack
- Next.js 15 + React 19 + TypeScript for UI and server routes.
- Supabase for authentication and database access.
- Tailwind CSS + shadcn/Radix style component primitives.

## High-level Architecture
- `app/` hosts pages and route handlers; both front-end screens and backend APIs live together.
- `app/api/*` contains server endpoints for buses, bookings, admin, auth, etc.
- `lib/` contains API client wrappers, Supabase clients, constants, and types.
- `components/` contains shared UI and feature components (landing page blocks, forms, cards).
- `docs/` contains detailed architecture, schema, and flow documents.

## Product Surfaces
- **Public landing/search flow**: marketing homepage and bus discovery.
- **Customer flow**: dashboard/profile and booking-related screens.
- **Operator flow**: registration/login, dashboard, bus management, booking handling.
- **Admin flow**: admin dashboard with users/operators/buses/bookings/reports/settings.

## Auth & Access Pattern
- Middleware checks for presence of Supabase auth cookie to gate protected routes.
- Route handlers perform authoritative user checks (`supabase.auth.getUser()`) and role checks.
- Frontend API wrapper attaches bearer token from client session when available.

## API Design Pattern
Most handlers use this shape:
1. Build Supabase server client.
2. Authenticate/authorize user.
3. Query/insert/update DB tables.
4. Transform DB rows to frontend-friendly objects.
5. Return JSON + proper status code.

## Data Model (as documented)
Core entities described in docs:
- `profiles` (roles and identity extension)
- `vehicles` / `buses` (operator inventory)
- `bookings` / `booking_requests` (trip lifecycle)
- `payments` (gateway status)

## Notable Characteristics
- Monorepo-like “single Next app” approach (no separate Express/Django backend).
- Strong role separation in UX (`/customer`, `/operator/dashboard`, `/admin`).
- Documentation is richer than README; `docs/architecture.md` and `docs/system-architecture.md` are the best starting points.
