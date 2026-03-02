export interface SearchFormData {
  fromLocation: string;
  toLocation: string;
  journeyDate: Date | undefined;
  passengers: number;
}

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  distance: string;
  startingPrice: number;
  type: 'religious' | 'wedding' | 'wildlife';
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  purpose: 'Wedding' | 'Religious' | 'Corporate';
  quote: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  number: number;
  icon: string;
  title: string;
  description: string;
}