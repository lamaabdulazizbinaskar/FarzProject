import { create } from 'zustand';
import { PRODUCT } from '../config/facility';
import type {
  BodyShape,
  CompanionRelation,
  ExtraSymptom,
  Language,
  PainSpot,
  PainType,
  PatientType,
  Session,
  Step,
} from '../types';

interface SessionState extends Session {
  step: Step;
  history: Step[];
  activeSpotId: string | null;
  returnStep: Step;
  historySnapshot: number;
  setStep: (step: Step, opts?: { replace?: boolean }) => void;
  goBack: () => void;
  setPatientLanguage: (lang: Language) => void;
  setDoctorLanguage: (lang: Language) => void;
  setPatientType: (type: PatientType) => void;
  setCompanionRelation: (relation: CompanionRelation) => void;
  setBodyShape: (shape: BodyShape) => void;
  startSpot: (side: 'front' | 'back', region: string) => void;
  updateActiveSpot: (patch: Partial<PainSpot>) => void;
  toggleActiveSpotType: (type: PainType) => void;
  finishSpotFlow: () => void;
  removeSpot: (id: string) => void;
  editSpot: (id: string, returnTo?: Step) => void;
  toggleExtra: (extra: ExtraSymptom) => void;
  setLargeMode: (on: boolean) => void;
  setAudioOn: (on: boolean) => void;
  reset: () => void;
}

const STORAGE_KEY = 'wdih_session_v1';

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

// Excludes characters that are easy to misread aloud or on paper (0/O, 1/I/L).
const REF_ALPHABET = '23456789ACDEFGHJKMNPQRTUVWXY';

function makeVisitRef() {
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)];
  }
  return `${PRODUCT.referencePrefix}-${code}`;
}

function freshSession(): Session {
  return {
    patientLanguage: null,
    doctorLanguage: 'en',
    patientType: null,
    spots: [],
    extras: [],
    largeMode: false,
    audioOn: true,
    bodyShape: 'male',
    companionRelation: null,
    visitRef: makeVisitRef(),
  };
}

function loadPersisted(): Partial<Session> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persist(state: Session) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore persistence failures (private mode, quota, etc.)
  }
}

export const useSessionStore = create<SessionState>((set, get) => ({
  ...freshSession(),
  ...loadPersisted(),
  step: 'welcome',
  history: [],
  activeSpotId: null,
  returnStep: 'bodyMap',
  historySnapshot: 0,

  setStep: (step, opts) =>
    set((state) => ({
      step,
      history: opts?.replace ? state.history : [...state.history, state.step],
    })),

  goBack: () =>
    set((state) => {
      const history = [...state.history];
      const prev = history.pop();
      return prev ? { step: prev, history } : state;
    }),

  setPatientLanguage: (lang) => {
    set({ patientLanguage: lang });
    persist({ ...get(), patientLanguage: lang });
  },

  setDoctorLanguage: (lang) => {
    set({ doctorLanguage: lang });
    persist({ ...get(), doctorLanguage: lang });
  },

  setPatientType: (type) => {
    // The figure should match who is actually being examined: picking "my
    // child" switches the body map to the child silhouette, and moving off
    // it hands the adult figure back.
    const { bodyShape } = get();
    const nextShape = type === 'child' ? 'child' : bodyShape === 'child' ? 'male' : bodyShape;
    const relation = type === 'helping_someone' ? get().companionRelation : null;
    set({ patientType: type, bodyShape: nextShape, companionRelation: relation });
    persist({ ...get(), patientType: type, bodyShape: nextShape, companionRelation: relation });
  },

  setCompanionRelation: (relation) => {
    set({ companionRelation: relation });
    persist({ ...get(), companionRelation: relation });
  },

  setBodyShape: (shape) => {
    set({ bodyShape: shape });
    persist({ ...get(), bodyShape: shape });
  },

  startSpot: (side, region) => {
    const spot: PainSpot = {
      id: makeId(),
      side,
      region,
      types: [],
      intensity: null,
      onset: null,
      pattern: null,
    };
    set({ activeSpotId: spot.id, spots: [...get().spots, spot], returnStep: 'bodyMap', historySnapshot: get().history.length });
  },

  updateActiveSpot: (patch) => {
    const { activeSpotId, spots } = get();
    if (!activeSpotId) return;
    const next = spots.map((s) => (s.id === activeSpotId ? { ...s, ...patch } : s));
    set({ spots: next });
    persist({ ...get(), spots: next });
  },

  // Reads the current types fresh from the store at call time (rather than
  // from a component-level closure) so two rapid taps on different icon
  // cards — which can both fire before React re-renders — never clobber
  // each other's selection.
  toggleActiveSpotType: (type) => {
    const { activeSpotId, spots } = get();
    if (!activeSpotId) return;
    const next = spots.map((s) => {
      if (s.id !== activeSpotId) return s;
      if (type === 'unknown') return { ...s, types: ['unknown'] as PainType[] };
      const withoutUnknown = s.types.filter((t) => t !== 'unknown');
      const types = withoutUnknown.includes(type)
        ? withoutUnknown.filter((t) => t !== type)
        : [...withoutUnknown, type];
      return { ...s, types };
    });
    set({ spots: next });
    persist({ ...get(), spots: next });
  },

  finishSpotFlow: () => {
    const { historySnapshot, returnStep, history } = get();
    const truncated = history.slice(0, historySnapshot);
    set({ activeSpotId: null, step: returnStep, history: truncated });
    persist(get());
  },

  removeSpot: (id) => {
    const next = get().spots.filter((s) => s.id !== id);
    set({ spots: next });
    persist({ ...get(), spots: next });
  },

  editSpot: (id, returnTo = 'bodyMap') => {
    set({ activeSpotId: id, returnStep: returnTo, historySnapshot: get().history.length });
  },

  toggleExtra: (extra) => {
    const extras = get().extras.includes(extra)
      ? get().extras.filter((e) => e !== extra)
      : [...get().extras, extra];
    set({ extras });
    persist({ ...get(), extras });
  },

  setLargeMode: (on) => {
    set({ largeMode: on });
    persist({ ...get(), largeMode: on });
  },

  setAudioOn: (on) => {
    set({ audioOn: on });
    persist({ ...get(), audioOn: on });
  },

  reset: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({
      ...freshSession(),
      step: 'welcome',
      history: [],
      activeSpotId: null,
      returnStep: 'bodyMap',
      historySnapshot: 0,
    });
  },
}));
