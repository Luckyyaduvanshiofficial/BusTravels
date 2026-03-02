# 🔍 SEARCH & RESULTS PAGE DESIGN SPECIFICATION

**Brand:** CHARTER Bus Rental Platform  
**Pages Covered:** Search Page + Results Page + Filters + Vehicle Detail  
**Design Language:** Matches existing Charter branding  

---

## 🎨 CURRENT DESIGN ANALYSIS

### What's Working Well:
✅ **Dark navy hero section** - Creates strong visual hierarchy  
✅ **Clean white search card** - Good contrast, easy to use  
✅ **Orange CTA button** - High visibility, good brand color  
✅ **Simple footer** - Well-organized links  
✅ **Minimalist approach** - Not cluttered  

### What We'll Enhance:
🔧 **Search inputs** - Add better visual hierarchy  
🔧 **Empty state** - More engaging while waiting  
🔧 **Results page** - Needs full design  
🔧 **Filters** - Advanced filtering options  
🔧 **Mobile experience** - Optimize for touch  

---

## 🎨 DESIGN SYSTEM (Charter Brand)

### Color Palette
```
PRIMARY:
Navy Blue:       #1E293B  (Hero background, headers)
Deep Blue:       #0F172A  (Text, dark elements)
Orange:          #F97316  (Primary CTA, active states)
Orange Hover:    #EA580C  (Button hover)

NEUTRALS:
White:           #FFFFFF  (Cards, backgrounds)
Light Gray:      #F8FAFC  (Page background)
Border Gray:     #E2E8F0  (Borders, dividers)
Text Gray:       #64748B  (Secondary text)
Dark Text:       #1E293B  (Primary text)

STATUS:
Success Green:   #10B981  (Available, verified)
Warning Yellow:  #F59E0B  (Limited availability)
Error Red:       #EF4444  (Unavailable)
Info Blue:       #3B82F6  (Information)
```

### Typography
```
FONT FAMILY:
Primary: Inter (Body text, UI)
Heading: Inter (Headings)

TYPE SCALE:
Hero Heading:    48px / Bold / Inter
Page Heading:    36px / Bold / Inter
Section Heading: 24px / Semibold / Inter
Card Title:      18px / Semibold / Inter
Body Large:      16px / Regular / Inter
Body:            14px / Regular / Inter
Small:           12px / Regular / Inter
Button:          16px / Medium / Inter
```

### Spacing (Based on 8px grid)
```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

### Component Styles
```
BUTTONS:
Primary (Orange):
  - Background: #F97316
  - Text: White
  - Height: 48px
  - Border radius: 8px
  - Padding: 12px 24px
  - Hover: #EA580C + lift 2px

Secondary (Outline):
  - Border: 2px solid #E2E8F0
  - Text: #1E293B
  - Background: White
  - Hover: Background #F8FAFC

INPUTS:
  - Height: 48px
  - Border: 1px solid #E2E8F0
  - Border radius: 8px
  - Padding: 12px 16px
  - Focus: Border #F97316, Shadow orange glow

CARDS:
  - Background: White
  - Border: 1px solid #E2E8F0
  - Border radius: 12px
  - Shadow: 0 1px 3px rgba(0,0,0,0.1)
  - Hover: Shadow 0 4px 12px rgba(0,0,0,0.1), lift 2px
```

---

## 📄 PAGE 1: SEARCH PAGE (IMPROVED)

### Current State Analysis:
The existing page has a good foundation. Let's enhance it with:
- Better input labels and icons
- More prominent empty state
- Quick filters below search
- Recent searches

### Enhanced Layout:

```
┌─────────────────────────────────────────────────────────┐
│  HEADER                                                  │
│  [🚌 CHARTER]    Buses  My Bookings    [User] [🌓]     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  HERO SECTION (Navy Blue #1E293B)                       │
│  Height: 500px (Desktop) / 400px (Mobile)               │
│                                                          │
│  Find your perfect ride                                 │
│  (48px, Bold, White - slightly lighter than current)    │
│                                                          │
│  Book luxury buses, sleepers, and seaters for your     │
│  next journey across the country with verified          │
│  operators.                                             │
│  (16px, Regular, rgba(255,255,255,0.8))                │
│                                                          │
│  ┌────────────────────────────────────────────────────┐│
│  │  SEARCH CARD (White, elevated)                     ││
│  │  Border radius: 16px                               ││
│  │  Shadow: 0 10px 40px rgba(0,0,0,0.15)            ││
│  │  Padding: 32px                                     ││
│  │                                                     ││
│  │  ┌──────────────┐  ┌──────────────┐              ││
│  │  │ 📍 FROM      │  │ 📍 TO        │              ││
│  │  │ From City    │  │ To City      │              ││
│  │  │ [Input____]  │  │ [Input____]  │              ││
│  │  │              │  │              │              ││
│  │  │ Jaipur       │  │ Delhi        │              ││
│  │  └──────────────┘  └──────────────┘              ││
│  │                                                     ││
│  │  ┌──────────────┐  ┌──────────────┐              ││
│  │  │ 📅 DATE      │  │ 👥 PASSENGERS│              ││
│  │  │ Travel Date  │  │ Number       │              ││
│  │  │ [dd-mm-yyyy] │  │ [1 ▼]       │              ││
│  │  │              │  │              │              ││
│  │  │ 15 Mar 2026  │  │ 6 passengers │              ││
│  │  └──────────────┘  └──────────────┘              ││
│  │                                                     ││
│  │  [🔍 Search Routes]                               ││
│  │  (Full width, Orange #F97316, 56px height)       ││
│  │                                                     ││
│  └────────────────────────────────────────────────────┘│
│                                                          │
│  ┌────────────────────────────────────────────────────┐│
│  │  QUICK FILTERS (Below search card)                ││
│  │  Background: rgba(255,255,255,0.1)                ││
│  │  Border radius: 12px                               ││
│  │  Padding: 16px                                     ││
│  │                                                     ││
│  │  Vehicle Type:                                     ││
│  │  [AC Sleeper] [Non-AC Sleeper] [Seater] [Luxury] ││
│  │  (Pills: White bg, White text outline, clickable) ││
│  │                                                     ││
│  └────────────────────────────────────────────────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  POPULAR ROUTES SECTION                                 │
│  Background: Light Gray #F8FAFC                         │
│  Padding: 80px vertical                                 │
│                                                          │
│  Popular Routes                                         │
│  (36px, Bold, Navy #1E293B)                            │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │              │  │              │  │              │ │
│  │  Delhi →     │  │  Mumbai →    │  │  Jaipur →    │ │
│  │  Jaipur      │  │  Goa         │  │  Delhi       │ │
│  │              │  │              │  │              │ │
│  │  Starting    │  │  Starting    │  │  Starting    │ │
│  │  ₹800        │  │  ₹1,200      │  │  ₹750        │ │
│  │              │  │              │  │              │ │
│  │  [View Buses]│  │  [View Buses]│  │  [View Buses]│ │
│  │              │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  (6-8 popular route cards, horizontally scrollable)     │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  WHY CHOOSE CHARTER SECTION                             │
│  Background: White                                      │
│  Padding: 80px vertical                                 │
│                                                          │
│  Why choose Charter?                                    │
│  (36px, Bold, Navy)                                     │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  ✅          │  │  🛡️          │  │  💰          │ │
│  │  Verified    │  │  Safe &      │  │  Best        │ │
│  │  Operators   │  │  Secure      │  │  Prices      │ │
│  │              │  │              │  │              │ │
│  │  All bus     │  │  Licensed    │  │  Compare     │ │
│  │  operators   │  │  drivers &   │  │  prices      │ │
│  │  verified    │  │  insurance   │  │  instantly   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘

[FOOTER - Same as current]
```

### Component Details:

**Search Card:**
- **Width:** 900px max (centered)
- **Layout:** 2×2 grid (desktop), stacked (mobile)
- **Inputs:** 
  - Label: 12px, Semibold, Gray above input
  - Icon: 20×20px, Gray color
  - Placeholder: Light gray
  - Value: Navy text, 16px

**Input States:**
```
Default:
  Border: 1px solid #E2E8F0
  Background: White

Focus:
  Border: 2px solid #F97316
  Shadow: 0 0 0 3px rgba(249,115,22,0.1)
  
Error:
  Border: 2px solid #EF4444
  Helper text: Red, 12px below

Filled:
  Border: 1px solid #10B981
  Icon: Green color
```

**Quick Filter Pills:**
- Size: Auto width, 36px height
- Border: 1px solid rgba(255,255,255,0.3)
- Background: rgba(255,255,255,0.1)
- Text: White, 14px
- Hover: Background rgba(255,255,255,0.2)
- Active: Background #F97316, no border

**Popular Route Cards:**
- Size: 280px × 200px
- Background: White
- Border radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: Shadow increases, lift 4px
- Route text: 20px, Semibold, Navy
- Price: 18px, Bold, Orange
- Button: Outline style

---

## 📄 PAGE 2: SEARCH RESULTS PAGE

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (Sticky)                                         │
│  [🚌 CHARTER]    Buses  My Bookings    [User] [🌓]     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  SEARCH BAR (Sticky, Compact Version)                   │
│  Background: White                                      │
│  Border bottom: 1px solid #E2E8F0                       │
│  Height: 80px                                           │
│  Shadow: 0 2px 8px rgba(0,0,0,0.05)                    │
│                                                          │
│  [📍 Jaipur] → [📍 Delhi] [📅 15 Mar] [👥 6] [🔍]    │
│  (Inline, compact inputs)                [Edit Search]  │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  MAIN CONTENT AREA                                      │
│  Background: #F8FAFC                                    │
│  Layout: Sidebar (25%) + Results (75%)                  │
│                                                          │
│  ┌─────────────┐  ┌──────────────────────────────────┐ │
│  │ FILTERS     │  │ RESULTS AREA                      │ │
│  │ (Sidebar)   │  │                                    │ │
│  │             │  │ ┌──────────────────────────────┐  │ │
│  │ Vehicle     │  │ │ RESULTS HEADER               │  │ │
│  │ Type        │  │ │                                │ │ │
│  │ ☑️ All      │  │ │ 24 buses available            │ │ │
│  │ ☐ AC Sleep  │  │ │ Jaipur → Delhi                │ │ │
│  │ ☐ Non-AC    │  │ │ Wed, 15 Mar 2026              │ │ │
│  │ ☐ Seater    │  │ │                                │ │ │
│  │ ☐ Luxury    │  │ │ Sort by: [Price ▼]            │ │ │
│  │             │  │ │ [🔀 Modify Search]            │ │ │
│  │ Price Range │  │ └──────────────────────────────┘  │ │
│  │ ₹500-₹2000  │  │                                    │ │
│  │ [═══○═══]   │  │ ┌──────────────────────────────┐  │ │
│  │             │  │ │ BUS CARD 1                    │  │ │
│  │ Departure   │  │ │                                │ │ │
│  │ ○ Morning   │  │ │ [Bus Photo] AC Sleeper        │  │ │
│  │ ○ Afternoon │  │ │              Jaipur → Delhi   │  │ │
│  │ ○ Evening   │  │ │                                │ │ │
│  │ ○ Night     │  │ │ 22:00 ──6h──→ 04:00          │  │ │
│  │             │  │ │ Jaipur        Delhi            │  │ │
│  │ Bus Type    │  │ │                                │  │ │
│  │ ☐ Semi-Slp  │  │ │ ⭐ 4.5 (120) ✅ Verified      │  │ │
│  │ ☐ Sleeper   │  │ │ • 2+1 Seating                 │  │ │
│  │ ☐ Seater    │  │ │ • Blankets & Pillows          │  │ │
│  │             │  │ │ • Charging Points             │  │ │
│  │ Amenities   │  │ │ • Water Bottle                │  │ │
│  │ ☐ WiFi      │  │ │                                │  │ │
│  │ ☐ Charging  │  │ │ Starting from                 │  │ │
│  │ ☐ Blanket   │  │ │ ₹850 per seat                 │  │ │
│  │ ☐ Water     │  │ │                                │  │ │
│  │             │  │ │ [View Seats] [View Details]   │  │ │
│  │ Ratings     │  │ └──────────────────────────────┘  │ │
│  │ ⭐ 4+ stars │  │                                    │ │
│  │             │  │ ┌──────────────────────────────┐  │ │
│  │ [Clear All] │  │ │ BUS CARD 2                    │  │ │
│  │             │  │ │ (Similar structure)            │  │ │
│  └─────────────┘  │ └──────────────────────────────┘  │ │
│                    │                                    │ │
│                    │ ┌──────────────────────────────┐  │ │
│                    │ │ BUS CARD 3                    │  │ │
│                    │ │ (Similar structure)            │  │ │
│                    │ └──────────────────────────────┘  │ │
│                    │                                    │ │
│                    │ [Load More (12 more buses)]       │ │
│                    │                                    │ │
│                    └──────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Component Details:

**Sticky Search Bar:**
- Height: 80px
- Background: White with shadow
- Inputs: Compact (36px height)
- Edit button: Text link, orange color
- Collapses to just route + date (mobile)

**Results Header:**
- Count: 24px, Bold, Navy
- Route: 16px, Regular, Gray
- Date: 14px, Regular, Gray
- Sort dropdown: 36px height, border
- Modify button: Outline button

**Filter Sidebar:**
- Width: 280px (desktop)
- Background: White
- Border radius: 12px
- Padding: 24px
- Sticky: Top 100px
- Mobile: Bottom sheet modal

**Filter Categories:**
- Section heading: 14px, Semibold, Navy
- Checkboxes: 20×20px
- Radio buttons: 20×20px
- Slider: Custom orange handle
- Clear All: Text link, red color

**Bus Card (Main Component):**

```
┌──────────────────────────────────────────────────────────┐
│  BUS CARD                                                 │
│  Size: 100% width × auto height                          │
│  Background: White                                       │
│  Border: 1px solid #E2E8F0                               │
│  Border radius: 12px                                     │
│  Padding: 24px                                           │
│  Shadow: 0 1px 3px rgba(0,0,0,0.1)                      │
│  Hover: Shadow 0 4px 12px rgba(0,0,0,0.1), lift 2px     │
│                                                          │
│  ┌──────────┐  ┌────────────────────────────────────┐  │
│  │          │  │ AC SLEEPER                          │  │
│  │  Bus     │  │ Operator: Sharma Travels            │  │
│  │  Photo   │  │ Route: Jaipur → Delhi               │  │
│  │  160×120 │  │                                      │  │
│  │          │  │ DEPARTURE ────6h──→ ARRIVAL         │  │
│  │ [Gallery]│  │ 22:00 Jaipur   04:00 Delhi          │  │
│  └──────────┘  │ (Progress bar with time)             │  │
│                │                                      │  │
│                │ ⭐ 4.5 (120 reviews) ✅ Verified    │  │
│                │                                      │  │
│                │ Amenities:                           │  │
│                │ • 2+1 Seating  • Blankets           │  │
│                │ • Charging     • Water Bottle       │  │
│                │                                      │  │
│                │ ┌─────────────┐ ┌─────────────┐    │  │
│                │ │ Starting    │ │ [View Seats]│    │  │
│                │ │ ₹850/seat   │ │             │    │  │
│                │ └─────────────┘ └─────────────┘    │  │
│                │                 [View Details]      │  │
│                └──────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Bus Card Breakdown:**

1. **Left Section (Photo):**
   - Size: 160×120px (desktop), 100% width (mobile)
   - Border radius: 8px
   - Gallery badge: "6 photos" overlay
   - Click: Opens lightbox

2. **Right Section (Details):**
   - **Header:**
     - Bus type: 18px, Bold, Navy
     - Operator: 14px, Regular, Gray
     - Route: 14px, Regular, Gray
   
   - **Timeline:**
     - Times: 20px, Bold, Navy
     - Cities: 14px, Regular, Gray
     - Duration: Badge in center "6h"
     - Progress bar: Gray line with dots
   
   - **Trust Badges:**
     - Rating: Gold star + number
     - Reviews: Gray text in parentheses
     - Verified: Green checkmark + text
   
   - **Amenities:**
     - Bullet points (orange dots)
     - Text: 14px, Regular, Gray
     - Icons: 16×16px before text
   
   - **Price & Actions:**
     - Price container: Light gray bg, rounded
     - "Starting from" label: 12px, Gray
     - Price: 24px, Bold, Navy
     - View Seats: Primary orange button
     - View Details: Secondary outline button

**Bus Card States:**

```
Default:
  Border: 1px solid #E2E8F0
  Shadow: 0 1px 3px rgba(0,0,0,0.1)

Hover:
  Border: 1px solid #F97316 (optional)
  Shadow: 0 4px 12px rgba(0,0,0,0.1)
  Transform: translateY(-2px)
  Cursor: pointer

Selected (for comparison):
  Border: 2px solid #F97316
  Background: rgba(249,115,22,0.02)
```

---

## 📄 PAGE 3: SEAT SELECTION (Modal/Page)

```
┌──────────────────────────────────────────────────────────┐
│  SEAT SELECTION                                          │
│  Modal overlay OR Full page                              │
│                                                          │
│  [← Back]  Select Your Seats                            │
│                                                          │
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │ SEAT LAYOUT (60%)      │  │ BOOKING SUMMARY (40%)│  │
│  │                         │  │                      │  │
│  │ Upper Deck              │  │ AC Sleeper           │  │
│  │ ┌─────────────────┐    │  │ Jaipur → Delhi       │  │
│  │ │    [Driver]     │    │  │ 15 Mar, 22:00        │  │
│  │ │                 │    │  │                      │  │
│  │ │  [1] [2]    [3] │    │  │ Selected Seats:      │  │
│  │ │  [4] [5]    [6] │    │  │ • U12 (Upper)        │  │
│  │ │  [7] [8]    [9] │    │  │ • U13 (Upper)        │  │
│  │ │  ...             │    │  │                      │  │
│  │ └─────────────────┘    │  │ Fare Breakdown:      │  │
│  │                         │  │ Base: ₹1,700        │  │
│  │ Lower Deck              │  │ Tax: ₹85            │  │
│  │ ┌─────────────────┐    │  │ ───────────────     │  │
│  │ │  [20][21]  [22] │    │  │ Total: ₹1,785       │  │
│  │ │  [23][24]  [25] │    │  │                      │  │
│  │ │  ...             │    │  │ [Proceed to Book]   │  │
│  │ └─────────────────┘    │  │                      │  │
│  │                         │  │                      │  │
│  │ Legend:                 │  │                      │  │
│  │ [✓] Selected           │  │                      │  │
│  │ [ ] Available          │  │                      │  │
│  │ [×] Booked             │  │                      │  │
│  │ [♀] Ladies             │  │                      │  │
│  │                         │  │                      │  │
│  └────────────────────────┘  └──────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Seat Component:**
- Size: 40×40px (desktop), 36×36px (mobile)
- Border radius: 4px
- Border: 2px solid
- Text: Seat number, 12px, centered

**Seat States:**
```
Available:
  Background: White
  Border: #E2E8F0
  Cursor: pointer
  Hover: Border #F97316

Selected:
  Background: #F97316
  Border: #F97316
  Text: White
  Icon: Checkmark

Booked:
  Background: #E2E8F0
  Border: #CBD5E1
  Text: Gray
  Cursor: not-allowed
  Opacity: 0.6

Ladies:
  Background: #FCE7F3
  Border: #EC4899
  Icon: ♀ symbol
```

---

## 📄 PAGE 4: BOOKING DETAILS

```
┌──────────────────────────────────────────────────────────┐
│  BOOKING DETAILS                                         │
│                                                          │
│  [Progress: ●───○───○]                                  │
│  Details  Payment  Confirm                              │
│                                                          │
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │ FORM (60%)             │  │ SUMMARY (40%)        │  │
│  │                         │  │                      │  │
│  │ Passenger Details       │  │ Trip Summary         │  │
│  │                         │  │ [Bus Photo]          │  │
│  │ Seat U12:               │  │                      │  │
│  │ Name: [___________]     │  │ AC Sleeper           │  │
│  │ Age: [___]              │  │ Jaipur → Delhi       │  │
│  │ Gender: [Male ▼]        │  │ 15 Mar, 22:00        │  │
│  │                         │  │                      │  │
│  │ Seat U13:               │  │ Passengers: 2        │  │
│  │ Name: [___________]     │  │ Seats: U12, U13      │  │
│  │ Age: [___]              │  │                      │  │
│  │ Gender: [Female ▼]      │  │ Fare Details:        │  │
│  │                         │  │ Base: ₹1,700        │  │
│  │ Contact Details         │  │ Tax: ₹85            │  │
│  │ Email: [___________]    │  │ Service: ₹50        │  │
│  │ Phone: [___________]    │  │ ───────────────     │  │
│  │                         │  │ Total: ₹1,835       │  │
│  │ Boarding Point          │  │                      │  │
│  │ [Select location ▼]    │  │ [Edit Seats]        │  │
│  │                         │  │                      │  │
│  │ ☑️ I agree to terms    │  │                      │  │
│  │                         │  │                      │  │
│  │ [Proceed to Payment]    │  │                      │  │
│  │                         │  │                      │  │
│  └────────────────────────┘  └──────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 📄 PAGE 5: VEHICLE DETAIL (Full View)

```
┌──────────────────────────────────────────────────────────┐
│  [← Back to Results]                      [Share] [♡ Save]│
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  PHOTO GALLERY                                           │
│  Main photo: 800×400px (full width)                      │
│  [← Previous] [Next →]                                   │
│  Thumbnails: [▪️] [▫️] [▫️] [▫️] [▫️] [▫️]              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  VEHICLE INFO SECTION                                    │
│                                                          │
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │ INFO (65%)             │  │ BOOKING CARD (35%)   │  │
│  │                         │  │                      │  │
│  │ AC SLEEPER             │  │ Jaipur → Delhi       │  │
│  │ Operator: Sharma Travel│  │ Wed, 15 Mar 2026     │  │
│  │                         │  │                      │  │
│  │ ⭐ 4.5 (120 reviews)   │  │ 22:00 ──6h──→ 04:00 │  │
│  │ ✅ Verified Operator   │  │                      │  │
│  │                         │  │ Starting from:       │  │
│  │ About this bus:         │  │ ₹850 per seat       │  │
│  │ Modern AC sleeper with │  │                      │  │
│  │ comfortable berths...   │  │ [Select Seats]      │  │
│  │                         │  │                      │  │
│  │ Amenities:              │  │ or                   │  │
│  │ ✓ AC                   │  │ [Call to Book]       │  │
│  │ ✓ 2+1 Seating          │  │ +91-1800-XXX-XXX    │  │
│  │ ✓ Blankets & Pillows   │  │                      │  │
│  │ ✓ Charging Points      │  │                      │  │
│  │ ✓ Water Bottle         │  │                      │  │
│  │ ✓ Reading Lights       │  │                      │  │
│  │ ✓ Emergency Exit       │  │                      │  │
│  │                         │  │                      │  │
│  └────────────────────────┘  └──────────────────────┘  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  TABS SECTION                                           │
│  [Overview] [Amenities] [Reviews] [Policies]            │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ACTIVE TAB CONTENT                                  │ │
│  │                                                      │ │
│  │ Boarding & Dropping Points                          │ │
│  │ • Jaipur Railway Station (21:45)                   │ │
│  │ • Sindhi Camp (22:00)                              │ │
│  │ • Vaishali Nagar (22:15)                           │ │
│  │                                                      │ │
│  │ • Gurgaon Sector 14 (03:30)                        │ │
│  │ • Delhi ISBT Kashmere Gate (04:00)                 │ │
│  │                                                      │ │
│  │ Rest Stops                                          │ │
│  │ • 01:00 AM - Jaipur Highway Dhaba (15 min)        │ │
│  │                                                      │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  REVIEWS SECTION                                        │
│  Overall Rating: ⭐ 4.5 (120 reviews)                  │
│                                                          │
│  [Sort: Most Recent ▼]                                  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ⭐⭐⭐⭐⭐                                            │ │
│  │ "Clean and comfortable"                             │ │
│  │ The bus was very clean and the staff was polite... │ │
│  │ — Raj K., Traveled on 12 Mar 2026 ✅ Verified     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ⭐⭐⭐⭐                                              │ │
│  │ "Good experience"                                   │ │
│  │ Reached on time. AC was good...                    │ │
│  │ — Sunita S., Traveled on 10 Mar 2026 ✅ Verified  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [Load More Reviews]                                    │
│                                                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  SIMILAR BUSES SECTION                                   │
│  You might also like                                     │
│  (3-4 bus cards in carousel)                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  STICKY FOOTER (Mobile)                                  │
│  ₹850/seat                    [Select Seats]            │
└──────────────────────────────────────────────────────────┘
```

---

## 📱 MOBILE OPTIMIZATIONS

### Search Page (Mobile):
```
- Search card: Full width (minus 16px padding)
- Inputs: Stack vertically (1 column)
- Quick filters: Horizontal scroll
- Popular routes: Horizontal scroll (2 visible at once)
```

### Results Page (Mobile):
```
- Filters: Bottom sheet modal (not sidebar)
- Filter button: Fixed at bottom "Filters (4 applied)"
- Bus cards: Full width
- Photo: Full width, 200px height
- Layout: Stack vertically
- Buttons: Full width
```

### Seat Selection (Mobile):
```
- Full screen modal
- Seat layout: Scrollable, zoomed view
- Summary: Sticky bottom sheet
- Legend: Collapsible at bottom
```

### Key Mobile Interactions:
- Touch targets: 48×48px minimum
- Swipe: Photo galleries, seat layout scroll
- Pull-to-refresh: Results page
- Bottom sheets: Filters, booking summary
- Native pickers: Date, time, passenger count

---

## 🎨 COMPONENT STATES

### Loading States:
```
Search Loading:
  - Search button: Spinner + "Searching..."
  - Disable all inputs
  
Results Loading:
  - Skeleton cards (animated shimmer)
  - 3 skeleton cards visible
  - Gray placeholders for images

Seat Loading:
  - Seat layout: Skeleton grid
  - Disable all interactions
```

### Empty States:
```
No Results:
  Icon: 🔍 (large, 120×120px)
  Heading: "No buses found"
  Subtext: "Try adjusting your search filters"
  CTA: "Clear Filters" or "Modify Search"
  
No Seats Available:
  Icon: 🚫
  Heading: "All seats booked"
  Subtext: "Try another bus or different date"
  CTA: "View Other Buses"
```

### Error States:
```
Search Error:
  Alert banner: Red background
  Icon: ⚠️
  Message: "Unable to search. Please try again."
  CTA: "Retry"
  
Booking Error:
  Modal: Center screen
  Icon: ❌
  Message: Clear error explanation
  CTA: "Try Again" or "Contact Support"
```

### Success States:
```
Booking Success:
  Icon: ✅ (animated checkmark)
  Heading: "Booking Confirmed!"
  Booking ID: Large, copyable
  Message: "Confirmation sent to email/SMS"
  CTAs: "View Booking" or "Download Ticket"
```

---

## 🎯 INTERACTION PATTERNS

### Hover Effects:
```
Bus Cards:
  - Lift 2px
  - Shadow increase
  - Border color change (optional)

Buttons:
  - Darken background 10%
  - Lift 1px
  - Cursor: pointer

Inputs:
  - Border color: Orange
  - Shadow: Orange glow
```

### Click/Tap Effects:
```
Buttons:
  - Scale down 0.98
  - Darken background 20%
  - Ripple effect (material design)

Seats:
  - Scale up 1.1
  - Immediate state change
  - Haptic feedback (mobile)

Filter Checkboxes:
  - Instant apply (no submit button)
  - Count updates in real-time
```

### Animations:
```
Page Transitions:
  - Fade in: 300ms ease
  - Slide up: Results cards
  
Filter Apply:
  - Results fade out/in: 200ms
  - Smooth scroll to top

Seat Selection:
  - Checkmark animation
  - Price update counter animation
```

---

## ✅ DESIGN CHECKLIST

### Visual Consistency:
- [ ] Colors match Charter brand (#1E293B, #F97316)
- [ ] Typography consistent (Inter font)
- [ ] Spacing follows 8px grid
- [ ] Border radius consistent (8px, 12px, 16px)
- [ ] Shadows consistent

### Accessibility:
- [ ] Text contrast 4.5:1 minimum
- [ ] Touch targets 48×48px (mobile)
- [ ] Focus states visible
- [ ] Alt text for images
- [ ] Keyboard navigation support
- [ ] Screen reader labels

#### Color Contrast Verification (WCAG AA):
| Element | Foreground | Background | Required Ratio | Notes |
|---|---|---|---|---|
| Body text | `#1E293B` (slate-800) | `#FFFFFF` | ≥ 4.5:1 | ✅ ~14:1 |
| Muted text / captions | `#64748B` (slate-500) | `#FFFFFF` | ≥ 4.5:1 | Verify — borderline |
| Primary CTA label | `#FFFFFF` | `#F97316` (saffron) | ≥ 3:1 (large text) | Confirm at 18px+ |
| Active filter pill | `#1E293B` | `#FEF3C7` (warmBeige) | ≥ 4.5:1 | Verify tint |
| Star rating icons | `#F59E0B` (goldAccent) | `#FFFFFF` | ≥ 3:1 (UI component) | Check against card bg |
| Error / unavailable text | `#EF4444` (red-500) | `#FFFFFF` | ≥ 4.5:1 | Verify |
| Price highlight | `#F97316` (saffron) | `#FFFFFF` | ≥ 3:1 (large text) | Confirm at 18px+ |

### Responsive:
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)
- [ ] Large desktop (1440px+)
- [ ] All interactions work on touch

### Performance:
- [ ] Images optimized (WebP)
- [ ] Lazy loading for bus cards
- [ ] Skeleton screens for loading
- [ ] Debounced search inputs
- [ ] Pagination or infinite scroll

---

## 📦 DELIVERABLES

### For Designer:
1. Search page (improved)
2. Results page with filters
3. Seat selection modal
4. Booking details form
5. Vehicle detail page
6. Mobile versions of all
7. Component library
8. All states (loading, error, empty, success)

### For Developer:
1. Figma file (organized layers)
2. Design tokens (JSON)
3. Component specifications
4. Interaction documentation
5. Animation specifications
6. Responsive breakpoints
7. Asset pack (icons, images)

---

## 💰 COST & TIMELINE

**Professional Designer:**
- Cost: ₹6,000 - ₹10,000
- Timeline: 7-10 days
- Includes: All pages, mobile versions, states

**DIY:**
- Cost: ₹0
- Timeline: 2-3 weeks
- Use this spec as exact guide

---

## 🚀 IMPLEMENTATION PRIORITY

### Week 1 (MVP):
1. ✅ Search page (improved inputs)
2. ✅ Results page with basic filters
3. ✅ Bus cards (detailed view)
4. ✅ Mobile responsive

### Week 2 (Enhanced):
5. ✅ Advanced filters
6. ✅ Seat selection
7. ✅ Booking flow
8. ✅ Vehicle detail page

### Week 3 (Polish):
9. ✅ All loading states
10. ✅ Empty states
11. ✅ Error handling
12. ✅ Animations

---

**COMPLETE SEARCH & RESULTS DESIGN SPEC READY! 🔍**

This specification matches your Charter brand and provides a complete booking flow from search to seat selecti

