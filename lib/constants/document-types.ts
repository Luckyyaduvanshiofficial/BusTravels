// Document types - Matches Django backend Document model
export const DOCUMENT_TYPES = {
  AADHAR: 'aadhar',
  PAN: 'pan',
  DRIVING_LICENSE: 'driving_license',
  RC_BOOK: 'rc_book',
  INSURANCE: 'insurance',
  PERMIT: 'permit',
  FITNESS: 'fitness',
  POLLUTION: 'pollution',
} as const;

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  [DOCUMENT_TYPES.AADHAR]: 'Aadhar Card',
  [DOCUMENT_TYPES.PAN]: 'PAN Card',
  [DOCUMENT_TYPES.DRIVING_LICENSE]: 'Driving License',
  [DOCUMENT_TYPES.RC_BOOK]: 'RC Book',
  [DOCUMENT_TYPES.INSURANCE]: 'Insurance',
  [DOCUMENT_TYPES.PERMIT]: 'Permit',
  [DOCUMENT_TYPES.FITNESS]: 'Fitness Certificate',
  [DOCUMENT_TYPES.POLLUTION]: 'Pollution Certificate',
};

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export const VERIFICATION_STATUS_LABELS: Record<string, string> = {
  [VERIFICATION_STATUS.PENDING]: 'Pending',
  [VERIFICATION_STATUS.VERIFIED]: 'Verified',
  [VERIFICATION_STATUS.REJECTED]: 'Rejected',
};

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];
export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];
