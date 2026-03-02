export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  [BOOKING_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [BOOKING_STATUS.CONFIRMED]: 'bg-green-100 text-green-800',
  [BOOKING_STATUS.COMPLETED]: 'bg-blue-100 text-blue-800',
  [BOOKING_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  [BOOKING_STATUS.PENDING]: 'Pending',
  [BOOKING_STATUS.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUS.COMPLETED]: 'Completed',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
};

export const BOOKING_FILTERS = {
  ALL: 'all',
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type BookingFilter = typeof BOOKING_FILTERS[keyof typeof BOOKING_FILTERS];

export const TRIP_TYPE_LABELS: Record<string, string> = {
  one_way: 'One Way',
  round_trip: 'Round Trip',
  multi_day: 'Multi Day',
};

export const PURPOSE_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  corporate: 'Corporate',
  family_trip: 'Family Trip',
  religious: 'Religious',
  tourism: 'Tourism',
  other: 'Other',
};

export const MEMBERSHIP_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const;

export type MembershipTier = typeof MEMBERSHIP_TIERS[keyof typeof MEMBERSHIP_TIERS];

export const MEMBERSHIP_TIER_LABELS: Record<MembershipTier, string> = {
  [MEMBERSHIP_TIERS.BRONZE]: 'Bronze',
  [MEMBERSHIP_TIERS.SILVER]: 'Silver',
  [MEMBERSHIP_TIERS.GOLD]: 'Gold',
  [MEMBERSHIP_TIERS.PLATINUM]: 'Platinum',
};
