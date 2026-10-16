import i18n from '../i18n';
import type { Language, PainSpot } from '../types';

/**
 * The region name a clinician should read. Patients pick from plain language
 * ("Lower belly, right side"); the chart shows the accepted clinical term
 * ("Right iliac fossa") where one exists, and falls back to the plain label
 * for regions that have no separate clinical name.
 */
function clinicalRegion(region: string, lang: Language): string {
  const tf = i18n.getFixedT(lang, 'translation');
  return tf(`clinicalRegions.${region}`, { defaultValue: tf(`bodyMap.regions.${region}`) });
}

export interface ClinicalField {
  label: string;
  value: string;
}

/** Structured chart-style fields for one spot — Location / Quality / Intensity / Onset / Pattern. */
export function clinicalFields(spot: PainSpot, lang: Language): ClinicalField[] {
  const tf = i18n.getFixedT(lang, 'translation');
  const types = spot.types.map((ty) => tf(`painType.types.${ty}`)).join(', ');
  const onset = spot.onset ? tf(`duration.options.${spot.onset}`) : tf('duration.options.unknown');
  const pattern = spot.pattern ? tf(`pattern.options.${spot.pattern}`) : tf('pattern.options.unknown');
  return [
    { label: tf('doctor.region'), value: clinicalRegion(spot.region, lang) },
    { label: tf('doctor.type'), value: types },
    { label: tf('doctor.intensity'), value: `${spot.intensity ?? '–'}/10` },
    { label: tf('doctor.onset'), value: onset },
    { label: tf('doctor.pattern'), value: pattern },
  ];
}
