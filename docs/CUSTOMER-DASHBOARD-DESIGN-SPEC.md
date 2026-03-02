# 🎨 CUSTOMER DASHBOARD DESIGN SPECIFICATION

**Platform:** Bus Rental Booking Platform - Customer Portal  
**Target Users:** Customers who have booked or want to book buses  
**Primary Use Cases:** View bookings, Track status, Make payments, Rate trips  
**Design Style:** Clean, Personal, Mobile-First, Trust-Building  

---

## 🎯 DESIGN PHILOSOPHY

### Customer Dashboard Goals:
✅ **Make customers feel in control** - Clear status, contact info accessible  
✅ **Reduce support calls** - Self-service for common questions  
✅ **Build trust** - Show driver info, vehicle details, clear pricing  
✅ **Encourage rebooking** - Easy to book again, loyalty rewards visible  
✅ **Mobile-first** - Most customers will access on phones  

### NOT Generic Admin Panel ❌
- No boring tables
- No confusing tech jargon
- No cluttered interface

### INSTEAD: Personal Travel Dashboard ✅
- **Card-based layout** (WhatsApp/Instagram style)
- **Visual trip cards** (photos, maps, timeline)
- **Conversational language** ("Your trip starts in 2 hours!")
- **Indian context** (WhatsApp links, UPI payments)

---

## 🎨 COLOR & TYPOGRAPHY

Same as landing page for consistency.

**Design Tokens:**

| Token | Value | Usage |
|---|---|---|
| `saffron` | `#F97316` | Primary CTA, active states, highlights |
| `royalBlue` | `#1E40AF` | Secondary actions, links, info badges |
| `deepPurple` | `#6D28D9` | Completed status, rewards, premium accents |
| `goldAccent` | `#F59E0B` | Star ratings, points, loyalty icons |
| `warmBeige` | `#FEF3C7` | Background tints, rewards card backgrounds |

**Typography Scale:**
- Heading 1: `text-2xl font-bold` (24px, 700)
- Heading 2: `text-xl font-semibold` (20px, 600)
- Body: `text-sm` (14px, 400)
- Caption: `text-xs text-muted-foreground` (12px, 400)

---

## 📐 7 DASHBOARD PAGES

1. **Dashboard Home** - Upcoming trips, quick actions
2. **My Bookings** - All bookings with filters
3. **Booking Detail** - Single booking full info
4. **Past Trips** - History with ratings
5. **Profile** - Personal info, preferences
6. **Payments** - Wallet, payment methods, history
7. **Rewards** - Loyalty points, available rewards

---

## 🏠 DASHBOARD HOME LAYOUT

```
[Welcome Header]
Welcome back, Rajesh! 👋

[Upcoming Trip Card - if exists]
🎉 Your trip is coming up!
[Bus Photo] Jaipur → Bharatpur
March 15, 2026 @ 8:00 AM
⏰ Starts in 2 days, 5 hours
[View Details] [WhatsApp Driver]

[Quick Actions - 4 buttons]
🔍 Book New  📅 My Bookings  ⭐ Past Trips  💳 Pay Pending

[Recent Bookings - Last 3]
Recent Activity
• Jaipur → Khatu Shyam Ji | Confirmed
• Jaipur → Jodhpur | Completed

[Rewards Banner]
🎁 You have 150 points! Book one more trip to unlock ₹500 off
```

---

## 📅 MY BOOKINGS PAGE

```
[Filter Tabs]
All | Upcoming | Pending | Completed | Cancelled

[Booking Cards]
┌────────────────────────────────────┐
│ [Photo] Jaipur → Bharatpur        │
│         #BUS12345                  │
│         March 15, 8:00 AM          │
│         White Innova Crysta        │
│         Status: Confirmed ✅        │
│         ₹9,000 (Paid) 💳           │
│ [View] [WhatsApp] [Cancel]        │
└────────────────────────────────────┘
```

**Key Features:**
- Status badges with colors (Green=Confirmed, Yellow=Pending)
- Photos for visual recognition
- Quick actions (WhatsApp driver, Cancel)
- Empty state: "No bookings yet! Start your journey"

---

## 🔍 BOOKING DETAIL PAGE

```
[Back Button] ← Back to Bookings

Booking #BUS12345

[Status Timeline]
✅ Booking Created (March 1, 10:30 AM)
✅ Driver Accepted (March 1, 11:45 AM)
✅ Payment Received (March 1, 12:00 PM)
⏳ Trip Pending (March 15, 8:00 AM)

[Trip Details Card]
📍 Pickup: Jaipur Railway Station (March 15, 8:00 AM)
📍 Dropoff: Bharatpur Bus Stand (11:00 AM approx)
👥 Passengers: 6 people
💼 Trip Type: One-way
📝 Your Notes: "Need child seats"

[Vehicle Card]
[Large Photo] White Innova Crysta
Registration: RJ-14-AB-1234
Seating: 7 passengers
Amenities: ✓ AC  ✓ Music  ✓ GPS

[Driver Card]
[Avatar] Ramesh Kumar
⭐ 4.8 (125 trips)
Driver since: 2020
📞 Contact: Hidden until 2hr before trip
⏰ Contact reveals at 6:00 AM
[WhatsApp Driver] (Enabled 2hr before)

> **Enforcement rules:**
> - Phone number and WhatsApp button are hidden/disabled until T−2 hours before trip start.
> - The countdown label (e.g. "Contact reveals at 6:00 AM") is always visible so the customer knows when to expect access.
> - `rating` and `totalTrips` are optional — the card must render gracefully when either field is absent (no empty stars, no zero-trip display).
> - Required fields: driver name and avatar placeholder. All other fields degrade gracefully.

[Payment Card]
Base Price:        ₹8,500
Distance:          ₹2,160
Discount:         -₹1,660
Final Amount:      ₹9,000 ✅
Payment: UPI (Google Pay)
[Download Receipt]

[Action Buttons]
[Need Help?] [Cancel Booking] [Share]
```

---

## ⭐ PAST TRIPS PAGE

```
[Sort & Filter]
Sort by: Recent first ▼

[Completed Trip Cards]
┌────────────────────────────────────┐
│ [Photo] Jaipur → Khatu Shyam Ji   │
│         March 10, 2026             │
│         Tempo Traveller            │
│         ⭐ 4.8 (You rated)         │
│ [View Receipt] [Book Again]       │
└────────────────────────────────────┘

[Stats Card]
📊 Your Journey Stats
Total Trips: 12
Total Distance: 2,450 km
Favorite Route: Jaipur → Khatu (5x)
Member Since: January 2026
```

---

## 👤 PROFILE PAGE

```
[Profile Header]
[Avatar] Rajesh Kumar
+91-9876543210
Member since: Jan 2026
[Edit Profile]

[Personal Information]
Full Name: Rajesh Kumar
Phone: +91-9876543210 ✅ Verified
Email: rajesh@example.com
Date of Birth: Jan 15, 1985
Address: Jaipur, Rajasthan

[Preferences]
Language: Hindi + English
Notifications: SMS ✅ Email ✅ Push ❌
Default Passengers: 6

[Security]
Change Password
Two-Factor Authentication
Trusted Devices

[Account Actions]
[Download My Data]
[Delete Account]
```

---

## 💳 PAYMENTS & WALLET

```
[Wallet Balance]
💰 Wallet Balance
₹0
[Add Money] [View History]

[Saved Payment Methods]
💳 UPI: rajesh@oksbi [Default]
💳 Card: **** 1234 (VISA) Expires: 12/28
[+ Add Payment Method]

[Transaction History]
✅ Payment Successful
   Booking #BUS12345
   March 1, 2026
   ₹9,000
   [Download Receipt]

⏳ Payment Pending
   Booking #BUS12346
   ₹5,000
   [Pay Now]
```

---

## 🎁 REWARDS & LOYALTY

```
[Points Card]
🎉 Your Points
150 points
📈 Progress: [████████░░░░] 150/200
Earn 50 more for ₹500 off!

[Available Rewards]
🎁 ₹500 OFF (200 points) [50 more needed]
🎁 Free Upgrade (300 points) [Locked]

[How to Earn]
📍 Complete trip: 50 points
⭐ Rate trip: 10 points
👥 Refer friend: 100 points
[Invite Friends]
```

---

## 📱 MOBILE NAVIGATION

**Bottom Tab Bar (Mobile):**
```
🏠       📅        ⭐       👤       💳
Home   Bookings  Past    Profile  Payments
```

> **Note:** The 5th tab links directly to `/customer/payments` (not a generic overflow menu). The label "Payments" is specific and actionable — avoid generic labels like "More".

**Desktop Sidebar:**
```
[Logo]

🏠 Dashboard
📅 My Bookings
⭐ Past Trips
👤 Profile
💳 Payments
🎁 Rewards
❓ Help

[Sign Out]
```

---

## 🎭 KEY COMPONENTS

### Booking Status Badge:
```
Confirmed:  Green pill ✅
Pending:    Yellow pill ⏳
Cancelled:  Red pill ❌
Completed:  Purple pill 🎉
```

### Modal: Rate Trip
```
Rate Your Trip
⭐⭐⭐⭐⭐ (Click to rate)
[Write review text area]
Upload Photos (optional)
[Cancel] [Submit Review]
```

### Modal: Cancel Booking
```
Cancel Booking
⚠️ Cancellation Policy:
• 48+ hours: Full refund
• 24-48 hours: 50% refund
• < 24 hours: No refund

Reason: [Dropdown]
[Go Back] [Confirm Cancellation]
```

### Notification Toast:
```
✅ Booking Confirmed!
Your trip is scheduled for March 15
[View Details] [Dismiss]
```

---

## 🎨 DESIGN TOKENS

**Spacing:** 4, 8, 16, 24, 32, 48, 64, 80px  
**Border Radius:** 8px (small), 12px (medium), 16px (large)  
**Shadows:**
- sm: 0 2px 8px rgba(0,0,0,0.04)
- md: 0 4px 16px rgba(0,0,0,0.08)
- lg: 0 10px 40px rgba(0,0,0,0.12)

---

## 📱 MOBILE OPTIMIZATIONS

1. **Bottom tab navigation** (5 tabs)
2. **Swipe gestures** for card actions
3. **Larger touch targets** (48×48px min)
4. **Pull-to-refresh** on lists
5. **Native pickers** for date/time
6. **WhatsApp direct link** (no modal)
7. **Floating Action Button** for quick book

---

## 🎯 INTERACTIONS

**Hover Effects:**
- Buttons: Scale 1.02x, shadow increase
- Cards: Lift 4px, shadow increase

**Animations:**
- Page transitions: Fade + slide (300ms)
- Status change: Pulse animation
- Points earned: Confetti burst
- Loading: Skeleton screens
- Pull-to-refresh: Spinning bus icon

---

## ✅ DESIGN CHECKLIST

- [ ] All text readable (4.5:1 contrast)
- [ ] Touch targets 48×48px minimum
- [ ] Icons consistent style
- [ ] Error states designed
- [ ] Loading states designed
- [ ] Empty states designed
- [ ] Mobile responsive (375px, 768px, 1440px)
- [ ] Component library created

---

## 📦 DELIVERABLES

1. Figma file (editable)
2. Style guide
3. Component library
4. Desktop mockups (7 pages)
5. Mobile mockups (7 pages)
6. Clickable prototype

---

## 💰 COST & TIMELINE

**Hire Designer:** ₹5,000-8,000 | 5-7 days  
**DIY Figma:** ₹0 | 10-14 days  
**AI Tools:** ₹1,500 | 3-4 days  

---

**CUSTOMER DASHBOARD SPEC COMPLETE! 🎨**

Ready for designer implementation!
