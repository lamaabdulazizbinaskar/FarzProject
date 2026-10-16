import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';
import type { Language } from '../types';

export const RTL_LANGUAGES: Language[] = ['ar'];

export const LANGUAGES: { code: Language; nativeName: string; greeting: string; flag: string }[] = [
  { code: 'ar', nativeName: 'العربية', greeting: 'مرحباً', flag: '🇸🇦' },
  { code: 'en', nativeName: 'English', greeting: 'Hello', flag: '🇬🇧' },
];

export const SUPPORTED_LANGUAGES: Language[] = ['ar', 'en'];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function isRtl(lang: Language): boolean {
  return RTL_LANGUAGES.includes(lang);
}

export function applyDocumentDirection(lang: Language) {
  const dir = isRtl(lang) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
}

export default i18n;
