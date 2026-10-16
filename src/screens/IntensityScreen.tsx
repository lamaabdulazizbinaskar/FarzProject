import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../state/sessionStore';
import { StepLayout } from '../components/base/StepLayout';
import { Face } from '../components/Faces';
import { INTENSITY_GRADIENT } from '../components/intensityGradient';
import { Banner } from '../components/base/Banner';
import { SpotContextChip } from '../components/base/SpotContextChip';
import { isSpotHighRisk } from '../utils/safety';

const VALUES = [0, 2, 4, 6, 8, 10];

export function IntensityScreen() {
  const { t } = useTranslation();
  const spots = useSessionStore((s) => s.spots);
  const activeSpotId = useSessionStore((s) => s.activeSpotId);
  const updateActiveSpot = useSessionStore((s) => s.updateActiveSpot);
  const setStep = useSessionStore((s) => s.setStep);
  const goBack = useSessionStore((s) => s.goBack);

  const activeIndex = spots.findIndex((s) => s.id === activeSpotId);
  const activeSpot = spots[activeIndex];
  const intensity = activeSpot?.intensity ?? null;
  const highRisk = activeSpot ? isSpotHighRisk({ region: activeSpot.region, intensity }) : false;

  return (
    <StepLayout
      animKey="intensity"
      title={t('intensity.title')}
      subtitle={t('intensity.subtitle')}
      onBack={goBack}
      onNext={() => setStep('duration')}
      nextDisabled={intensity === null}
      progress={{ current: 2, total: 4 }}
      wide
    >
      {activeSpot && <SpotContextChip region={activeSpot.region} number={activeIndex + 1} />}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {VALUES.map((v) => (
            <Face
              key={v}
              value={v}
              selected={intensity === v}
              onClick={() => updateActiveSpot({ intensity: v })}
              label={t(`intensity.faces.${v}`)}
            />
          ))}
        </div>
        <div className="relative mx-2 h-2.5 rounded-pill" style={{ background: `linear-gradient(to right, ${INTENSITY_GRADIENT.join(', ')})` }}>
          {intensity !== null && (
            <span
              className="absolute top-1/2 h-5 w-5 rounded-full border-[3px] border-surface shadow-soft transition-all duration-300 ease-out"
              style={{
                left: `${(intensity / 10) * 100}%`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: INTENSITY_GRADIENT[Math.round((intensity / 10) * (INTENSITY_GRADIENT.length - 1))],
              }}
            />
          )}
        </div>
        {highRisk && <Banner title={t('safety.title')} message={t('safety.message')} />}
      </div>
    </StepLayout>
  );
}
