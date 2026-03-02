export const VEHICLE_TYPES = [
  { id: 'tavera', label: 'Tavera', capacity: '7 Seater', description: 'Perfect for small families and quick outstation trips.', imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000' },
  { id: 'innova', label: 'Innova Crysta', capacity: '7 Seater', description: 'Premium comfort for corporate trips and family tours.', imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1000' },
  { id: 'tempo-traveller', label: 'Tempo Traveller', capacity: '12–17 Seater', description: 'Ideal for group outings, friend trips, and localized tours.', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000' },
  { id: 'mini-bus', label: 'Mini Bus', capacity: '20–35 Seater', description: 'Best for corporate outings, school trips, and mid-sized weddings.', imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1000' },
  { id: 'volvo-bus', label: 'Volvo Bus', capacity: '40–50 Seater', description: 'Luxury intercity travel for large wedding parties and tours.', imageUrl: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&q=80&w=1000' },
]

export const POPULAR_ROUTES = [
  { id: 'jaipur-khatu', from: 'Jaipur', to: 'Khatu Shyam Ji', distance: '80 km', duration: '2 hours', bestTime: 'Early morning', priceRange: '₹2,500 - ₹4,000', description: 'Daily religious trips with comfortable seating and AC options.', imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&q=80&w=800' },
  { id: 'jaipur-delhi', from: 'Jaipur', to: 'Delhi', distance: '280 km', duration: '5 hours', bestTime: 'Night departure', priceRange: '₹8,000 - ₹12,000', description: 'Smooth intercity travel for business or leisure with premium buses.', imageUrl: 'https://images.unsplash.com/photo-1587474260580-5895781bd468?auto=format&fit=crop&q=80&w=800' },
  { id: 'jaipur-salasar', from: 'Jaipur', to: 'Salasar Balaji', distance: '170 km', duration: '3.5 hours', bestTime: 'Weekend mornings', priceRange: '₹4,500 - ₹7,000', description: 'Comfortable family and group trips to Salasar Balaji temple.', imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f41ab4e3?auto=format&fit=crop&q=80&w=800' },
  { id: 'jaipur-ajmer', from: 'Jaipur', to: 'Ajmer / Pushkar', distance: '140 km', duration: '3 hours', bestTime: 'Fri–Sun slots', priceRange: '₹3,500 - ₹5,500', description: 'Explore the holy cities of Ajmer and Pushkar with expert drivers.', imageUrl: 'https://images.unsplash.com/photo-1555519800-4b0c266cf17f?auto=format&fit=crop&q=80&w=800' },
]

export const DRIVER_PROFILES = [
  { id: 'd1', name: 'Ramesh Singh', experience: '15 Years', languages: ['Hindi', 'English', 'Marwari'], specialization: 'Volvo & Luxury Buses', rating: 4.8, trips: 1200, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'd2', name: 'Vikram Sharma', experience: '8 Years', languages: ['Hindi', 'English'], specialization: 'Tempo Traveller, Innova', rating: 4.9, trips: 850, imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'd3', name: 'Abdul Khan', experience: '12 Years', languages: ['Hindi', 'Urdu', 'English'], specialization: 'Mini Bus, Interstate', rating: 4.7, trips: 940, imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'd4', name: 'Sunil Gurjar', experience: '10 Years', languages: ['Hindi', 'Marwari'], specialization: 'Outstation Religious Tours', rating: 4.9, trips: 1100, imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200' },
]

export const TESTIMONIALS = [
  { id: 't1', name: 'Rajesh Kumar', location: 'Jaipur, Rajasthan', rating: 5, role: 'Wedding Barat', text: "Used BusYatra for my son's wedding barat. The buses were beautifully decorated with marigolds and the driver was punctual to the minute. Guests were very impressed. Highly recommend!", avatar: 'RK', avatarColor: 'bg-saffron' },
  { id: 't2', name: 'Sunita Sharma', location: 'Jodhpur, Rajasthan', rating: 5, role: 'Khatu Shyam Ji Tour', text: 'We booked a Tempo Traveller for our group of 14 seniors to Khatu Shyam Ji. Very comfortable, AC worked great, and the driver waited patiently at the temple. Will use again for Salasar!', avatar: 'SS', avatarColor: 'bg-royalBlue' },
  { id: 't3', name: 'Amit Patel', location: 'Jaipur, Rajasthan', rating: 5, role: 'Family Trip to Ranthambore', text: 'Excellent service! Booked an Innova for our family trip to Ranthambore. The negotiation feature is brilliant — I got the price I wanted and the driver was very professional.', avatar: 'AP', avatarColor: 'bg-forestGreen' },
  { id: 't4', name: 'Priya Meena', location: 'Ajmer, Rajasthan', rating: 5, role: 'Corporate Outing', text: 'Organized our company picnic for 35 people using BusYatra. The Mini Bus was perfect, clean, and air-conditioned. The WhatsApp support team was incredible throughout the day.', avatar: 'PM', avatarColor: 'bg-deepPurple' },
  { id: 't5', name: 'Deepak Verma', location: 'Alwar, Rajasthan', rating: 5, role: 'Pushkar Mela', text: 'Booked 3 buses for the Pushkar Mela trip with our village group. BusYatra arranged everything smoothly. The driver knew every backroad to avoid traffic. Amazing experience!', avatar: 'DV', avatarColor: 'bg-terracotta' },
]

export const TRUST_STATS = [
  { label: 'Verified Operators', value: '100+' },
  { label: 'Happy Customers', value: '5,000+' },
  { label: 'Cities Covered', value: '50+' },
  { label: 'Average Rating', value: '4.8/5' },
]

export const USE_CASES = [
  { id: 'weddings', title: 'Weddings & Events', description: 'Luxury buses and Tempo Travellers for your guests.', icon: 'PartyPopper' },
  { id: 'religious', title: 'Religious Tours', description: 'Comfortable trips to Khatu Shyam, Salasar, and Pushkar.', icon: 'Church' },
  { id: 'corporate', title: 'Corporate Outings', description: 'Reliable fleet for team building and offsites.', icon: 'Briefcase' },
  { id: 'family', title: 'Family Vacations', description: 'Spacious vehicles for weekend getaways.', icon: 'Users' },
]

export const FAQ_DATA = [
  { question: "How do I book a bus on BusYatra?", answer: "To book a bus, simply enter your pickup location, destination, date, and passenger count in the search bar. We will show you verified buses matching your criteria." },
  { question: "Are your bus operators verified?", answer: "Yes, every bus operator on BusYatra goes through a strict verification process, including background checks, vehicle condition audits, and license reviews." },
  { question: "Do prices include toll and tax?", answer: "The initial quote provides a transparent breakdown. Some listings are all-inclusive, while others specify driver allowance, tolls, and state taxes separately." },
  { question: "Can I cancel my booking?", answer: "Yes, you can cancel your booking through your dashboard. Cancellation charges may apply depending on how close to the trip date you cancel." },
  { question: "What if the bus breaks down during the trip?", answer: "We partner only with highly reliable operators. In the rare event of a breakdown, we immediately coordinate with the operator to provide a replacement vehicle." }
]
