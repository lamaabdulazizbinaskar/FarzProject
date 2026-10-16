import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../state/sessionStore';
import { LANGUAGES } from '../i18n';
import { Button } from '../components/base/Button';
import { WelcomeHero } from '../components/WelcomeHero';
import { FACILITY, PRODUCT } from '../config/facility';
import { AlertIcon, CheckIcon, GlobeIcon, MedicalCrossIcon } from '../components/icons/UiIcons';

export function WelcomeScreen() {
  const { t } = useTranslation();
  const setStep = useSessionStore((s) => s.setStep);
  const start = () => setStep('language');

  const trust = [
    { key: 'welcome.trustNoTyping', Icon: CheckIcon },
    { key: 'welcome.trustNoAccount', Icon: CheckIcon },
    { key: 'welcome.trustLanguages', Icon: GlobeIcon },
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-bg">
      {/* Ambient wash — large, soft, well behind the content */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary-soft opacity-70 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-pain-soft opacity-50 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between gap-3 border-b-2 border-primary bg-surface px-5 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded bg-primary text-white">
            <MedicalCrossIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-bold text-text">
              {PRODUCT.nameAr} <span className="text-text-muted">·</span> {PRODUCT.nameEn}
            </p>
            <p className="text-[11px] text-text-muted">
              {FACILITY.name} · {FACILITY.department}
            </p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary-dark">
          <GlobeIcon className="h-4 w-4" />
          {t('welcome.trustLanguages')}
        </span>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-5xl flex-1 items-center gap-5 px-6 py-4 sm:px-8 sm:py-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12">
        <div className="order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-start">
          <h1 className="font-display text-[1.9rem] font-bold leading-[1.1] text-text sm:text-[3.25rem]">
            {t('welcome.title')}
          </h1>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-text-muted sm:text-xl">{t('welcome.subtitle')}</p>

          <Button size="lg" className="mt-6 w-full px-16 sm:w-auto" onClick={start}>
            {t('welcome.start')}
          </Button>

          <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
            {trust.map(({ key, Icon }) => (
              <li key={key} className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                <Icon className="h-4 w-4 text-primary" />
                {t(key)}
              </li>
            ))}
          </ul>

          {/* The languages, in their own scripts — the promise is visible, not claimed */}
          <ul dir="ltr" className="mt-5 hidden flex-wrap sm:flex items-center justify-center gap-2 md:justify-start">
            {LANGUAGES.map((lang) => (
              <li
                key={lang.code}
                className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface/80 px-3 py-1 text-xs font-semibold text-text-muted shadow-softer backdrop-blur-sm"
              >
                <span aria-hidden="true">{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The hero is also the invitation — tapping it starts the intake */}
        <button
          type="button"
          onClick={start}
          aria-label={t('welcome.start')}
          className="order-1 mx-auto w-full max-w-[17rem] rounded-[1.75rem] outline-none transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-primary/40 active:scale-[0.99] md:order-2 md:max-w-[19rem]"
        >
          <WelcomeHero />
        </button>
      </main>

      <footer className="relative z-10 px-6 pb-4 text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-medium text-pain-text">
          <AlertIcon className="h-4 w-4 shrink-0" />
          {t('welcome.emergency')}
        </p>
      </footer>
    </div>
  );
}
