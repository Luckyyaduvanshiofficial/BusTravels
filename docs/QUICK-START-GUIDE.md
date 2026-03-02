# 🚀 QUICK START GUIDE - Bus Booking Platform

**Complete Setup in 7 Days** | Zero Backend | ₹2,100 Total Cost

---

## 📋 WHAT YOU HAVE NOW

### ✅ 6 Complete Documentation Files:
1. **ARCHITECTURE.md** - Full system architecture (100+ pages)
2. **system-architecture.md** - Visual high-level diagram
3. **customer-booking-flow.md** - Complete customer journey
4. **driver-flow.md** - Driver onboarding & booking flow
5. **database-schema.md** - Complete SQL schema + RLS
6. **api-routes.md** - All API endpoint specifications

### ✅ 9 Interactive Diagrams (From Figma):
1. System Architecture (High Level)
2. Customer Booking Flow
3. Driver Onboarding & Booking Flow
4. Booking Sequence Diagram
5. Booking State Machine
6. Next.js Folder Structure
7. API Routes Structure
8. Security Architecture
9. Development Timeline (Gantt Chart)

---

## 🎯 YOUR 7-DAY SETUP PLAN

### Day 1: Accounts & Environment Setup (2 hours)
```bash
✅ Create Supabase account (https://supabase.com)
   - Click "Start your project"
   - Create organization: "Bus Booking"
   - Create project: "bus-booking-prod"
   - Region: Mumbai (closest to India)
   - Save these:
     * Project URL: https://xxx.supabase.co
     * Anon Key: eyJxxx...
     * Service Role Key: eyJxxx... (KEEP SECRET!)

✅ Create Cashfree account (https://cashfree.com)
   - Sign up with phone
   - Go to "Developers" section
   - Get Sandbox credentials:
     * Client ID
     * Client Secret
   - (Switch to Production after launch)

✅ Create MSG91 account (https://msg91.com)
   - Sign up
   - Buy ₹500 credits (≈1,700 SMS)
   - Get API Key from dashboard
   - Create SMS template (for OTP)

✅ Create Vercel account (https://vercel.com)
   - Sign up with GitHub
   - No setup needed yet

✅ Buy domain name
   - Go to GoDaddy / Hostinger / Namecheap
   - Buy .in domain (₹600/year)
   - Examples: busgo.in, yatraseva.in, ridehub.in
   - Don't configure DNS yet
```

---

### Day 2: Database Setup (3 hours)
```bash
✅ Open Supabase project dashboard
✅ Go to "SQL Editor"
✅ Copy ENTIRE content from database-schema.md
✅ Paste and click "Run"
   - This creates:
     * profiles table
     * vehicles table
     * bookings table
     * payments table
     * reviews table
     * All RLS policies
     * All indexes
     * Storage buckets

✅ Verify tables created:
   - Go to "Table Editor"
   - You should see: profiles, vehicles, bookings, payments, reviews

✅ Test Supabase Auth:
   - Go to "Authentication" → "Providers"
   - Enable "Phone" provider
   - Copy Phone provider settings
   - SMS provider: Twilio / MessageBird (or use custom webhook)
```

---

### Day 3: Next.js Project Setup (4 hours)
```bash
# Create Next.js project
npx create-next-app@latest bus-booking-app
# ✅ TypeScript: Yes
# ✅ ESLint: Yes
# ✅ Tailwind: Yes
# ✅ App Router: Yes
# ✅ Import alias: Yes (@/*)

cd bus-booking-app

# Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @tanstack/react-query
npm install zod
npm install cashfree-pg
npm install -D @types/node

# Install Shadcn UI
npx shadcn-ui@latest init
# ✅ Style: Default
# ✅ Color: Slate
# ✅ CSS variables: Yes

# Add essential components
npx shadcn-ui@latest add button card input label select dialog badge

# Create .env.local file
cat > .env.local << 'ENVEOF'
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

CASHFREE_CLIENT_ID=xxx
CASHFREE_CLIENT_SECRET=xxx
CASHFREE_ENV=SANDBOX

MSG91_AUTH_KEY=xxx
MSG91_FLOW_ID=xxx

NEXT_PUBLIC_BASE_URL=http://localhost:3000
ENVEOF

# Run dev server
npm run dev
# Visit: http://localhost:3000
```

---

### Day 4: Core Features Implementation (6 hours)

**Morning: Auth + Database Connection**
```typescript
// Create: lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// Create: lib/supabase/server.ts  
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = () => {
  return createServerComponentClient({ cookies })
}

// Create: app/(auth)/login/page.tsx
// Implement phone OTP login (refer to ARCHITECTURE.md)
```

**Afternoon: Vehicle Search**
```typescript
// Create: app/api/vehicles/search/route.ts
// Implement search endpoint (refer to api-routes.md)

// Create: app/search/page.tsx
// Build search results page
```

---

### Day 5: Booking System (6 hours)

**Morning: Create Booking**
```typescript
// Create: app/api/bookings/create/route.ts
// Implement booking creation

// Create: app/vehicle/[id]/page.tsx
// Vehicle detail + booking form
```

**Afternoon: Driver Dashboard**
```typescript
// Create: app/(driver)/dashboard/page.tsx
// Show pending booking requests

// Create: app/api/bookings/[id]/accept/route.ts
// Accept/Counter/Reject endpoints
```

---

### Day 6: Payment & SMS (5 hours)

**Morning: Cashfree Integration**
```typescript
// Create: app/api/payments/create-order/route.ts
// Create: app/api/payments/webhook/route.ts
// Test in Cashfree sandbox

// Create: app/(customer)/checkout/[id]/page.tsx
// Payment page
```

**Afternoon: SMS Notifications**
```typescript
// Create: lib/msg91.ts
// Implement SMS helper

// Add SMS triggers in:
// - Booking creation
// - Booking acceptance
// - Payment success
// - Contact reveal (cron job)
```

---

### Day 7: Testing & Launch (6 hours)

**Morning: End-to-End Testing**
```bash
✅ Test customer flow:
   1. Register
   2. Search vehicles
   3. Create booking
   4. Pay online (sandbox)
   
✅ Test driver flow:
   1. Register
   2. Add vehicle
   3. Receive booking request
   4. Accept booking
   
✅ Test admin flow:
   1. Approve driver
   2. Approve vehicle
   3. View all bookings
```

**Afternoon: Deploy to Vercel**
```bash
# Connect GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/bus-booking-app.git
git push -u origin main

# Deploy to Vercel
vercel --prod

# Configure custom domain
# Vercel Dashboard → Settings → Domains → Add busgo.in

# Add environment variables in Vercel
# (Same as .env.local)
```

---

## 🔧 ESSENTIAL CODE SNIPPETS

### 1. Supabase Client (Browser)
```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()
```

### 2. Supabase Client (Server)
```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}
```

### 3. Phone OTP Login
```typescript
// app/(auth)/login/page.tsx
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')

  async function sendOTP() {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    })
    if (!error) setStep('otp')
  }

  async function verifyOTP() {
    const { error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: otp,
      type: 'sms',
    })
    if (!error) window.location.href = '/dashboard'
  }

  return (
    <div>
      {step === 'phone' ? (
        <>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button onClick={sendOTP}>Send OTP</button>
        </>
      ) : (
        <>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOTP}>Verify</button>
        </>
      )}
    </div>
  )
}
```

### 4. Vehicle Search API
```typescript
// app/api/vehicles/search/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const vehicleType = searchParams.get('vehicle_type')
  const city = searchParams.get('city')

  const supabase = createClient()

  let query = supabase
    .from('vehicles')
    .select('*, profiles!driver_id(*)')
    .eq('is_approved', true)
    .eq('is_active', true)

  if (vehicleType) {
    query = query.eq('vehicle_type', vehicleType)
  }

  if (city) {
    query = query.contains('operating_cities', [city])
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vehicles: data })
}
```

### 5. Create Booking API
```typescript
// app/api/bookings/create/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Get driver_id from vehicle
  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('driver_id')
    .eq('id', body.vehicle_id)
    .single()

  // Create booking
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: user.id,
      driver_id: vehicle.driver_id,
      vehicle_id: body.vehicle_id,
      pickup_location: body.pickup_location,
      pickup_datetime: body.pickup_datetime,
      customer_offer_price: body.customer_offer_price,
      status: 'pending_driver_response',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send SMS to driver
  // await sendSMS(driver.phone, `New booking request...`)

  return NextResponse.json({ booking: data })
}
```

### 6. Cashfree Payment
```typescript
// app/api/payments/create-order/route.ts
import { Cashfree } from 'cashfree-pg'
import { NextResponse } from 'next/server'

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID!
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET!
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX

export async function POST(request: Request) {
  const { booking_id, amount, customer_phone, customer_name } = await request.json()

  const orderRequest = {
    order_amount: amount,
    order_currency: 'INR',
    order_id: `ORDER_${booking_id}`,
    customer_details: {
      customer_id: customer_phone,
      customer_phone: customer_phone,
      customer_name: customer_name,
    },
    order_meta: {
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/${booking_id}/payment-success`,
    },
  }

  try {
    const response = await Cashfree.PGCreateOrder('2023-08-01', orderRequest)
    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
```

---

## 📱 TESTING CHECKLIST

### Before Launch:
- [ ] Customer can register with phone OTP
- [ ] Search shows vehicles correctly
- [ ] Booking creation works
- [ ] Driver receives SMS notification
- [ ] Driver can accept/counter/reject
- [ ] Customer receives SMS confirmation
- [ ] Payment works (test mode)
- [ ] Driver contact revealed 2hr before (test with 2min)
- [ ] Admin can approve vehicles
- [ ] All pages mobile-responsive

---

## 🚀 POST-LAUNCH (Week 2)

### Day 8-10: Onboard First Drivers
```bash
✅ Add uncle's 10 vehicles
✅ Add family friend's 5 vehicles
✅ Approve all as admin
✅ Test booking with real drivers
```

### Day 11-14: Marketing
```bash
✅ Post in Facebook groups (Jaipur wedding groups)
✅ Create Instagram page
✅ Print 100 pamphlets (₹500)
✅ Give to wedding planners
✅ First 10 customers: ₹500 discount
```

---

## 💡 PRO TIPS

1. **Start with Cash Payments**
   - Let first 10 bookings be cash
   - Test payment gateway with small amounts first

2. **Manual Admin Approval Initially**
   - You approve all vehicles personally
   - Check photos quality
   - Verify documents

3. **Use WhatsApp Groups**
   - Create group with all drivers
   - Send booking requests there too
   - Faster response than SMS

4. **Monitor Supabase Dashboard**
   - Check "Logs" daily
   - Watch for errors
   - Monitor database size

5. **Backup Database Weekly**
   ```sql
   -- Run in Supabase SQL Editor
   -- Export as CSV
   SELECT * FROM bookings;
   SELECT * FROM vehicles;
   ```

---

## 🆘 TROUBLESHOOTING

### Problem: Supabase RLS blocking queries
**Solution:** Check if user is authenticated
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user) // Should not be null
```

### Problem: SMS not sending
**Solution:** 
- Verify MSG91 balance
- Check phone format: +91XXXXXXXXXX
- Test with your own phone first

### Problem: Payment webhook not working
**Solution:**
- Cashfree needs public URL
- Use ngrok for local testing: `ngrok http 3000`
- Set webhook URL in Cashfree dashboard

### Problem: Images not uploading
**Solution:**
- Check Supabase Storage policies
- Verify file size < 5MB
- Check file extension (.jpg, .png only)

---

## 📞 NEED HELP?

**Supabase Docs:** https://supabase.com/docs
**Cashfree Docs:** https://docs.cashfree.com
**Next.js Docs:** https://nextjs.org/docs
**Shadcn UI:** https://ui.shadcn.com

---

## 🎯 SUCCESS METRICS (First Month)

**Week 1-2:**
- 10 drivers onboarded
- 20 vehicles approved
- 5 test bookings

**Week 3-4:**
- 50 bookings target
- 30 drivers onboarded
- 60 vehicles approved
- ₹3L GMV

**Month 1 Total:**
- 100 bookings
- ₹10L GMV
- ₹1L revenue (10% commission)
- Break-even achieved! ✅

---

**YOU'RE READY TO BUILD! 🚀**

Start with Day 1 tomorrow. Follow this guide step-by-step.
You'll have a working product in 7 days!

Good luck! 💪
