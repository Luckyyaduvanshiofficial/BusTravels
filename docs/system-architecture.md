# 🏗️ SYSTEM ARCHITECTURE - HIGH LEVEL

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Customer   │  │    Driver    │  │    Admin     │ │
│  │   Web/Mobile │  │  Dashboard   │  │  Dashboard   │ │
│  │  (Next.js)   │  │  (Next.js)   │  │  (Next.js)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS/REST API
┌─────────────────────▼───────────────────────────────────┐
│            APPLICATION LAYER (Vercel)                   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js 14 App Router                    │  │
│  │                                                   │  │
│  │  • API Routes (/api/*)                          │  │
│  │  • Server Components (SSR)                      │  │
│  │  • Client Components (CSR)                      │  │
│  │  • Middleware (Auth Check)                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┐
        │             │             │              │
┌───────▼──────┐ ┌───▼────────┐ ┌─▼──────────┐ ┌─▼────────┐
│   Supabase   │ │  Cashfree  │ │   MSG91    │ │ Leaflet  │
│    Cloud     │ │  Payment   │ │    SMS     │ │   Maps   │
│              │ │  Gateway   │ │            │ │          │
│ • Postgres   │ │            │ │ • OTP      │ │ • Free   │
│ • Auth       │ │ • Orders   │ │ • Booking  │ │ • No API │
│ • Storage    │ │ • Webhook  │ │   Alerts   │ │   Key    │
│ • Realtime   │ │ • 1.95%    │ │ • Contact  │ │          │
│ • FREE 500MB │ │   Fee      │ │   Reveal   │ │          │
└──────────────┘ └────────────┘ └────────────┘ └──────────┘

┌────────────────────────────────────────────────────────┐
│                 DEPLOYMENT LAYER                       │
│                                                         │
│  ┌──────────────────────┐    ┌──────────────────────┐ │
│  │   Vercel (Frontend)  │    │  Supabase (Backend)  │ │
│  │   • FREE Hosting     │    │  • FREE 500MB DB     │ │
│  │   • Auto Deploy      │    │  • FREE 1GB Storage  │ │
│  │   • CDN Included     │    │  • FREE 50K Users    │ │
│  └──────────────────────┘    └──────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

## Key Features:
- **Zero Backend Framework**: No Django, No Express, just Next.js
- **One Codebase**: Frontend + API routes in same repo
- **Zero Cost**: Vercel + Supabase free tiers
- **4 Week Timeline**: Rapid development
