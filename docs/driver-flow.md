# 🚗 DRIVER ONBOARDING & BOOKING FLOW

## From Registration to Getting Paid

```
┌─────────────────────────────────────────────────────────┐
│               DRIVER JOURNEY                            │
└─────────────────────────────────────────────────────────┘

[1] Register Account
    │
    ├─→ Visit: /register
    ├─→ Select Role: "I'm a Driver"
    ├─→ Enter: Phone Number (+91-9876543210)
    ├─→ Click: "Send OTP"
    └─→ Enter: 6-digit OTP
    
        ↓ (Account Created)

[2] Add Vehicle Details
    │
    ├─→ Enter: Vehicle Type (Innova / Tempo / Mini Bus / Volvo)
    ├─→ Enter: Vehicle Name ("White Innova Crysta")
    ├─→ Enter: Registration Number (RJ-14-XX-1234)
    ├─→ Enter: Seating Capacity (7)
    ├─→ Enter: Base Price (₹5,000/day)
    ├─→ Enter: Price per KM (₹12/km)
    └─→ Select: Operating Cities (Jaipur, Jodhpur)
    
        ↓

[3] Upload Photos
    │
    ├─→ Upload: Front view
    ├─→ Upload: Back view
    ├─→ Upload: Interior (seats)
    ├─→ Upload: Dashboard
    ├─→ Upload: Registration Certificate (RC)
    ├─→ Upload: Fitness Certificate
    └─→ Minimum: 6 photos required
    
        ↓ (Submitted to Admin)

[4] Wait for Admin Approval
    │
    ├─→ Status: "Pending Verification"
    ├─→ Show: "Admin will review within 24-48 hours"
    ├─→ Email/SMS: "Vehicle submitted for approval"
    └─→ Note: Cannot receive bookings yet
    
        ↓ (Admin reviews photos, documents)

[5] APPROVED! ✅
    │
    ├─→ Status: "Vehicle Approved"
    ├─→ SMS: "Congratulations! Your vehicle is now live"
    ├─→ Vehicle now visible to customers
    └─→ Can receive booking requests
    
        ↓

┌─────────────────────────────────────────────────────────┐
│           HANDLING BOOKING REQUESTS                     │
└─────────────────────────────────────────────────────────┘

[6] Receive Booking Request
    │
    ├─→ SMS Alert: "New booking request from Raj Kumar"
    ├─→ SMS Details: "Jaipur → Bharatpur, March 15, ₹8,500 offered"
    └─→ SMS: "Check your dashboard to respond"
    
        ↓

[7] View Request in Dashboard
    │
    ├─→ Open: /driver/dashboard
    ├─→ See: Booking Request Card
    ├─→ Show Customer: Name, Phone (hidden), Location
    ├─→ Show Trip: Pickup, Dropoff, Date, Time
    ├─→ Show Price: Customer Offer ₹8,500
    ├─→ Show Base Price: Your Base Price ₹10,000
    └─→ Note: "Customer negotiating lower price"
    
        ↓

[8] Evaluate Offer
    │
    ├─→ Question: Is ₹8,500 acceptable?
    ├─→ Consider: Distance, Date, Alternative bookings
    ├─→ Calculate: Fuel cost, Driver wages, Profit
    └─→ Decision Time!
    
        ↓
    ┌───┴────────────────────────────────┐
    │                                    │
    ▼                                    ▼
[9A] ACCEPT                      [9B] COUNTER OFFER                [9C] REJECT
     │                                  │                                │
     └─→ Click: "Accept ₹8,500"        ├─→ Enter: ₹9,000               ├─→ Select: Reason
     └─→ Status: accepted               ├─→ Add: "Best price I can do"  │   • Already booked
                                        └─→ Click: "Send Counter"        │   • Route not feasible
                                        └─→ Status: driver_countered     │   • Price too low
                                                                         └─→ Click: "Reject"
                                                                         └─→ Status: rejected
        ↓                                       ↓                               ↓
                                                                         (Customer notified)
    (Customer gets SMS:              (Customer gets SMS:                (Booking closed)
     "Booking confirmed!")            "Driver countered ₹9,000")
    
        ↓                                       ↓
                                         [Customer accepts?]
                                                ↓
                                         YES → Status: accepted
                                         NO → Browse other vehicles
                                        
        ↓

[10] Customer Confirms Payment
     │
     ├─→ Option A: Customer pays online
     │   └─→ SMS: "Payment ₹8,500 received for #BUS12345"
     │   └─→ Dashboard: Payment Status: PAID ✅
     │
     └─→ Option B: Customer pays cash
         └─→ Dashboard: Payment Status: Cash on delivery
    
         ↓

[11] 2 Hours Before Trip
     │
     ├─→ Auto SMS to Customer: "Your trip starts soon! Driver: [Your Name], Phone: +91-XXX"
     ├─→ Your Contact Number: NOW REVEALED to customer
     ├─→ Dashboard: "Trip starting soon" notification
     └─→ Note: Customer can now call you directly
    
         ↓

[12] Trip Day
     │
     ├─→ Call Customer: Confirm pickup location & time
     ├─→ Arrive at Location: On time
     ├─→ Pick up Customer
     ├─→ Complete Trip: Drive to destination
     └─→ Drop off Customer: Safe & sound
    
         ↓

[13] Mark as Completed
     │
     ├─→ Open: /driver/dashboard
     ├─→ Find: Booking #BUS12345
     ├─→ Click: "Mark as Completed"
     ├─→ Confirm: Trip finished
     └─→ Status: completed ✅
    
         ↓

[14] Receive Payment
     │
     ├─→ If Online Payment:
     │   └─→ Money already in your account
     │   └─→ View in: /driver/earnings
     │   └─→ See: "₹8,500 received via Cashfree"
     │
     └─→ If Cash Payment:
         └─→ Collect: ₹8,500 cash from customer
         └─→ Mark: "Cash received" in dashboard
    
         ↓

[15] Wait for Customer Review (Optional)
     │
     ├─→ Customer may rate you 1-5 stars
     ├─→ Customer may write review
     ├─→ Your rating updates: 4.5★ → 4.6★
     └─→ Good ratings = More bookings! 🎉
    
         ↓

    DONE! Ready for next booking 🚗

```

## Driver Dashboard Features:

### Pending Requests Tab:
```
┌────────────────────────────────────────┐
│  📋 BOOKING REQUEST #BUS12345          │
├────────────────────────────────────────┤
│  Customer: Raj Kumar                   │
│  Route: Jaipur → Bharatpur             │
│  Date: March 15, 2026 @ 8:00 AM        │
│  Passengers: 6 people                  │
│  Customer Offer: ₹8,500                │
│  Your Base Price: ₹10,000              │
│                                        │
│  [Accept ₹8,500]  [Counter: ₹___]  [❌ Reject]
└────────────────────────────────────────┘
```

### Upcoming Trips Tab:
```
┌────────────────────────────────────────┐
│  ✅ CONFIRMED BOOKING #BUS12345        │
├────────────────────────────────────────┤
│  Customer: Raj Kumar (+91-98765-43210) │
│  Route: Jaipur → Bharatpur             │
│  Date: March 15, 2026 @ 8:00 AM        │
│  Payment: ₹8,500 (PAID) ✅             │
│  Status: Confirmed                     │
│                                        │
│  [View Details]  [Mark Completed]      │
└────────────────────────────────────────┘
```

### Earnings Tab:
```
┌────────────────────────────────────────┐
│  💰 EARNINGS SUMMARY                   │
├────────────────────────────────────────┤
│  This Month: ₹45,000                   │
│  Total Bookings: 8                     │
│  Pending Payments: ₹0                  │
│                                        │
│  Recent Transactions:                  │
│  • March 15: ₹8,500 (PAID)            │
│  • March 12: ₹12,000 (PAID)           │
│  • March 8: ₹6,500 (PAID)             │
└────────────────────────────────────────┘
```

## Key Benefits for Drivers:

✅ **No Commission (MVP)**: Keep 100% of earnings
✅ **Flexible Pricing**: Accept or negotiate every booking
✅ **Your Schedule**: Accept only trips you want
✅ **Contact Protected**: Customer gets number 2hr before trip only
✅ **Easy Dashboard**: Manage everything from web browser
✅ **Instant Notifications**: SMS alerts for every new request
✅ **Payment Tracking**: See all earnings in one place

