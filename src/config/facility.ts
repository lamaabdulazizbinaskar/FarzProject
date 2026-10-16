/**
 * Product identity. "فرز" (Farz) is the Arabic clinical term for triage —
 * the app performs a wordless first assessment and hands the clinician a
 * priority with its reasons.
 */
export const PRODUCT = {
  nameAr: 'فرز',
  nameEn: 'Farz',
  /** Prefix for patient-facing visit reference codes. */
  referencePrefix: 'FRZ',
} as const;

/**
 * Facility identity shown on staff-facing documents and the triage board.
 * These are placeholders — swap them for the deploying hospital's own details.
 * Keep them generic here: never ship another institution's name or branding.
 */
export const FACILITY = {
  name: 'General Hospital',
  department: 'Emergency Department',
} as const;
