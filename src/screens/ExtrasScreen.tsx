import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../state/sessionStore';
import { StepLayout } from '../components/base/StepLayout';
import { IconCard } from '../components/base/IconCard';
import { ICON_TILE_TONES } from '../components/iconTileTones';
import { Banner } from '../components/base/Banner';
import { EXTRA_SYMPTOM_ICONS } from '../components/icons/extraTypeIconMap';
import { isSessionHighRisk } from '../utils/safety';
import type { ExtraSymptom } from '../types';

const EXTRAS: ExtraSymptom[] = ['fever', 'nausea', 'dizziness', 'injury', 'bleeding', 'breathing', 'cant_move'];

export function ExtrasScreen() {
  const { t } = useTranslation();
  const extras = useSessionStore((s) => s.extras);
  const spots = useSessionStore((s) => s.spots);
  const toggleExtra = useSessionStore((s) => s.toggleExtra);
  const setStep = useSessionStore((s) => s.setStep);
  const goBack = useSessionStore((s) => s.goBack);

  const highRisk = isSessionHighRisk({ spots, extras });

  return (
    <StepLayout
      animKey="extras"
      title={t('extras.title')}
      subtitle={t('extras.subtitle')}
      onBack={goBack}
      onNext={() => setStep('review')}
      wide
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {EXTRAS.map((id, i) => {
            const Icon = EXTRA_SYMPTOM_ICONS[id];
            return (
              <IconCard
                key={id}
                selected={extras.includes(id)}
                onClick={() => toggleExtra(id)}
                icon={<Icon className="h-full w-full" />}
                label={t(`extras.options.${id}`)}
                tone={ICON_TILE_TONES[i % ICON_TILE_TONES.length]}
              />
            );
          })}
        </div>
        {highRisk && <Banner title={t('safety.title')} message={t('safety.message')} />}
      </div>
    </StepLayout>
  );
}
