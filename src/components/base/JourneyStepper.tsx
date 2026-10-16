import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../../state/sessionStore';
import { ClipboardIcon, MapPinIcon, MedicalCrossIcon, PersonIcon } from '../icons/UiIcons';
import type { Step } from '../../types';

const STAGES = ['setup', 'details', 'review', 'doctor'] as const;
type Stage = (typeof STAGES)[number];

const STAGE_ICONS: Record<Stage, typeof PersonIcon> = {
  setup: PersonIcon,
  details: MapPinIcon,
  review: ClipboardIcon,
  doctor: MedicalCrossIcon,
};

function stageIndexForStep(step: Step): number {
  if (step === 'welcome' || step === 'language' || step === 'patientType') return 0;
  if (step === 'review') return 2;
  if (step === 'doctor') return 3;
  return 1;
}

export function JourneyStepper() {
  const { t } = useTranslation();
  const step = useSessionStore((s) => s.step);

  if (step === 'welcome') return null;
  const active = stageIndexForStep(step);

  return (
    <nav aria-label={t('journey.setup')} className="no-print flex items-center justify-center gap-1 px-4 pb-3">
      {STAGES.map((stage, i) => {
        const Icon = STAGE_ICONS[stage];
        const done = i < active;
        const current = i === active;

        return (
          <div key={stage} className="flex items-center">
            {i > 0 && (
              <span className={`h-0.5 w-6 flex-shrink-0 transition-colors duration-300 sm:w-10 ${i <= active ? 'bg-primary' : 'bg-border'}`} />
            )}
            <span
              aria-label={t(`journey.${stage}`)}
              aria-current={current ? 'step' : undefined}
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                current
                  ? 'scale-110 border-primary bg-primary text-white shadow-soft'
                  : done
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'border-border bg-surface text-text-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
          </div>
        );
      })}
    </nav>
  );
}
