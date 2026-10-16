export type Language = 'ar' | 'en';

export const RTL_LANGUAGES: Language[] = ['ar'];

export type PatientType = 'self' | 'child' | 'helping_someone';

/** Who the companion is to the patient — a nurse asks this on every intake,
 * and it changes how much weight the history carries. */
export type CompanionRelation = 'family' | 'spouse' | 'parent' | 'friend' | 'coworker' | 'caregiver' | 'other';

export type BodySide = 'front' | 'back';

export type BodyShape = 'male' | 'female' | 'child';

export type PainType =
  | 'burning'
  | 'stabbing'
  | 'throbbing'
  | 'pressure'
  | 'aching'
  | 'tingling'
  | 'cramping'
  | 'itching'
  | 'pricking'
  | 'pinching'
  | 'colicky'
  | 'stiffness'
  | 'numbness'
  | 'unknown';

export type Onset = 'minutes' | 'hours' | 'today' | 'days' | 'weeks' | 'months' | 'unknown';

export type Pattern = 'constant' | 'intermittent' | 'on_movement' | 'unknown';

export type ExtraSymptom =
  | 'fever'
  | 'nausea'
  | 'dizziness'
  | 'injury'
  | 'bleeding'
  | 'breathing'
  | 'cant_move';

export interface PainSpot {
  id: string;
  side: BodySide;
  region: string;
  types: PainType[];
  intensity: number | null;
  onset: Onset | null;
  pattern: Pattern | null;
}

export interface Session {
  patientLanguage: Language | null;
  doctorLanguage: Language;
  patientType: PatientType | null;
  /** Only meaningful when patientType is 'helping_someone'. */
  companionRelation: CompanionRelation | null;
  spots: PainSpot[];
  extras: ExtraSymptom[];
  largeMode: boolean;
  audioOn: boolean;
  bodyShape: BodyShape;
  /** Short human-readable code the patient shows at reception, e.g. WDH-7K3M2. */
  visitRef: string;
}

export type Step =
  | 'welcome'
  | 'language'
  | 'patientType'
  | 'bodyMap'
  | 'painType'
  | 'intensity'
  | 'duration'
  | 'pattern'
  | 'extras'
  | 'review'
  | 'doctor';
