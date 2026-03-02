# 🎨 LANDING PAGE DESIGN SPECIFICATION

**Platform:** Bus Rental Booking Platform  
**Target Audience:** Indian customers (Jaipur, Rajasthan)  
**Primary Use Cases:** Weddings, Religious Tours, Family Trips  
**Design Style:** Modern, Trustworthy, Mobile-First, Indian Context  

---

## 🎯 DESIGN PHILOSOPHY

### NOT Generic SaaS Landing Page ❌
We're NOT building another:
- Generic "Search for buses" homepage
- Western-style travel website
- Corporate boring design

### INSTEAD: Indian Wedding & Travel Context ✅
- **Warm, festive colors** (Rajasthan heritage)
- **Family-focused imagery** (not solo travelers)
- **Trust signals** (driver verification, safety)
- **Hindi + English** bilingual by default
- **WhatsApp integration** prominent
- **Price transparency** upfront

---

## 📐 PAGE STRUCTURE (Desktop: 1440px)

```
┌─────────────────────────────────────────────────────────┐
│                    SECTION 1: HERO                      │
│              Height: 100vh (full screen)                │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                SECTION 2: HOW IT WORKS                  │
│                    Height: Auto                         │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│               SECTION 3: VEHICLE TYPES                  │
│                    Height: Auto                         │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│              SECTION 4: USE CASES (Tabs)                │
│                    Height: Auto                         │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│           SECTION 5: TRUST & SAFETY                     │
│                    Height: Auto                         │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│              SECTION 6: TESTIMONIALS                    │
│                    Height: Auto                         │
└─────────────────────────────────────────────────────────┐
┌─────────────────────────────────────────────────────────┐
│                  SECTION 7: CTA                         │
│                    Height: 400px                        │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                   SECTION 8: FOOTER                     │
│                    Height: 300px                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 COLOR PALETTE (Rajasthan-Inspired)

### Primary Colors:
```
Saffron Orange: #FF6B35 (Energy, Movement, Rajasthan)
Royal Blue: #004E89 (Trust, Reliability)
Deep Purple: #6A1B4D (Luxury, Premium)
```

### Secondary Colors:
```
Warm Beige: #F7F4EA (Background, Soft)
Gold Accent: #D4AF37 (Wedding, Festive)
Forest Green: #2D5016 (Safety, Verified)
Terracotta: #C1666B (Rajasthan Architecture)
```

### Neutrals:
```
Dark Gray: #2C2C2C (Text)
Medium Gray: #6B6B6B (Secondary Text)
Light Gray: #E8E8E8 (Borders, Dividers)
White: #FFFFFF (Background, Cards)
```

---

## 📝 TYPOGRAPHY

### Font Family:
```
Primary: Inter (Clean, Modern, Great for Hindi + English)
Secondary: Poppins (Headings, Friendly)
Hindi: Noto Sans Devanagari (Native Hindi Support)
```

### Type Scale:
```
Hero Heading: 72px / Bold / Poppins
Section Heading: 48px / Bold / Poppins
Subsection: 32px / Semibold / Poppins
Body Large: 20px / Regular / Inter
Body: 16px / Regular / Inter
Caption: 14px / Regular / Inter
Button: 16px / Semibold / Inter
```

---

## 🎭 SECTION 1: HERO (100vh)

### Layout:
```
┌──────────────────────────────────────────────────────────┐
│  NAVBAR (Transparent, Sticky)                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ [Logo]        [हिंदी | English]  [Driver Login]   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────┐             │
│  │  Background: Full-width Image           │             │
│  │  (Rajasthan landscape OR happy family   │             │
│  │   in decorated bus for wedding)         │             │
│  │                                          │             │
│  │  ┌──────────────────────────────────┐   │             │
│  │  │                                   │   │             │
│  │  │  HERO TEXT (White, Center):      │   │             │
│  │  │                                   │   │             │
│  │  │  आपकी यात्रा, हमारी जिम्मेदारी    │   │             │
│  │  │  Your Journey, Our Responsibility│   │             │
│  │  │                                   │   │             │
│  │  │  [Subheading]:                    │   │             │
│  │  │  Book buses for weddings,         │   │             │
│  │  │  tours, and family trips          │   │             │
│  │  │  in Jaipur & Rajasthan            │   │             │
│  │  │                                   │   │             │
│  │  │  ┌───────────────────────────┐    │   │             │
│  │  │  │  SEARCH WIDGET (White)    │    │   │             │
│  │  │  │  ┌─────────────────────┐  │    │   │             │
│  │  │  │  │ Where do you want   │  │    │   │             │
│  │  │  │  │ to go?              │  │    │   │             │
│  │  │  │  └─────────────────────┘  │    │   │             │
│  │  │  │  ┌──────┐ ┌──────┐       │    │   │             │
│  │  │  │  │ Date │ │ Pax  │       │    │   │             │
│  │  │  │  └──────┘ └──────┘       │    │   │             │
│  │  │  │  ┌──────┐ ┌──────┐       │    │   │             │
│  │  │  │  │Innova│ │Tempo │       │    │   │             │
│  │  │  │  └──────┘ └──────┘       │    │   │             │
│  │  │  │  [🔍 Search Vehicles]    │    │   │             │
│  │  │  └───────────────────────────┘    │   │             │
│  │  │                                   │   │             │
│  │  └──────────────────────────────────┘   │             │
│  └─────────────────────────────────────────┘             │
│                                                           │
│  [Scroll Indicator]                                      │
│         ↓                                                │
└──────────────────────────────────────────────────────────┘
```

### Design Details:

**Background Image:**
- Full-width hero image (1920px × 1080px)
- **Image Options:**
  1. Decorated bus with marigold flowers (wedding context)
  2. Happy Indian family (3 generations) standing in front of mini bus
  3. Rajasthan desert landscape with luxury tempo traveller
- Overlay: Dark gradient (bottom to top, 60% opacity)
- Image blur: Slight blur (keep focus on text)

**Logo:**
- Position: Top left, 40px padding
- Size: 180px × 50px
- Style: Text logo with bus icon
- Color: White (on dark overlay)
- Font: Bold Poppins
- Example: "🚍 BusYatra" or "YatraSeva"

**Language Toggle:**
- Position: Top right, before login button
- Style: Pill toggle
- Colors: White text, transparent bg, white border
- Hover: Fill with white, text becomes primary color

**Hero Text:**
- Hindi text: 56px, Bold
- English text: 48px, Semibold
- Both: White color with subtle text shadow
- Letter spacing: -0.5px (tighter)
- Center aligned

**Subheading:**
- 24px, Regular Inter
- White with 90% opacity
- Max width: 600px, centered
- Line height: 1.6

**Search Widget:**
- White card with shadow (0px 20px 60px rgba(0,0,0,0.15))
- Border radius: 16px
- Padding: 40px
- Max width: 700px, centered

**Search Widget Components:**

1. **Location Input:**
   - Icon: 📍 (pin icon, left aligned)
   - Placeholder: "Pickup location (e.g., Jaipur Railway Station)"
   - Font: 18px Inter
   - Border: 1px solid #E8E8E8
   - Border radius: 8px
   - Padding: 16px
   - Focus state: Blue border

2. **Date & Passenger Pickers:**
   - Side by side, 50% width each
   - Icons: 📅 (calendar) and 👥 (people)
   - Same style as location input

3. **Vehicle Type Pills:**
   - Horizontal scrollable chips
   - Style: Gray bg, rounded pills
   - Active: Blue bg, white text
   - Options: Tavera, Innova, Tempo Traveller, Mini Bus, Volvo Bus

4. **Search Button:**
   - Width: 100%
   - Height: 56px
   - Background: Gradient (Orange #FF6B35 to Red #E63946)
   - Text: White, 18px, Semibold
   - Border radius: 12px
   - Shadow: 0px 4px 20px rgba(255,107,53,0.4)
   - Hover: Lift up 2px, bigger shadow
   - Icon: 🔍 (left of text)

**Scroll Indicator:**
- Animated bouncing arrow
- Position: Bottom center, 40px from bottom
- Color: White with 80% opacity
- Size: 32px

---

## 🔄 SECTION 2: HOW IT WORKS (Height: Auto, ~600px)

### Layout:
```
┌──────────────────────────────────────────────────────────┐
│                    [Section Heading]                      │
│              How BusYatra Works | कैसे काम करता है         │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │              │  │              │  │              │   │
│  │   Step 1     │  │   Step 2     │  │   Step 3     │   │
│  │              │  │              │  │              │   │
│  │  [Icon 1]    │  │  [Icon 2]    │  │  [Icon 3]    │   │
│  │              │  │              │  │              │   │
│  │ Search &     │  │ Negotiate &  │  │ Travel with  │   │
│  │ Select       │  │ Book         │  │ Peace        │   │
│  │              │  │              │  │              │   │
│  │ Browse 100+  │  │ Propose your │  │ Driver info  │   │
│  │ vehicles     │  │ price, driver│  │ revealed 2hr │   │
│  │              │  │ accepts      │  │ before trip  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                           │
│           [Button: Start Searching →]                    │
└──────────────────────────────────────────────────────────┘
```

### Design Details:

**Background:**
- Color: Warm Beige (#F7F4EA)
- Padding: 120px top, 120px bottom

**Section Heading:**
- 48px, Bold Poppins
- Color: Dark Gray (#2C2C2C)
- Center aligned
- Hindi below English, 36px
- Margin bottom: 80px

**Step Cards:**
- Three cards, equal width (30% each)
- Gap between cards: 5%
- Background: White
- Border radius: 20px
- Padding: 40px
- Shadow: 0px 10px 40px rgba(0,0,0,0.06)
- Hover: Lift up 4px, shadow increases

**Icons:**
- Size: 80px × 80px
- Style: Illustrated icons (not generic)
- Colors: Use brand colors
- Position: Center, top of card
- **Icon 1:** Magnifying glass with bus inside
- **Icon 2:** Handshake with currency symbol
- **Icon 3:** Shield with checkmark (safety)

**Step Number:**
- Small badge: "01", "02", "03"
- Position: Top right of card
- Background: Light blue circle
- Font: 24px, Bold
- Color: Primary blue

**Card Title:**
- 24px, Semibold Inter
- Color: Dark Gray
- Margin: 20px top, 12px bottom

**Card Description:**
- 16px, Regular Inter
- Color: Medium Gray
- Line height: 1.6
- Max width: 300px

**CTA Button:**
- Center aligned, below cards
- Margin top: 60px
- Style: Primary blue button
- Width: 280px, Height: 52px
- Arrow icon on right →

---

## 🚐 SECTION 3: VEHICLE TYPES (Height: Auto, ~800px)

### Layout:
```
┌──────────────────────────────────────────────────────────┐
│                [Section Heading]                          │
│         Our Fleet | हमारे वाहन                            │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  [TAB NAVIGATION]                                   │ │
│  │  Tavera | Innova | Tempo | Mini Bus | Volvo Bus    │ │
│  │                                                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  [ACTIVE TAB CONTENT: Innova Example]                    │
│                                                           │
│  ┌─────────────────────┐  ┌─────────────────────────┐   │
│  │                     │  │                         │   │
│  │  [Large Photo]      │  │  Innova Crysta          │   │
│  │  (60% width)        │  │                         │   │
│  │                     │  │  Perfect for:           │   │
│  │  [Gallery: 4        │  │  • Family trips (7 pax)│   │
│  │   thumbnails below] │  │  • Airport pickups     │   │
│  │                     │  │  • Short tours         │   │
│  │                     │  │                         │   │
│  │                     │  │  ✓ AC, Music, GPS      │   │
│  │                     │  │  ✓ Comfortable seats   │   │
│  │                     │  │                         │   │
│  │                     │  │  Starting from:        │   │
│  │                     │  │  ₹5,000/day            │   │
│  │                     │  │  + ₹12/km              │   │
│  │                     │  │                         │   │
│  │                     │  │  [Book Innova →]       │   │
│  └─────────────────────┘  └─────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Design Details:

**Background:**
- Color: White
- Padding: 120px vertical

**Tab Navigation:**
- Horizontal tabs
- Style: Underline on active tab
- Font: 20px, Semibold
- Active color: Primary orange
- Inactive color: Medium gray
- Hover: Color changes to orange
- Underline: 3px thick, animated slide

**Content Layout:**
- Split: 60% photo, 40% details
- Gap: 60px
- Align: Center vertically

**Photo Gallery:**
- Large photo: 800px × 500px
- Border radius: 16px
- Shadow: 0px 10px 40px rgba(0,0,0,0.1)
- Thumbnails: 4 photos below, 180px × 120px each
- Click: Changes main photo

**Details Section:**

1. **Vehicle Name:**
   - 36px, Bold Poppins
   - Color: Dark gray
   - Margin bottom: 24px

2. **"Perfect for" List:**
   - Heading: 20px, Semibold
   - List items: 18px, Regular
   - Bullet: Orange dot
   - Line height: 1.8

3. **Amenities:**
   - Green checkmarks (✓)
   - 16px, Regular
   - Icons before each amenity
   - Grid layout: 2 columns

4. **Pricing Box:**
   - Background: Light beige
   - Border: 1px solid gold
   - Border radius: 12px
   - Padding: 24px
   - "Starting from:" 14px, gray
   - Price: 32px, Bold, dark gray
   - "+ ₹12/km" 18px, regular

5. **CTA Button:**
   - Full width in details section
   - Orange gradient background
   - 52px height
   - Arrow icon on right

---

## 🎉 SECTION 4: USE CASES (Height: Auto, ~700px)

### Layout:
```
┌──────────────────────────────────────────────────────────┐
│              [Section Heading]                            │
│         Perfect for Every Occasion                        │
│                                                           │
│  [TAB NAVIGATION]                                         │
│  Weddings 💐 | Religious Tours 🕉️ | Family Trips 👨‍👩‍👧    │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  [Active Tab: Weddings]                             │ │
│  │                                                      │ │
│  │  ┌──────────────┐           ┌──────────────┐       │ │
│  │  │              │           │              │       │ │
│  │  │  [Image:     │           │  Barat       │       │ │
│  │  │   Decorated  │           │  Transport   │       │ │
│  │  │   bus with   │           │              │       │ │
│  │  │   marigolds] │           │  Transport   │       │ │
│  │  │              │           │  50+ guests  │       │ │
│  │  │              │           │  in style    │       │ │
│  │  │              │           │              │       │ │
│  │  │              │           │  ₹12K-25K    │       │ │
│  │  │              │           │  per bus     │       │ │
│  │  │              │           │              │       │ │
│  │  └──────────────┘           └──────────────┘       │ │
│  │                                                      │ │
│  │  [Popular Routes]                                   │ │
│  │  • Jaipur → Bharatpur (180km)                      │ │
│  │  • Jaipur → Jodhpur (335km)                        │ │
│  │  • Jaipur → Ajmer (135km)                          │ │
│  │                                                      │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Design Details:

**Background:**
- Gradient: Soft orange to pink (very subtle)
- Padding: 120px vertical

**Tab Navigation:**
- Pills style (rounded buttons)
- Active: Solid orange with white text
- Inactive: White with orange border
- Emojis: Add cultural context
- Font: 18px, Semibold

**Tab Content:**

1. **Image Card:**
   - 50% width
   - Real photos of decorated buses
   - Border radius: 20px
   - Shadow: Large, soft

2. **Description Card:**
   - 50% width
   - Background: White
   - Border radius: 20px
   - Padding: 40px
   - Heading: 28px, Bold
   - Description: 18px, Regular
   - Bullet points: Use cases
   - Price range: Highlighted box

3. **Popular Routes:**
   - Below cards
   - Small gray box
   - List with → arrows
   - Font: 16px
   - Interactive: Hover highlights

**Wedding Tab Specifics:**
- Image: Decorated bus with flowers
- Text: "Barat transport made easy"
- Price: ₹12K-25K per bus
- Routes: Common wedding routes

**Religious Tours Tab:**
- Image: Family at temple with bus
- Text: "Spiritual journeys, comfortable travel"
- Popular: Khatu Shyam Ji, Salasar Balaji
- Price: ₹8K-15K

**Family Trips Tab:**
- Image: Multi-generation family
- Text: "Create memories together"
- Popular: Jaipur city tour, Ranthambore
- Price: ₹5K-12K

---

## 🛡️ SECTION 5: TRUST & SAFETY (Height: Auto, ~500px)

### Layout:
```
┌──────────────────────────────────────────────────────────┐
│               [Section Heading]                           │
│          Your Safety, Our Priority                        │
│                                                           │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────┐│
│  │           │  │           │  │           │  │        ││
│  │  [Icon]   │  │  [Icon]   │  │  [Icon]   │  │ [Icon] ││
│  │           │  │           │  │           │  │        ││
│  │ Verified  │  │  Insured  │  │  24/7     │  │ Track  ││
│  │ Drivers   │  │  Vehicles │  │  Support  │  │ Record ││
│  │           │  │           │  │           │  │        ││
│  │ All       │  │ Every     │  │ Call us   │  │ Real   ││
│  │ drivers   │  │ vehicle   │  │ anytime   │  │ reviews││
│  │ verified  │  │ has valid │  │ for help  │  │ only   ││
│  │           │  │ insurance │  │           │  │        ││
│  └───────────┘  └───────────┘  └───────────┘  └────────┘│
│                                                           │
│        [Big Numbers Section]                             │
│                                                           │
│   1000+          95%          50+           4.5★         │
│   Happy          Trips        Drivers       Average      │
│   Customers      Completed    Verified      Rating       │
└──────────────────────────────────────────────────────────┘
```

### Design Details:

**Background:**
- Color: Deep blue (#004E89)
- Text color: White
- Padding: 100px vertical

**Section Heading:**
- 48px, Bold, White
- Center aligned
- Margin bottom: 60px

**Trust Badges:**
- Four badges, equal width
- Icons: Shield, Insurance paper, Phone, Star
- Icon size: 64px
- Icon color: Gold (#D4AF37)
- Title: 20px, Semibold, White
- Description: 16px, Regular, White 80% opacity

**Big Numbers:**
- Below badges, margin top: 80px
- Four columns, equal width
- Number: 56px, Bold, White
- Label: 18px, Regular, White 80% opacity
- Numbers animated on scroll (count up effect)

---

## 💬 SECTION 6: TESTIMONIALS (Height: Auto, ~600px)

### Layout:
```
┌──────────────────────────────────────────────────────────┐
│                [Section Heading]                          │
│         What Our Customers Say | ग्राहक समीक्षाएं          │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ [Carousel: 3 testimonial cards visible at once]   │  │
│  │                                                     │  │
│  │  ┌──────────┐   ┌──────────┐   ┌──────────┐      │  │
│  │  │          │   │          │   │          │      │  │
│  │  │ ⭐⭐⭐⭐⭐   │   │ ⭐⭐⭐⭐⭐   │   │ ⭐⭐⭐⭐⭐   │      │  │
│  │  │          │   │          │   │          │      │  │
│  │  │ "Used for│   │ "Perfect │   │ "Reliable│      │  │
│  │  │  wedding │   │ for Khatu│   │  service"│      │  │
│  │  │  barat"  │   │ trip"    │   │          │      │  │
│  │  │          │   │          │   │          │      │  │
│  │  │ — Rajesh │   │ — Sunita │   │ — Amit   │      │  │
│  │  │   Kumar  │   │   Sharma │   │   Patel  │      │  │
│  │  │   Jaipur │   │   Jodhpur│   │   Jaipur │      │  │
│  │  │          │   │          │   │          │      │  │
│  │  └──────────┘   └──────────┘   └──────────┘      │  │
│  │                                                     │  │
│  │  [← Prev]  [Dots: • • • • •]  [Next →]           │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Design Details:

**Background:**
- Color: Warm Beige (#F7F4EA)
- Padding: 120px vertical

**Testimonial Cards:**
- Width: 350px each
- Background: White
- Border radius: 16px
- Padding: 32px
- Shadow: 0px 8px 30px rgba(0,0,0,0.08)
- Border left: 4px solid orange (accent)

**Stars:**
- Size: 24px each
- Color: Gold (#D4AF37)
- Margin bottom: 20px

**Quote:**
- Font: 18px, Regular Inter
- Color: Dark gray
- Line height: 1.7
- Style: Italic
- Opening/closing quotes: Large, decorative

**Author:**
- Font: 16px, Semibold
- Color: Primary blue
- Name + City
- Margin top: 24px

**Carousel Controls:**
- Previous/Next buttons: Ghost buttons (outline only)
- Dots: Small circles, active = orange
- Auto-play: 5 seconds
- Swipe enabled on mobile

---

## 🚀 SECTION 7: FINAL CTA (Height: 400px)

### Layout:
```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│           [Background: Gradient Orange to Pink]          │
│                                                           │
│                                                           │
│               Ready to Book Your Ride?                   │
│          अपनी यात्रा आज ही बुक करें                       │
│                                                           │
│                                                           │
│           [Large Button: Search Vehicles →]              │
│                                                           │
│                     or                                   │
│                                                           │
│         [WhatsApp Button: 📱 +91-98765-43210]           │
│              Chat with us on WhatsApp                    │
│                                                           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Design Details:

**Background:**
- Gradient: Orange (#FF6B35) to Pink (#E63946)
- Angle: 45 degrees
- Full width

**Heading:**
- 56px, Bold Poppins, White
- Center aligned
- Hindi below: 42px, Semibold

**Primary Button:**
- Width: 400px
- Height: 64px
- Background: White
- Text: Primary orange, 20px, Bold
- Border radius: 16px
- Shadow: Large, lifted
- Hover: Scale up 1.05x

**WhatsApp Button:**
- Width: 400px
- Height: 56px
- Background: WhatsApp green (#25D366)
- Text: White, 18px, Semibold
- Icon: WhatsApp logo (left)
- Border radius: 12px
- Below text: "Chat with us" 14px, white 80%

---

## 📱 SECTION 8: FOOTER (Height: 300px)

### Layout:
```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │          │  │          │  │          │  │         │ │
│  │ About    │  │ For      │  │ Legal    │  │ Contact │ │
│  │          │  │ Drivers  │  │          │  │         │ │
│  │ • About  │  │ • Join   │  │ • Terms  │  │ Email:  │ │
│  │   Us     │  │   as     │  │ • Privacy│  │ Phone:  │ │
│  │ • How it │  │   Driver │  │ • Refund │  │ Address:│ │
│  │   works  │  │ • Driver │  │          │  │         │ │
│  │ • Blog   │  │   Login  │  │          │  │ Follow: │ │
│  │          │  │          │  │          │  │ FB Insta│ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                           │
│            ───────────────────────────────               │
│                                                           │
│         © 2026 BusYatra. Made with ❤️ in Jaipur         │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Design Details:

**Background:**
- Color: Dark gray (#2C2C2C)
- Text: White

**Four Columns:**
- Equal width: 25% each
- Gap: 40px between

**Column Headings:**
- 18px, Bold, White
- Margin bottom: 20px

**Links:**
- 16px, Regular, White 80% opacity
- Line height: 2.2
- Hover: White 100%, underline

**Social Icons:**
- Size: 32px
- Color: White
- Hover: Primary orange
- Icons: Facebook, Instagram, Twitter (X)

**Bottom Bar:**
- Border top: 1px solid white 20%
- Padding: 30px top
- Text: 14px, center aligned
- Copyright notice

---

## 📱 MOBILE RESPONSIVE (375px - 767px)

### Key Changes:

1. **Hero:**
   - Font sizes: 50% reduction
   - Search widget: Single column
   - Padding: 24px
   - Full screen height maintained

2. **How it Works:**
   - Cards: Single column, stacked
   - Margin between cards: 32px

3. **Vehicle Types:**
   - Layout: Single column
   - Photo: Full width
   - Details: Below photo
   - Tabs: Scrollable horizontal

4. **Use Cases:**
   - Tabs: Dropdown select instead of pills
   - Content: Single column

5. **Trust & Safety:**
   - Badges: 2×2 grid

6. **Testimonials:**
   - Show 1 card at a time
   - Swipe to navigate

7. **Footer:**
   - Accordion style (collapsible sections)
   - Or single column stack

---

## 🎨 UNIQUE DESIGN ELEMENTS

### 1. **Indian Cultural Context:**
- Marigold flower decorations in corners
- Rangoli-inspired patterns as dividers
- Rajasthani textile patterns as subtle backgrounds

### 2. **Local Language:**
- Hindi prominently displayed
- Not just translation, but culturally relevant phrasing
- Example: "आपकी यात्रा, हमारी जिम्मेदारी" (Your journey, our responsibility)

### 3. **Trust-Building:**
- Real driver photos with names
- Verified badge icons everywhere
- Safety messaging prominent

### 4. **WhatsApp Integration:**
- WhatsApp number visible in multiple places
- "Chat with us" CTA alongside search
- WhatsApp icon in floating action button (mobile)

### 5. **Festive Elements:**
- Use of gold accents (wedding context)
- Celebratory color palette
- Family-focused imagery

---

## 🖼️ IMAGE REQUIREMENTS

### Images Needed (Total: 15-20 high-quality photos)

1. **Hero Background** (1920×1080px)
   - Option A: Decorated bus at Indian wedding
   - Option B: Happy Indian family (3 generations)
   - Must be: High resolution, natural lighting, authentic

2. **Vehicle Photos** (800×500px each × 5 vehicles)
   - Tavera: 6 photos (exterior + interior)
   - Innova: 6 photos
   - Tempo Traveller: 6 photos
   - Mini Bus: 6 photos
   - Volvo Bus: 6 photos
   - Total: 30 photos minimum

3. **Use Case Images** (600×400px each × 3)
   - Wedding: Decorated bus with marigolds
   - Religious tour: Family at temple
   - Family trip: Multi-generation group

4. **Testimonial Photos** (100×100px each × 10)
   - Real customer photos (with permission)
   - Or illustrated avatars (Indian context)

**Where to Get:**
- **Paid:** Unsplash, Pexels, Shutterstock (search: "Indian wedding bus", "tempo traveller India")
- **Your Own:** Take photos of uncle's buses
- **Generate:** MidJourney, DALL-E (prompts provided in spec)

---

## 🎯 INTERACTIONS & ANIMATIONS

### Micro-interactions:
1. **Hover effects:** All buttons lift up 2-4px with shadow increase
2. **Search widget:** Inputs glow blue on focus
3. **Vehicle tabs:** Smooth slide animation when switching
4. **Testimonial carousel:** Fade + slide transition
5. **Scroll animations:** Sections fade in from bottom as user scrolls
6. **Number counters:** Animate count-up when visible
7. **WhatsApp button:** Pulse animation every 3 seconds

### Loading States:
- Search button: Spinner when loading
- Images: Blur placeholder → fade in when loaded
- Vehicle gallery: Skeleton loader

---

## 🛠️ FIGMA DESIGN TOKENS

### Spacing Scale:
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
4xl: 80px
5xl: 120px
```

### Border Radius:
```
sm: 8px (inputs, small cards)
md: 12px (buttons)
lg: 16px (cards, images)
xl: 20px (large sections)
```

### Shadows:
```
sm: 0 2px 8px rgba(0,0,0,0.04)
md: 0 4px 16px rgba(0,0,0,0.08)
lg: 0 10px 40px rgba(0,0,0,0.1)
xl: 0 20px 60px rgba(0,0,0,0.15)
```

---

## ✅ DESIGN CHECKLIST

Before finalizing:
- [ ] All text is readable (contrast ratio 4.5:1 minimum)
- [ ] Buttons are at least 44×44px (touch targets)
- [ ] Images have alt text placeholders
- [ ] Color palette has accessibility labels
- [ ] Mobile breakpoints defined
- [ ] Component library created (buttons, cards, inputs)
- [ ] Font weights available (Regular, Semibold, Bold)
- [ ] Icons are consistent style (outlined or filled, not mixed)
- [ ] Spacing follows 8px grid
- [ ] All CTAs clearly visible

---

## 💾 FIGMA FILE STRUCTURE

```
📁 BusYatra Landing Page
├── 📄 Cover Page (Project info)
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Components (Buttons, Cards, Inputs)
│   ├── Icons
│   └── Spacing
├── 🖥️ Desktop (1440px)
│   └── Landing Page (All sections in one frame)
├── 📱 Mobile (375px)
│   └── Landing Page (All sections in one frame)
└── 📐 Wireframes (Optional)
    └── Low-fidelity layout
```

---

## 🎯 FINAL DELIVERABLE

When design is complete, export:
1. **Full page preview** (PNG, 2x resolution)
2. **Section screenshots** (PNG, individual sections)
3. **Component library** (for developer)
4. **Design tokens** (colors, fonts, spacing) as JSON or CSS
5. **Asset pack** (all icons, images in separate folder)

---

**This spec is ready to be implemented in Figma!** 🎨

Hand this to any designer and they'll know exactly what to build.
