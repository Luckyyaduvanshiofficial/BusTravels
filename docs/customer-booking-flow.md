# 🛒 CUSTOMER BOOKING FLOW

## Complete Journey from Search to Trip Completion

```
┌─────────────────────────────────────────────────────────┐
│                 CUSTOMER JOURNEY                        │
└─────────────────────────────────────────────────────────┘

[1] Land on Homepage
    │
    ├─→ Search Bar: "Where do you want to go?"
    ├─→ Vehicle Type Selector: Innova / Tempo / Bus
    └─→ Date Picker
    
        ↓

[2] Search Vehicle
    │
    ├─→ Enter: Pickup Location (Jaipur Railway Station)
    ├─→ Enter: Destination (Bharatpur) [Optional]
    ├─→ Select: Date (March 15, 2026)
    └─→ Select: Passenger Count (40)
    
        ↓

[3] Browse Results
    │
    ├─→ Show: 8 matching vehicles
    ├─→ Filter: Vehicle Type, Price Range, Amenities
    ├─→ Sort: Price (Low to High), Rating, Capacity
    └─→ Display: Photos, Price, Driver Name, Rating
    
        ↓

[4] View Vehicle Details
    │
    ├─→ Show: 6+ Photos (Gallery)
    ├─→ Show: Amenities (AC, Music, WiFi)
    ├─→ Show: Base Price (₹10,000/day)
    ├─→ Show: Driver Info (Name, Rating 4.5★)
    └─→ Show: "Book Now" Button
    
        ↓

[5] Enter Trip Details
    │
    ├─→ Confirm: Pickup Location
    ├─→ Confirm: Pickup Date & Time
    ├─→ Optional: Dropoff Location
    ├─→ Optional: Return Date (Round Trip)
    ├─→ Enter: Passenger Count
    └─→ Optional: Special Notes ("Need child seats")
    
        ↓

[6] Propose Price
    │
    ├─→ See: Base Price ₹10,000
    ├─→ Enter: Your Offer ₹8,500
    ├─→ Optional: Add Message to Driver
    └─→ Click: "Send Request to Driver"
    
        ↓

[7] Wait for Driver Response
    │
    ├─→ Status: "Pending Driver Response"
    ├─→ Show: "We've sent your request to [Driver Name]"
    ├─→ Show: "You'll get SMS when driver responds"
    └─→ Time: Average response < 2 hours
    
        ↓ (SMS: "Driver accepted your booking!")

[8] Driver Accepts/Counters
    │
    ├─→ Option A: Driver accepts ₹8,500 → GO TO [9]
    ├─→ Option B: Driver counters ₹9,000 → Customer accepts? → GO TO [9]
    └─→ Option C: Driver rejects → "Browse other vehicles"
    
        ↓

[9] Choose Payment Method
    │
    ├─→ Option A: Pay Online (UPI, Card, NetBanking)
    │   └─→ Redirect to Cashfree → Complete Payment → GO TO [10]
    │
    └─→ Option B: Pay Driver Cash
        └─→ "Pay ₹8,500 to driver after trip" → GO TO [10]
    
        ↓

[10] Get Driver Contact (2hr before trip)
     │
     ├─→ Status: "Booking Confirmed!"
     ├─→ Show: Booking ID (BUS12345)
     ├─→ Show: Trip Summary
     ├─→ Note: "Driver contact will be revealed 2 hours before trip"
     │
     └─→ (2 hours before): SMS arrives with driver's phone number
     
         ↓

[11] Complete Trip
     │
     ├─→ Driver calls customer
     ├─→ Driver picks up at location
     ├─→ Trip happens
     └─→ Driver drops off
     
         ↓

[12] Rate Driver (Optional)
     │
     ├─→ Show: "How was your trip?"
     ├─→ Rate: 1-5 Stars
     ├─→ Optional: Write Review
     └─→ Submit → Done! ✅

```

## Key Decision Points:

### At [6] - Price Negotiation:
- Customer can offer lower than base price
- Driver can accept, counter, or reject
- Negotiation happens in 1-2 rounds

### At [9] - Payment Choice:
- **Online**: Secure, instant confirmation, SMS to driver
- **Cash**: Pay after trip, more flexible

### At [10] - Contact Reveal:
- **WHY DELAYED?** Prevents customer from calling driver directly next time
- **WHEN?** 2 hours before pickup time
- **HOW?** Automated SMS via MSG91

## Database Status Changes:

```
pending_driver_response → driver_countered → accepted → customer_paid → trip_ongoing → completed
                       ↘                  ↘
                         rejected          customer_cancelled
```

## SMS Notifications Sent:

1. **To Driver**: "New booking request from [Customer]. Offered ₹8,500."
2. **To Customer**: "Your booking confirmed! Driver: [Name]."
3. **To Customer**: (2hr before) "Your trip starts soon! Driver: [Name], Phone: +91-XXX"
4. **To Driver**: (if paid online) "Payment ₹8,500 received for booking #BUS12345"

