/**
 * Mock data for Charter Bus Platform
 * Used in: search, results, vehicle detail, seat-selection pages
 */
import type {
  BusRoute,
  PopularRoute,
  VehicleDetail,
  SeatLayout,
  Seat,
  Review,
} from './search-types'

// ─── Popular Routes ────────────────────────────────────────────────────────

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'pr1',
    from: 'Delhi',
    to: 'Jaipur',
    startingPrice: 800,
    imageUrl: '/images/routes/delhi-jaipur.jpg',
  },
  {
    id: 'pr2',
    from: 'Mumbai',
    to: 'Goa',
    startingPrice: 1200,
    imageUrl: '/images/routes/mumbai-goa.jpg',
  },
  {
    id: 'pr3',
    from: 'Jaipur',
    to: 'Delhi',
    startingPrice: 750,
    imageUrl: '/images/routes/jaipur-delhi.jpg',
  },
  {
    id: 'pr4',
    from: 'Bangalore',
    to: 'Chennai',
    startingPrice: 900,
    imageUrl: '/images/routes/blr-chennai.jpg',
  },
  {
    id: 'pr5',
    from: 'Hyderabad',
    to: 'Mumbai',
    startingPrice: 1100,
    imageUrl: '/images/routes/hyd-mumbai.jpg',
  },
  {
    id: 'pr6',
    from: 'Pune',
    to: 'Goa',
    startingPrice: 650,
    imageUrl: '/images/routes/pune-goa.jpg',
  },
]

// ─── Bus Routes (Results) ─────────────────────────────────────────────────

export const MOCK_BUS_ROUTES: BusRoute[] = [
  {
    id: 'br1',
    busId: 'b1',
    busName: 'Rajdhani Express Sleeper',
    busType: 'AC Sleeper',
    operatorName: 'Sharma Travels',
    operatorVerified: true,
    fromCity: 'Jaipur',
    toCity: 'Delhi',
    departureTime: '22:00',
    arrivalTime: '04:00',
    durationHours: 6,
    pricePerSeat: 850,
    totalSeats: 36,
    availableSeats: 12,
    rating: 4.5,
    reviewCount: 120,
    amenities: ['2+1 Seating', 'Blankets & Pillows', 'Charging Points', 'Water Bottle'],
    images: ['/images/bus/bus1-1.jpg', '/images/bus/bus1-2.jpg'],
    deckType: 'double',
  },
  {
    id: 'br2',
    busId: 'b2',
    busName: 'Pink City Luxury Coach',
    busType: 'Non-AC Sleeper',
    operatorName: 'Royal Volvo Services',
    operatorVerified: true,
    fromCity: 'Jaipur',
    toCity: 'Delhi',
    departureTime: '21:00',
    arrivalTime: '03:30',
    durationHours: 6.5,
    pricePerSeat: 620,
    totalSeats: 40,
    availableSeats: 18,
    rating: 4.2,
    reviewCount: 87,
    amenities: ['Blankets', 'Charging Points'],
    images: ['/images/bus/bus2-1.jpg'],
    deckType: 'double',
  },
  {
    id: 'br3',
    busId: 'b3',
    busName: 'Comfort Seater Express',
    busType: 'Seater',
    operatorName: 'Golden Wheels',
    operatorVerified: false,
    fromCity: 'Jaipur',
    toCity: 'Delhi',
    departureTime: '06:30',
    arrivalTime: '12:00',
    durationHours: 5.5,
    pricePerSeat: 450,
    totalSeats: 52,
    availableSeats: 32,
    rating: 3.9,
    reviewCount: 45,
    amenities: ['Charging Points', 'Water Bottle'],
    images: ['/images/bus/bus3-1.jpg'],
    deckType: 'single',
  },
  {
    id: 'br4',
    busId: 'b4',
    busName: 'Luxury Presidential Coach',
    busType: 'Luxury',
    operatorName: 'Premier Bus Lines',
    operatorVerified: true,
    fromCity: 'Jaipur',
    toCity: 'Delhi',
    departureTime: '23:30',
    arrivalTime: '05:00',
    durationHours: 5.5,
    pricePerSeat: 1400,
    totalSeats: 24,
    availableSeats: 4,
    rating: 4.8,
    reviewCount: 203,
    amenities: ['2+1 Seating', 'Blankets & Pillows', 'Charging Points', 'Water Bottle', 'WiFi', 'Reading Light'],
    images: ['/images/bus/bus4-1.jpg', '/images/bus/bus4-2.jpg', '/images/bus/bus4-3.jpg'],
    deckType: 'double',
  },
  {
    id: 'br5',
    busId: 'b5',
    busName: 'Night Rider AC Sleeper',
    busType: 'AC Sleeper',
    operatorName: 'Sunrise Travels',
    operatorVerified: true,
    fromCity: 'Jaipur',
    toCity: 'Delhi',
    departureTime: '22:45',
    arrivalTime: '05:15',
    durationHours: 6.5,
    pricePerSeat: 780,
    totalSeats: 36,
    availableSeats: 20,
    rating: 4.3,
    reviewCount: 66,
    amenities: ['2+1 Seating', 'Blankets', 'Charging Points'],
    images: ['/images/bus/bus5-1.jpg'],
    deckType: 'double',
  },
]

// ─── Mock Reviews ─────────────────────────────────────────────────────────

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev1',
    authorName: 'Raj K.',
    rating: 5,
    title: 'Clean and comfortable',
    body: 'The bus was very clean and the staff was polite. Blankets were fresh and the AC was perfect.',
    travelDate: '12 Mar 2026',
    verified: true,
    createdAt: '2026-03-13',
  },
  {
    id: 'rev2',
    authorName: 'Sunita S.',
    rating: 4,
    title: 'Good experience',
    body: 'Reached on time. AC was good. The berths could be a bit more cushioned.',
    travelDate: '10 Mar 2026',
    verified: true,
    createdAt: '2026-03-11',
  },
  {
    id: 'rev3',
    authorName: 'Arun M.',
    rating: 4,
    title: 'Comfortable journey',
    body: 'Overall a smooth journey. Driver was careful and punctual.',
    travelDate: '8 Mar 2026',
    verified: true,
    createdAt: '2026-03-09',
  },
]

// ─── Seat Layout Generator ─────────────────────────────────────────────────

function makeSeat(
  row: number,
  col: number,
  deck: 'upper' | 'lower',
  status: Seat['status'] = 'available',
  price = 850
): Seat {
  const prefix = deck === 'upper' ? 'U' : 'L'
  const num = row * 3 + col + 1
  return {
    id: `${prefix}${String(num).padStart(2, '0')}`,
    number: `${prefix}${String(num).padStart(2, '0')}`,
    deck,
    row,
    col,
    status,
    price,
  }
}

export function generateSeatLayout(routeId: string): SeatLayout {
  const statuses: Seat['status'][] = ['available', 'available', 'booked', 'available', 'ladies', 'available']

  const makeRow = (
    deck: 'upper' | 'lower',
    row: number
  ): Seat[] => [
    makeSeat(row, 0, deck, statuses[(row + deck.length) % statuses.length]),
    makeSeat(row, 1, deck, statuses[(row + 1) % statuses.length]),
    makeSeat(row, 2, deck, statuses[(row + 2) % statuses.length]),
  ]

  const upperDeck = Array.from({ length: 9 }, (_, i) => makeRow('upper', i))
  const lowerDeck = Array.from({ length: 9 }, (_, i) => makeRow('lower', i))

  // Mark a few as booked for realism
  upperDeck[2][0].status = 'booked'
  upperDeck[5][2].status = 'booked'
  lowerDeck[1][1].status = 'booked'
  lowerDeck[3][0].status = 'ladies'
  lowerDeck[7][2].status = 'booked'

  return {
    upperDeck,
    lowerDeck,
    seatsPerRow: [2, 1],
  }
}

// ─── Vehicle Detail ────────────────────────────────────────────────────────

export const MOCK_VEHICLE_DETAIL: VehicleDetail = {
  ...MOCK_BUS_ROUTES[0],
  description:
    'Modern AC Sleeper bus with comfortable berths perfect for overnight journeys. Equipped with latest safety features and experienced drivers.',
  totalReviews: 120,
  overallRating: 4.5,
  allAmenities: [
    { icon: '❄️', label: 'Air Conditioning' },
    { icon: '🛏️', label: '2+1 Seating' },
    { icon: '🛡️', label: 'Blankets & Pillows' },
    { icon: '🔌', label: 'Charging Points' },
    { icon: '💧', label: 'Water Bottle' },
    { icon: '💡', label: 'Reading Lights' },
    { icon: '🚪', label: 'Emergency Exit' },
    { icon: '📸', label: 'CCTV' },
  ],
  boardingPoints: [
    { id: 'bp1', name: 'Jaipur Railway Station', time: '21:45', address: 'Station Road, Jaipur' },
    { id: 'bp2', name: 'Sindhi Camp', time: '22:00', address: 'Sindhi Camp Bus Stand, Jaipur' },
    { id: 'bp3', name: 'Vaishali Nagar', time: '22:15', address: 'C-Scheme, Jaipur' },
  ],
  droppingPoints: [
    { id: 'dp1', name: 'Gurgaon Sector 14', time: '03:30', address: 'Sector 14, Gurgaon' },
    { id: 'dp2', name: 'Delhi ISBT Kashmere Gate', time: '04:00', address: 'Kashmere Gate, Delhi' },
  ],
  restStops: [
    { time: '01:00 AM', name: 'Jaipur Highway Dhaba', duration: 15 },
  ],
  cancellationPolicy: [
    'Free cancellation up to 24 hours before departure',
    '50% refund if cancelled 6–24 hours before departure',
    'No refund for cancellation within 6 hours of departure',
  ],
  reviews: MOCK_REVIEWS,
}
