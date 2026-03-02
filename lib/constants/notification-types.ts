// Notification types - Matches Django backend Notification model
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMED: 'booking_confirmed',
  PAYMENT_RECEIVED: 'payment_received',
  REVIEW_ADDED: 'review_added',
  DOCUMENT_VERIFIED: 'document_verified',
  BUS_APPROVED: 'bus_approved',
  GENERAL: 'general',
} as const;

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  [NOTIFICATION_TYPES.BOOKING_CONFIRMED]: 'Booking Confirmed',
  [NOTIFICATION_TYPES.PAYMENT_RECEIVED]: 'Payment Received',
  [NOTIFICATION_TYPES.REVIEW_ADDED]: 'Review Added',
  [NOTIFICATION_TYPES.DOCUMENT_VERIFIED]: 'Document Verified',
  [NOTIFICATION_TYPES.BUS_APPROVED]: 'Bus Approved',
  [NOTIFICATION_TYPES.GENERAL]: 'General',
};

export const NOTIFICATION_TYPE_ICONS: Record<string, string> = {
  [NOTIFICATION_TYPES.BOOKING_CONFIRMED]: '✓',
  [NOTIFICATION_TYPES.PAYMENT_RECEIVED]: '₹',
  [NOTIFICATION_TYPES.REVIEW_ADDED]: '⭐',
  [NOTIFICATION_TYPES.DOCUMENT_VERIFIED]: '📄',
  [NOTIFICATION_TYPES.BUS_APPROVED]: '🚌',
  [NOTIFICATION_TYPES.GENERAL]: 'ℹ',
};

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
