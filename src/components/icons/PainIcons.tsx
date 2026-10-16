import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function BurningIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 6c3 5-2 7-2 11 0 2 2 3 4 1 1 4-2 7-6 7-5 0-9-4-9-9 0-6 5-9 5-14 2 2 3 4 3 7 1-1 2-2 2-3 2 1 3 0 3 0z" />
      <path d="M18 37c0 3 2.5 5 6 5s6-2 6-5" />
    </svg>
  );
}

export function StabbingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 4l4 16-4 4-4-4z" />
      <path d="M24 24v18" />
      <path d="M18 30h12" />
      <path d="M19 36h10" />
    </svg>
  );
}

export function ThrobbingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 26h7l3-9 5 16 4-13 3 6h11" />
      <circle cx="24" cy="26" r="20" opacity="0.001" />
    </svg>
  );
}

export function PressureIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 16h24" />
      <path d="M12 32h24" />
      <path d="M17 16v-5" />
      <path d="M31 16v-5" />
      <path d="M17 37v-5" />
      <path d="M31 37v-5" />
      <path d="M24 20v8" />
    </svg>
  );
}

export function AchingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 30c4-10 9-18 16-18s12 8 16 18" />
      <path d="M8 34c4-7 9-12 16-12s12 5 16 12" opacity="0.5" />
    </svg>
  );
}

export function TinglingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 10v8" />
      <path d="M12 22l1 2-1 2" />
      <path d="M24 8v8" />
      <path d="M24 20l1.5 2.5-1.5 2.5" />
      <path d="M36 10v8" />
      <path d="M36 22l1 2-1 2" />
      <path d="M8 38h32" />
    </svg>
  );
}

export function CrampingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 24c3-6 6-9 8-9s3 4 4 4 2-7 4-7 2 7 4 7 2-4 4-4 5 3 8 9" />
      <path d="M8 24c3 6 6 9 8 9s3-4 4-4 2 7 4 7 2-7 4-7 2 4 4 4 5-3 8-9" />
    </svg>
  );
}

export function ItchingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 36c6-4 4-9 1-12s-4-6-1-9c3 2 2 5 4 5s1-4 4-4 2 5 5 4c2 3-1 5-1 8" />
      <path d="M30 20l5-5" />
      <path d="M31 14l4 4" />
    </svg>
  );
}

export function PrickingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 24l-8-10" />
      <path d="M24 24l10-6" />
      <path d="M24 24l2 12" />
      <path d="M24 24l-11 4" />
      <path d="M24 24l9 9" />
      <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PinchingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 14c-4 4-6 9-6 13" />
      <path d="M8 27l-3 5" />
      <path d="M8 27l5 2" />
      <path d="M34 14c4 4 6 9 6 13" />
      <path d="M40 27l3 5" />
      <path d="M40 27l-5 2" />
      <path d="M18 22l6 6 6-6" />
    </svg>
  );
}

export function ColickyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 6c8 0 12 5 12 10s-4 8-9 8 3-10-3-10-7 5-7 10 7 10 15 8" />
    </svg>
  );
}

export function StiffnessIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 18v-6" />
      <path d="M10 12h8" />
      <path d="M10 18l12 10" />
      <path d="M22 28l16-6" />
      <path d="M38 22l3-2" />
      <path d="M38 22l1 3.5" />
    </svg>
  );
}

export function NumbnessIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 40V22a6 6 0 0 1 12 0v10" />
      <path d="M18 24c-3 0-5-2-5-5s1-6 1-9" />
      <path d="M30 24c3 0 5-3 5-6" strokeDasharray="1 5" />
      <path d="M12 12h4" strokeDasharray="1 5" />
      <path d="M11 17h4" strokeDasharray="1 5" />
    </svg>
  );
}

export function UnknownPainIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="19" />
      <path d="M19 19c0-3 2-5 5-5s5 2 5 5c0 3-3 4-4 6-.5 1-.5 2-.5 3" />
      <path d="M24 34h.01" />
    </svg>
  );
}
