import { useTranslation } from 'react-i18next';
import i18n, { LANGUAGES, SUPPORTED_LANGUAGES, applyDocumentDirection } from '../i18n';
import { useSessionStore } from '../state/sessionStore';
import { StepLayout } from '../components/base/StepLayout';
import { OptionCard } from '../components/base/OptionCard';
import { useAudio } from '../hooks/useAudio';
import type { Language } from '../types';

export function LanguagePickerScreen() {
  const { t } = useTranslation();
  const patientLanguage = useSessionStore((s) => s.patientLanguage);
  const history = useSessionStore((s) => s.history);
  const setPatientLanguage = useSessionStore((s) => s.setPatientLanguage);
  const setStep = useSessionStore((s) => s.setStep);
  const goBack = useSessionStore((s) => s.goBack);
  const { speak } = useAudio(patientLanguage ?? 'en');

  // Whether this screen was reached straight from Welcome (vs. revisited via
  // the TopBar language switcher mid-flow) — derived from history rather than
  // from patientType, since patientType can be non-null from a persisted
  // sessionStorage session even on a fresh reload that resets back to Welcome.
  const cameFromWelcome = history[history.length - 1] === 'welcome';

  const handlePick = (lang: Language) => {
    setPatientLanguage(lang);
    i18n.changeLanguage(SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en');
    applyDocumentDirection(lang);
    const greeting = LANGUAGES.find((l) => l.code === lang)?.greeting ?? '';
    speak(greeting);
  };

  const handleNext = () => {
    if (cameFromWelcome) {
      setStep('patientType');
    } else {
      goBack();
    }
  };

  return (
    <StepLayout
      animKey="language"
      title={`${t('language.title')} 🌍`}
      subtitle={t('language.subtitle')}
      showLanguage={false}
      showBack={!cameFromWelcome}
      onBack={goBack}
      onNext={handleNext}
      nextDisabled={!patientLanguage}
      wide
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {LANGUAGES.map((lang) => (
          <OptionCard
            key={lang.code}
            selected={patientLanguage === lang.code}
            onClick={() => handlePick(lang.code)}
            ariaLabel={lang.nativeName}
            className="flex flex-col items-center gap-2 py-6 text-center"
          >
            <span aria-hidden="true" className="text-4xl leading-none">{lang.flag}</span>
            <span className="text-2xl">{lang.nativeName}</span>
          </OptionCard>
        ))}
      </div>
    </StepLayout>
  );
}
