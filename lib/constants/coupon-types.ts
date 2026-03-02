// Coupon types - Matches Django backend Coupon model discount_type field
export const COUPON_DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;

export const COUPON_DISCOUNT_TYPE_LABELS: Record<string, string> = {
  [COUPON_DISCOUNT_TYPES.PERCENTAGE]: 'Percentage',
  [COUPON_DISCOUNT_TYPES.FIXED]: 'Fixed Amount',
};

export const COUPON_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
} as const;

export type CouponDiscountType = typeof COUPON_DISCOUNT_TYPES[keyof typeof COUPON_DISCOUNT_TYPES];
export type CouponStatus = typeof COUPON_STATUS[keyof typeof COUPON_STATUS];
