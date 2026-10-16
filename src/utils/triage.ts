import type { ExtraSymptom, PainSpot } from '../types';

/**
 * Rule-based triage support, loosely modelled on the 5-level CTAS acuity scale
 * that many hospitals use. This is deliberately transparent and deterministic —
 * every level comes with the reasons that produced it, so a nurse can see
 * exactly why a patient was flagged and overrule it.
 *
 * Important: this reads ONLY patient-reported input. Level 1 (Resuscitation)
 * is never auto-assigned, because it requires vital signs and a physical
 * assessment we do not have. This is triage *support*, not a diagnosis.
 */
export type TriageLevel = 2 | 3 | 4 | 5;

export interface TriageResult {
  level: TriageLevel;
  /** i18n keys describing what drove the level, shown to staff. */
  reasonKeys: string[];
}

const CHEST_REGIONS = new Set(['chest_left', 'chest_right']);

interface TriageInput {
  spots: PainSpot[];
  extras: ExtraSymptom[];
}

export function assessTriage({ spots, extras }: TriageInput): TriageResult {
  const reasonKeys: string[] = [];
  const maxIntensity = spots.reduce((max, s) => Math.max(max, s.intensity ?? 0), 0);
  const chestPainSevere = spots.some((s) => CHEST_REGIONS.has(s.region) && (s.intensity ?? 0) >= 7);

  // Level 2 — Emergent
  if (extras.includes('breathing')) reasonKeys.push('triage.reasons.breathing');
  if (chestPainSevere) reasonKeys.push('triage.reasons.chestPain');
  if (maxIntensity >= 10) reasonKeys.push('triage.reasons.maxPain');
  if (reasonKeys.length > 0) return { level: 2, reasonKeys };

  // Level 3 — Urgent
  if (extras.includes('bleeding')) reasonKeys.push('triage.reasons.bleeding');
  if (maxIntensity >= 7) reasonKeys.push('triage.reasons.severePain');
  if (extras.includes('cant_move')) reasonKeys.push('triage.reasons.cantMove');
  if (extras.includes('injury') && maxIntensity >= 5) reasonKeys.push('triage.reasons.injury');
  if (extras.includes('fever') && (extras.includes('nausea') || extras.includes('dizziness'))) {
    reasonKeys.push('triage.reasons.feverPlus');
  }
  if (reasonKeys.length > 0) return { level: 3, reasonKeys };

  // Level 4 — Less urgent
  if (maxIntensity >= 4) {
    reasonKeys.push('triage.reasons.moderatePain');
    return { level: 4, reasonKeys };
  }

  // Level 5 — Non-urgent
  reasonKeys.push('triage.reasons.lowPain');
  return { level: 5, reasonKeys };
}

/** Tailwind classes per level, used for badges and queue row accents. */
export const TRIAGE_STYLES: Record<TriageLevel, { badge: string; accent: string; dot: string }> = {
  2: { badge: 'bg-red-100 text-red-700 ring-red-200', accent: 'border-s-red-500', dot: 'bg-red-500' },
  3: { badge: 'bg-orange-100 text-orange-700 ring-orange-200', accent: 'border-s-orange-500', dot: 'bg-orange-500' },
  4: { badge: 'bg-amber-100 text-amber-700 ring-amber-200', accent: 'border-s-amber-500', dot: 'bg-amber-500' },
  5: { badge: 'bg-emerald-100 text-emerald-700 ring-emerald-200', accent: 'border-s-emerald-500', dot: 'bg-emerald-500' },
};

export const TRIAGE_LEVELS: TriageLevel[] = [2, 3, 4, 5];
