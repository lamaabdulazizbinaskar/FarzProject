import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../state/sessionStore';
import { StepLayout } from '../components/base/StepLayout';
import { IconCard } from '../components/base/IconCard';
import { ICON_TILE_TONES } from '../components/iconTileTones';
import { SpotContextChip } from '../components/base/SpotContextChip';
import {
  DaysIcon,
  HoursIcon,
  MinutesIcon,
  MonthsIcon,
  TodayIcon,
  WeeksIcon,
} from '../components/icons/DurationIcons';
import { UnknownPainIcon } from '../components/icons/PainIcons';
import type { Onset } from '../types';

const OPTIONS: { id: Onset; Icon: typeof MinutesIcon }[] = [
  { id: 'minutes', Icon: MinutesIcon },
  { id: 'hours', Icon: HoursIcon },
  { id: 'today', Icon: TodayIcon },
  { id: 'days', Icon: DaysIcon },
  { id: 'weeks', Icon: WeeksIcon },
  { id: 'months', Icon: MonthsIcon },
  { id: 'unknown', Icon: UnknownPainIcon },
];

export function DurationScreen() {
  const { t } = useTranslation();
  const spots = useSessionStore((s) => s.spots);
  const activeSpotId = useSessionStore((s) => s.activeSpotId);
  const updateActiveSpot = useSessionStore((s) => s.updateActiveSpot);
  const setStep = useSessionStore((s) => s.setStep);
  const goBack = useSessionStore((s) => s.goBack);

  const activeIndex = spots.findIndex((s) => s.id === activeSpotId);
  const activeSpot = spots[activeIndex];
  const onset = activeSpot?.onset ?? null;

  return (
    <StepLayout
      animKey="duration"
      title={t('duration.title')}
      subtitle={t('duration.subtitle')}
      onBack={goBack}
      onNext={() => setStep('pattern')}
      nextDisabled={onset === null}
      progress={{ current: 3, total: 4 }}
      wide
    >
      {activeSpot && <SpotContextChip region={activeSpot.region} number={activeIndex + 1} />}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {OPTIONS.map(({ id, Icon }, i) => (
          <IconCard
            key={id}
            selected={onset === id}
            onClick={() => updateActiveSpot({ onset: id })}
            icon={<Icon className="h-full w-full" />}
            label={t(`duration.options.${id}`)}
            tone={ICON_TILE_TONES[i % ICON_TILE_TONES.length]}
          />
        ))}
      </div>
    </StepLayout>
  );
}
