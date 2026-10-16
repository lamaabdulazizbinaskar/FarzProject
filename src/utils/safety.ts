import type { PainSpot, Session } from '../types';

const CHEST_REGIONS = new Set(['chest_left', 'chest_right']);

export function isSpotHighRisk(spot: Pick<PainSpot, 'region' | 'intensity'>): boolean {
  return CHEST_REGIONS.has(spot.region) && (spot.intensity ?? 0) >= 7;
}

export function isSessionHighRisk(session: Pick<Session, 'spots' | 'extras'>): boolean {
  if (session.extras.includes('breathing')) return true;
  return session.spots.some(isSpotHighRisk);
}
