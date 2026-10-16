import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../state/sessionStore';
import { StepLayout } from '../components/base/StepLayout';
import { IconCard } from '../components/base/IconCard';
import { ICON_TILE_TONES } from '../components/iconTileTones';
import { SpotContextChip } from '../components/base/SpotContextChip';
import { PAIN_TYPE_ICONS } from '../components/icons/painTypeIconMap';
import { getPainTypesForRegion } from '../utils/regionPainTypes';

export function PainTypeScreen() {
  const { t } = useTranslation();
  const spots = useSessionStore((s) => s.spots);
  const activeSpotId = useSessionStore((s) => s.activeSpotId);
  const toggleActiveSpotType = useSessionStore((s) => s.toggleActiveSpotType);
  const setStep = useSessionStore((s) => s.setStep);
  const goBack = useSessionStore((s) => s.goBack);

  const activeIndex = spots.findIndex((s) => s.id === activeSpotId);
  const activeSpot = spots[activeIndex];
  const types = activeSpot?.types ?? [];
  const painTypes = getPainTypesForRegion(activeSpot?.region);

  return (
    <StepLayout
      animKey="painType"
      title={t('painType.title')}
      subtitle={t('painType.subtitle')}
      onBack={goBack}
      onNext={() => setStep('intensity')}
      nextDisabled={types.length === 0}
      progress={{ current: 1, total: 4 }}
      wide
    >
      {activeSpot && <SpotContextChip region={activeSpot.region} number={activeIndex + 1} />}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {painTypes.map((id, i) => {
          const Icon = PAIN_TYPE_ICONS[id];
          return (
            <IconCard
              key={id}
              selected={types.includes(id)}
              onClick={() => toggleActiveSpotType(id)}
              icon={<Icon className="h-full w-full" />}
              label={t(`painType.types.${id}`)}
              tone={ICON_TILE_TONES[i % ICON_TILE_TONES.length]}
            />
          );
        })}
      </div>
    </StepLayout>
  );
}
