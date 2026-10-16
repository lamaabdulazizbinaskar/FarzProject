import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../state/sessionStore';
import { StepLayout } from '../components/base/StepLayout';
import { IconCard } from '../components/base/IconCard';
import { ICON_TILE_TONES } from '../components/iconTileTones';
import { SpotContextChip } from '../components/base/SpotContextChip';
import { ConstantIcon, IntermittentIcon, OnMovementIcon, UnknownPatternIcon } from '../components/icons/PatternIcons';
import { vibrateDone } from '../utils/haptics';
import type { Pattern } from '../types';

const OPTIONS: { id: Pattern; Icon: typeof ConstantIcon }[] = [
  { id: 'constant', Icon: ConstantIcon },
  { id: 'intermittent', Icon: IntermittentIcon },
  { id: 'on_movement', Icon: OnMovementIcon },
  { id: 'unknown', Icon: UnknownPatternIcon },
];

export function PatternScreen() {
  const { t } = useTranslation();
  const spots = useSessionStore((s) => s.spots);
  const activeSpotId = useSessionStore((s) => s.activeSpotId);
  const updateActiveSpot = useSessionStore((s) => s.updateActiveSpot);
  const finishSpotFlow = useSessionStore((s) => s.finishSpotFlow);
  const goBack = useSessionStore((s) => s.goBack);

  const activeIndex = spots.findIndex((s) => s.id === activeSpotId);
  const activeSpot = spots[activeIndex];
  const pattern = activeSpot?.pattern ?? null;

  const handleDone = () => {
    vibrateDone();
    finishSpotFlow();
  };

  return (
    <StepLayout
      animKey="pattern"
      title={t('pattern.title')}
      subtitle={t('pattern.subtitle')}
      onBack={goBack}
      onNext={handleDone}
      nextLabel={t('bodyMap.doneButton')}
      nextDisabled={pattern === null}
      progress={{ current: 4, total: 4 }}
      wide
    >
      {activeSpot && <SpotContextChip region={activeSpot.region} number={activeIndex + 1} />}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {OPTIONS.map(({ id, Icon }, i) => (
          <IconCard
            key={id}
            selected={pattern === id}
            onClick={() => updateActiveSpot({ pattern: id })}
            icon={<Icon className="h-full w-full" />}
            label={t(`pattern.options.${id}`)}
            tone={ICON_TILE_TONES[i % ICON_TILE_TONES.length]}
          />
        ))}
      </div>
    </StepLayout>
  );
}
