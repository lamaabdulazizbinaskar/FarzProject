import type { ReactElement, SVGProps } from 'react';
import {
  BleedingIcon,
  BreathingIcon,
  CantMoveIcon,
  DizzinessIcon,
  FeverIcon,
  InjuryIcon,
  NauseaIcon,
} from './ExtraIcons';
import type { ExtraSymptom } from '../../types';

export const EXTRA_SYMPTOM_ICONS: Record<ExtraSymptom, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  fever: FeverIcon,
  nausea: NauseaIcon,
  dizziness: DizzinessIcon,
  injury: InjuryIcon,
  bleeding: BleedingIcon,
  breathing: BreathingIcon,
  cant_move: CantMoveIcon,
};
