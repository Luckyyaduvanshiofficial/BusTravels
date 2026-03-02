# 🔌 API ROUTES STRUCTURE

## Complete Next.js API Endpoints

```
/api/
├── auth/
│   ├── send-otp (POST)
│   ├── verify-otp (POST)
│   └── logout (POST)
│
├── vehicles/
│   ├── search (GET)
│   ├── [id] (GET)
│   ├── create (POST)
│   ├── [id]/update (PATCH)
│   ├── [id]/delete (DELETE)
│   └── upload-photo (POST)
│
├── bookings/
│   ├── create (POST)
│   ├── [id] (GET)
│   ├── my-bookings (GET)
│   ├── [id]/accept (PATCH)
│   ├── [id]/counter (PATCH)
│   ├── [id]/reject (PATCH)
│   ├── [id]/cancel (PATCH)
│   └── [id]/complete (PATCH)
│
├── payments/
│   ├── create-order (POST)
│   ├── webhook (POST)
│   └── verify (POST)
│
├── admin/
│   ├── drivers/approve (PATCH)
│   ├── vehicles/approve (PATCH)
│   └── stats (GET)
│
└── notifications/
    ├── send-sms (POST)
    └── reveal-contact (POST)
```

## Detailed API Specifications

### Authentication APIs

#### POST /api/auth/send-otp
Send OTP to phone number
```typescript
Request:
{
  phone_number: "+919876543210"
}

Response:
{
  success: true,
  message: "OTP sent successfully"
}
```

#### POST /api/auth/verify-otp
Verify OTP and create session
```typescript
Request:
{
  phone_number: "+919876543210",
  otp: "123456"
}

Response:
{
  success: true,
  user: {
    id: "uuid",
    phone_number: "+919876543210",
    role: "customer"
  },
  session: {
    access_token: "jwt-token",
    refresh_token: "refresh-token"
  }
}
```

#### POST /api/auth/logout
Logout user
```typescript
Response:
{
  success: true,
  message: "Logged out successfully"
}
```

---

### Vehicle APIs

#### GET /api/vehicles/search
Search available vehicles
```typescript
Query Parameters:
{
  vehicle_type?: "innova" | "tempo_traveller" | "mini_bus",
  seating_capacity?: number,
  pickup_date?: "2026-03-15",
  operating_city?: "Jaipur"
}

Response:
{
  vehicles: [
    {
      id: "uuid",
      vehicle_name: "White Innova Crysta",
      vehicle_type: "innova",
      seating_capacity: 7,
      base_price_per_day: 5000,
      price_per_km: 12,
      amenities: ["AC", "Music"],
      photos: ["url1", "url2"],
      driver: {
        name: "Ramesh Kumar",
        rating: 4.5
      }
    }
  ]
}
```

#### GET /api/vehicles/[id]
Get vehicle details
```typescript
Response:
{
  vehicle: {
    id: "uuid",
    vehicle_name: "White Innova Crysta",
    registration_number: "RJ-14-AB-1234",
    seating_capacity: 7,
    base_price_per_day: 5000,
    price_per_km: 12,
    amenities: ["AC", "Music System", "GPS"],
    photos: ["url1", "url2", "url3"],
    operating_cities: ["Jaipur", "Jodhpur"],
    driver: {
      id: "uuid",
      name: "Ramesh Kumar",
      rating: 4.5,
      total_trips: 125
    }
  }
}
```

#### POST /api/vehicles/create
Create new vehicle (Driver only)
```typescript
Request:
{
  vehicle_type: "innova",
  vehicle_name: "White Innova Crysta",
  registration_number: "RJ-14-AB-1234",
  seating_capacity: 7,
  base_price_per_day: 5000,
  price_per_km: 12,
  amenities: ["AC", "Music System"],
  operating_cities: ["Jaipur", "Jodhpur"],
  photos: ["url1", "url2", "url3", "url4", "url5", "url6"]
}

Response:
{
  vehicle: { ...created vehicle }
}
```

#### POST /api/vehicles/upload-photo
Upload vehicle photo
```typescript
Request: FormData (multipart/form-data)
{
  file: File,
  vehicle_id: "uuid"
}

Response:
{
  url: "https://supabase.co/storage/v1/object/public/vehicle-photos/abc.jpg"
}
```

---

### Booking APIs

#### POST /api/bookings/create
Create new booking
```typescript
Request:
{
  vehicle_id: "uuid",
  pickup_location: "Jaipur Railway Station",
  dropoff_location: "Bharatpur",
  pickup_datetime: "2026-03-15T08:00:00Z",
  return_datetime: null,
  trip_type: "one_way",
  passenger_count: 6,
  customer_offer_price: 8500,
  customer_notes: "Need child seats"
}

Response:
{
  booking: {
    id: "uuid",
    booking_code: "BUS12345",
    status: "pending_driver_response",
    customer_offer_price: 8500,
    created_at: "2026-03-01T10:00:00Z"
  }
}
```

#### GET /api/bookings/[id]
Get booking details
```typescript
Response:
{
  booking: {
    id: "uuid",
    booking_code: "BUS12345",
    status: "accepted",
    pickup_location: "Jaipur Railway Station",
    dropoff_location: "Bharatpur",
    pickup_datetime: "2026-03-15T08:00:00Z",
    customer_offer_price: 8500,
    final_agreed_price: 9000,
    payment_status: "paid",
    customer: {
      name: "Raj Kumar",
      phone: "+919876543210" // Only if revealed
    },
    driver: {
      name: "Ramesh Kumar",
      phone: "+919876543211", // Only if revealed
      rating: 4.5
    },
    vehicle: {
      name: "White Innova Crysta",
      photos: ["url1"]
    }
  }
}
```

#### GET /api/bookings/my-bookings
Get user's bookings
```typescript
Query Parameters:
{
  status?: "pending_driver_response" | "accepted" | "completed"
}

Response:
{
  bookings: [
    {
      id: "uuid",
      booking_code: "BUS12345",
      status: "accepted",
      pickup_datetime: "2026-03-15T08:00:00Z",
      final_agreed_price: 9000,
      vehicle: {
        name: "White Innova Crysta",
        photo: "url1"
      }
    }
  ]
}
```

#### PATCH /api/bookings/[id]/accept
Driver accepts booking
```typescript
Response:
{
  booking: { ...updated booking with status: "accepted" }
}
```

#### PATCH /api/bookings/[id]/counter
Driver counters with different price
```typescript
Request:
{
  counter_price: 9000,
  driver_notes: "Best price I can offer"
}

Response:
{
  booking: { ...updated booking with status: "driver_countered" }
}
```

#### PATCH /api/bookings/[id]/reject
Driver rejects booking
```typescript
Request:
{
  rejection_reason: "Already booked for that date"
}

Response:
{
  booking: { ...updated booking with status: "rejected" }
}
```

#### PATCH /api/bookings/[id]/cancel
Customer cancels booking
```typescript
Response:
{
  booking: { ...updated booking with status: "customer_cancelled" }
}
```

#### PATCH /api/bookings/[id]/complete
Mark booking as completed
```typescript
Response:
{
  booking: { ...updated booking with status: "completed" }
}
```

---

### Payment APIs

#### POST /api/payments/create-order
Create Cashfree payment order
```typescript
Request:
{
  booking_id: "uuid",
  amount: 9000
}

Response:
{
  payment_session_id: "session_xxx",
  order_id: "ORDER_uuid",
  payment_url: "https://cashfree.com/checkout/..."
}
```

#### POST /api/payments/webhook
Cashfree webhook (called by Cashfree)
```typescript
Request: (Cashfree payload)
{
  type: "PAYMENT_SUCCESS_WEBHOOK",
  data: {
    order: {
      order_id: "ORDER_uuid",
      order_amount: 9000
    },
    payment: {
      cf_payment_id: "pay_xxx",
      payment_status: "SUCCESS"
    }
  }
}

Response:
{
  success: true
}
```

#### POST /api/payments/verify
Verify payment status
```typescript
Request:
{
  order_id: "ORDER_uuid"
}

Response:
{
  status: "success",
  payment: {
    amount: 9000,
    status: "success",
    created_at: "2026-03-01T10:30:00Z"
  }
}
```

---

### Admin APIs

#### PATCH /api/admin/drivers/approve
Approve driver
```typescript
Request:
{
  driver_id: "uuid"
}

Response:
{
  success: true,
  message: "Driver approved"
}
```

#### PATCH /api/admin/vehicles/approve
Approve vehicle
```typescript
Request:
{
  vehicle_id: "uuid"
}

Response:
{
  success: true,
  message: "Vehicle approved"
}
```

#### GET /api/admin/stats
Get platform statistics
```typescript
Response:
{
  total_bookings: 450,
  total_revenue: 3500000,
  active_drivers: 45,
  active_vehicles: 78,
  pending_approvals: {
    drivers: 3,
    vehicles: 5
  },
  bookings_by_status: {
    pending_driver_response: 12,
    accepted: 25,
    completed: 380,
    rejected: 33
  }
}
```

---

### Notification APIs

#### POST /api/notifications/send-sms
Send SMS notification
```typescript
Request:
{
  phone_number: "+919876543210",
  message: "Your booking #BUS12345 is confirmed!"
}

Response:
{
  success: true,
  message_id: "msg_xxx"
}
```

#### POST /api/notifications/reveal-contact
Reveal driver contact (2hr before trip)
```typescript
Request:
{
  booking_id: "uuid"
}

Response:
{
  driver_phone: "+919876543211",
  revealed_at: "2026-03-15T06:00:00Z"
}
```

---

## Error Responses

All APIs follow consistent error format:
```typescript
{
  error: true,
  message: "Error description",
  code: "ERROR_CODE"
}
```

Common Error Codes:
- `AUTH_REQUIRED`: User not authenticated
- `UNAUTHORIZED`: User doesn't have permission
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `ALREADY_EXISTS`: Duplicate entry
- `PAYMENT_FAILED`: Payment processing error

## Rate Limiting

- Authentication: 10 requests/minute per IP
- Search: 60 requests/minute per user
- Booking creation: 10 requests/hour per user
- Other endpoints: 100 requests/minute per user

