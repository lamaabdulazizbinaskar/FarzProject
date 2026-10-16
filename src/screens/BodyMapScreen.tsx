import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../state/sessionStore';
import { TopBar } from '../components/base/TopBar';
import { BottomBar } from '../components/base/BottomBar';
import { Button } from '../components/base/Button';
import { BodyMap } from '../components/BodyMap/BodyMap';
import { BackgroundDecor } from '../components/base/BackgroundDecor';
import { PAIN_TYPE_ICONS } from '../components/icons/painTypeIconMap';
import { ChildSignIcon, EditIcon, FemaleSignIcon, FlipIcon, MaleSignIcon, MapPinIcon } from '../components/icons/UiIcons';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { vibrateTap } from '../utils/haptics';
import type { BodySide } from '../types';

export function BodyMapScreen() {
  const { t } = useTranslation();
  const spots = useSessionStore((s) => s.spots);
  const startSpot = useSessionStore((s) => s.startSpot);
  const removeSpot = useSessionStore((s) => s.removeSpot);
  const editSpot = useSessionStore((s) => s.editSpot);
  const setStep = useSessionStore((s) => s.setStep);
  const bodyShape = useSessionStore((s) => s.bodyShape);
  const setBodyShape = useSessionStore((s) => s.setBodyShape);
  const reducedMotion = usePrefersReducedMotion();

  const [side, setSide] = useState<BodySide>('front');
  const [turning, setTurning] = useState(false);

  const handleFlip = () => {
    const next = side === 'front' ? 'back' : 'front';
    if (reducedMotion) {
      setSide(next);
      return;
    }
    setTurning(true);
    setTimeout(() => {
      setSide(next);
      setTimeout(() => setTurning(false), 10);
    }, 190);
  };

  const handleRegionTap = (region: string) => {
    vibrateTap();
    startSpot(side, region);
    setStep('painType');
  };

  const handleEdit = (id: string, spotSide: BodySide) => {
    setSide(spotSide);
    editSpot(id, 'bodyMap');
    setStep('painType');
  };

  const handleBack = () => setStep('patientType', { replace: true });

  const pins = spots.map((s, i) => ({ number: i + 1, region: s.region, side: s.side }));

  return (
    <div className="relative flex h-full min-h-screen flex-col overflow-hidden bg-bg">
      <BackgroundDecor />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
      <TopBar onLanguageClick={() => setStep('language')} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 pb-4 sm:px-8 lg:flex-row lg:items-center">
        <section className="flex flex-1 flex-col items-center justify-center" dir="ltr">
          <div
            className="relative flex items-center justify-center"
            style={{ perspective: 900 }}
          >
            <div
              style={{
                transform: turning ? 'rotateY(90deg) scale(0.92)' : 'rotateY(0deg) scale(1)',
                transition: reducedMotion ? 'none' : 'transform 190ms ease-out',
                transformStyle: 'preserve-3d',
              }}
              className="flex items-center justify-center"
            >
              <BodyMap side={side} shape={bodyShape} pins={pins} onRegionTap={handleRegionTap} />
            </div>
            {spots.length === 0 && side === 'front' && (
              <div className="pointer-events-none absolute left-1/2 top-[25%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inset-0 animate-ping rounded-full bg-pain opacity-40" />
                <span className="relative block h-5 w-5 rounded-full bg-pain shadow-soft" />
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleFlip}
              className="flex min-h-[48px] items-center gap-2 rounded-pill border-2 border-border bg-surface px-5 text-sm font-semibold text-text shadow-softer active:scale-95"
            >
              <FlipIcon className="h-5 w-5" />
              {t(side === 'front' ? 'bodyMap.flipToBack' : 'bodyMap.flipToFront')}
            </button>
            <div className="flex items-center gap-1 rounded-pill border-2 border-border bg-surface p-1 shadow-softer">
              <button
                type="button"
                onClick={() => setBodyShape('male')}
                aria-pressed={bodyShape === 'male'}
                aria-label={t('bodyMap.figureMale')}
                className={`flex min-h-[40px] min-w-[40px] items-center justify-center rounded-pill ${
                  bodyShape === 'male' ? 'bg-primary text-white' : 'text-text-muted'
                }`}
              >
                <MaleSignIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setBodyShape('female')}
                aria-pressed={bodyShape === 'female'}
                aria-label={t('bodyMap.figureFemale')}
                className={`flex min-h-[40px] min-w-[40px] items-center justify-center rounded-pill ${
                  bodyShape === 'female' ? 'bg-primary text-white' : 'text-text-muted'
                }`}
              >
                <FemaleSignIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setBodyShape('child')}
                aria-pressed={bodyShape === 'child'}
                aria-label={t('bodyMap.figureChild')}
                className={`flex min-h-[40px] min-w-[40px] items-center justify-center rounded-pill ${
                  bodyShape === 'child' ? 'bg-primary text-white' : 'text-text-muted'
                }`}
              >
                <ChildSignIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-4">
          <div>
            <h1 className="font-display text-[1.5rem] font-bold leading-tight text-text sm:text-[2rem]">{t('bodyMap.title')}</h1>
            <p className="mt-1 text-base text-text-muted sm:text-lg">{t('bodyMap.subtitle')}</p>
          </div>

          {spots.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed border-border bg-surface/50 px-6 py-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary animate-breathe">
                <MapPinIcon className="h-8 w-8" />
              </span>
              <p className="text-lg font-medium text-text-muted">{t('bodyMap.empty')}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {spots.map((spot, i) => {
                const PrimaryIcon = PAIN_TYPE_ICONS[spot.types[0] ?? 'unknown'];
                return (
                <li
                  key={spot.id}
                  className="flex items-center justify-between gap-3 rounded-card border-2 border-border bg-surface px-4 py-3 shadow-softer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft">
                      <PrimaryIcon className="h-6 w-6 text-primary" />
                      <span className="absolute -bottom-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-pain text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                    </span>
                    <span className="font-semibold text-text">{t(`bodyMap.regions.${spot.region}`)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(spot.id, spot.side)}
                      aria-label={t('common.edit')}
                      className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-pill text-text-muted hover:bg-primary-soft hover:text-primary"
                    >
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSpot(spot.id)}
                      aria-label={t('common.back')}
                      className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-pill text-2xl text-text-muted hover:bg-pain-soft hover:text-pain"
                    >
                      ×
                    </button>
                  </div>
                </li>
                );
              })}
            </ul>
          )}

          <Button
            size="lg"
            disabled={spots.length === 0}
            onClick={() => setStep('extras')}
            className="mt-2 w-full"
          >
            {t('bodyMap.doneButton')}
          </Button>
        </section>
      </main>
      <BottomBar onBack={handleBack} showNext={false} />
      </div>
    </div>
  );
}
