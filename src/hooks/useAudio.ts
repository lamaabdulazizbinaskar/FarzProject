import { useCallback, useRef } from 'react';
import { useSessionStore } from '../state/sessionStore';

const LOCALE_TAG: Record<string, string> = {
  ar: 'ar-SA',
  en: 'en-US',
  ur: 'ur-PK',
  hi: 'hi-IN',
  bn: 'bn-BD',
  tl: 'fil-PH',
};

export function useAudio(lang: string) {
  const audioOn = useSessionStore((s) => s.audioOn);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string) => {
      if (!audioOn || !text) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = LOCALE_TAG[lang] ?? 'en-US';
        utter.rate = 0.95;
        utterRef.current = utter;
        window.speechSynthesis.speak(utter);
      } catch {
        // speech synthesis not available — audio is a supplement, not a dependency
      }
    },
    [audioOn, lang],
  );

  return { speak };
}
