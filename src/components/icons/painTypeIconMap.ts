import type { ReactElement, SVGProps } from 'react';
import {
  AchingIcon,
  BurningIcon,
  ColickyIcon,
  CrampingIcon,
  ItchingIcon,
  NumbnessIcon,
  PinchingIcon,
  PressureIcon,
  PrickingIcon,
  StabbingIcon,
  StiffnessIcon,
  ThrobbingIcon,
  TinglingIcon,
  UnknownPainIcon,
} from './PainIcons';
import type { PainType } from '../../types';

export const PAIN_TYPE_ICONS: Record<PainType, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  burning: BurningIcon,
  stabbing: StabbingIcon,
  throbbing: ThrobbingIcon,
  pressure: PressureIcon,
  aching: AchingIcon,
  tingling: TinglingIcon,
  cramping: CrampingIcon,
  itching: ItchingIcon,
  pricking: PrickingIcon,
  pinching: PinchingIcon,
  colicky: ColickyIcon,
  stiffness: StiffnessIcon,
  numbness: NumbnessIcon,
  unknown: UnknownPainIcon,
};
