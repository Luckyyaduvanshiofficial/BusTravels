// API endpoint constants - All Django API endpoints
const API_BASE = '/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: `${API_BASE}/users/auth/send-otp/`,
    VERIFY_OTP: `${API_BASE}/users/auth/verify-otp/`,
    REGISTER: `${API_BASE}/users/auth/register/`,
  },
  USERS: {
    LIST: `${API_BASE}/users/users/`,
    DETAIL: (id: string) => `${API_BASE}/users/users/${id}/`,
    ME: `${API_BASE}/users/users/me/`,
  },
  OPERATORS: {
    LIST: `${API_BASE}/users/operators/`,
    DETAIL: (id: string) => `${API_BASE}/users/operators/${id}/`,
  },
  DOCUMENTS: {
    LIST: `${API_BASE}/users/documents/`,
    DETAIL: (id: string) => `${API_BASE}/users/documents/${id}/`,
    UPLOAD: `${API_BASE}/users/documents/`,
    VERIFY: (id: string) => `${API_BASE}/users/documents/${id}/verify/`,
  },
  NOTIFICATIONS: {
    LIST: `${API_BASE}/users/notifications/`,
    DETAIL: (id: string) => `${API_BASE}/users/notifications/${id}/`,
    MARK_READ: (id: string) => `${API_BASE}/users/notifications/${id}/mark-read/`,
  },
  BUSES: {
    LIST: `${API_BASE}/buses/`,
    DETAIL: (id: string) => `${API_BASE}/buses/${id}/`,
    SEARCH: `${API_BASE}/buses/search/`,
    PHOTOS: (busId: string) => `${API_BASE}/buses/${busId}/photos/`,
    PHOTO_DETAIL: (busId: string, photoId: string) => `${API_BASE}/buses/${busId}/photos/${photoId}/`,
    AMENITIES: (busId: string) => `${API_BASE}/buses/${busId}/amenities/`,
    AMENITY_DETAIL: (busId: string, amenityId: string) => `${API_BASE}/buses/${busId}/amenities/${amenityId}/`,
    AVAILABILITY_BLOCKS: (busId: string) => `${API_BASE}/buses/${busId}/availability-blocks/`,
    AVAILABILITY_BLOCK_DETAIL: (busId: string, blockId: string) => `${API_BASE}/buses/${busId}/availability-blocks/${blockId}/`,
  },
  BOOKINGS: {
    LIST: `${API_BASE}/bookings/`,
    DETAIL: (id: string) => `${API_BASE}/bookings/${id}/`,
    CALCULATE_PRICE: `${API_BASE}/bookings/calculate-price/`,
    HEALTH: `${API_BASE}/bookings/health/`,
  },
  PAYMENTS: {
    LIST: `${API_BASE}/bookings/payments/`,
    DETAIL: (id: string) => `${API_BASE}/bookings/payments/${id}/`,
    INITIATE: `${API_BASE}/bookings/payments/initiate/`,
    WEBHOOK: `${API_BASE}/bookings/payments/webhook/`,
    VERIFY: (id: string) => `${API_BASE}/bookings/payments/${id}/verify/`,
  },
  COUPONS: {
    LIST: `${API_BASE}/bookings/coupons/`,
    DETAIL: (id: string) => `${API_BASE}/bookings/coupons/${id}/`,
    VALIDATE: `${API_BASE}/bookings/coupons/validate/`,
    APPLY: `${API_BASE}/bookings/coupons/apply/`,
  },
  REVIEWS: {
    BUS: {
      LIST: `${API_BASE}/reviews/bus/`,
      DETAIL: (id: string) => `${API_BASE}/reviews/bus/${id}/`,
    },
    OPERATOR: {
      LIST: `${API_BASE}/reviews/operator/`,
      DETAIL: (id: string) => `${API_BASE}/reviews/operator/${id}/`,
    },
  },
};
