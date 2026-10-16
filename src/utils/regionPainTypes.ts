import type { PainType } from '../types';

// Curated per-region pain-quality vocabularies: a doctor reads very different
// words depending on where the pain is (e.g. "colicky" for the gut, "throbbing"
// for the head). Showing only the clinically relevant descriptors per region —
// instead of one generic list for the whole body — makes each answer more
// useful to the clinician and faster for the patient to pick from.
const REGION_PAIN_TYPES: Record<string, PainType[]> = {
  head: ['throbbing', 'pressure', 'stabbing', 'pricking', 'aching'],
  neck: ['stiffness', 'aching', 'stabbing', 'cramping', 'pricking'],

  chest_left: ['pressure', 'burning', 'stabbing', 'throbbing', 'aching', 'pricking'],
  chest_right: ['pressure', 'burning', 'stabbing', 'throbbing', 'aching', 'pricking'],

  epigastric: ['colicky', 'cramping', 'burning', 'pinching', 'pressure', 'stabbing'],
  umbilical: ['colicky', 'cramping', 'burning', 'pinching', 'pressure', 'stabbing'],
  hypogastric: ['colicky', 'cramping', 'burning', 'pinching', 'pressure', 'stabbing'],
  hypochondriac_left: ['colicky', 'cramping', 'burning', 'pinching', 'pressure', 'stabbing'],
  hypochondriac_right: ['colicky', 'cramping', 'burning', 'pinching', 'pressure', 'stabbing'],
  flank_left: ['colicky', 'cramping', 'burning', 'pinching', 'pressure', 'stabbing'],
  flank_right: ['colicky', 'cramping', 'burning', 'pinching', 'pressure', 'stabbing'],
  iliac_left: ['colicky', 'cramping', 'burning', 'pinching', 'pressure', 'stabbing'],
  iliac_right: ['colicky', 'cramping', 'burning', 'pinching', 'pressure', 'stabbing'],

  back_upper: ['aching', 'stabbing', 'stiffness', 'cramping', 'pricking', 'pressure'],
  loin_left: ['aching', 'stabbing', 'stiffness', 'cramping', 'pricking', 'pressure'],
  loin_right: ['aching', 'stabbing', 'stiffness', 'cramping', 'pricking', 'pressure'],

  shoulder_left: ['stiffness', 'aching', 'stabbing', 'cramping', 'pricking'],
  shoulder_right: ['stiffness', 'aching', 'stabbing', 'cramping', 'pricking'],

  arm_left: ['aching', 'cramping', 'tingling', 'numbness', 'stabbing', 'pricking'],
  arm_right: ['aching', 'cramping', 'tingling', 'numbness', 'stabbing', 'pricking'],
  leg_left: ['aching', 'cramping', 'tingling', 'numbness', 'stabbing', 'pricking'],
  leg_right: ['aching', 'cramping', 'tingling', 'numbness', 'stabbing', 'pricking'],

  hand_left: ['tingling', 'numbness', 'burning', 'pricking', 'itching', 'aching'],
  hand_right: ['tingling', 'numbness', 'burning', 'pricking', 'itching', 'aching'],
  foot_left: ['tingling', 'numbness', 'burning', 'pricking', 'itching', 'aching'],
  foot_right: ['tingling', 'numbness', 'burning', 'pricking', 'itching', 'aching'],

  elbow_left: ['stiffness', 'stabbing', 'aching', 'pressure', 'cramping'],
  elbow_right: ['stiffness', 'stabbing', 'aching', 'pressure', 'cramping'],

  knee_left: ['stiffness', 'stabbing', 'aching', 'pressure', 'cramping'],
  knee_right: ['stiffness', 'stabbing', 'aching', 'pressure', 'cramping'],
};

const DEFAULT_PAIN_TYPES: PainType[] = [
  'burning',
  'stabbing',
  'throbbing',
  'pressure',
  'aching',
  'tingling',
  'cramping',
  'itching',
];

/** Pain-quality options relevant to a given body region, always ending in 'unknown'. */
export function getPainTypesForRegion(region: string | undefined): PainType[] {
  const base = (region && REGION_PAIN_TYPES[region]) || DEFAULT_PAIN_TYPES;
  return [...base, 'unknown'];
}
