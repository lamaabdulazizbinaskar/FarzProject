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

export function FeverIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="20" y="8" width="8" height="24" rx="4" />
      <circle cx="24" cy="36" r="6" />
      <path d="M24 32V16" strokeWidth={2} />
      <path d="M31 12l4-2" />
      <path d="M31 18l4-1" />
    </svg>
  );
}

export function NauseaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="22" r="15" />
      <path d="M17 19c1-2 3-2 4 0" />
      <path d="M27 19c1-2 3-2 4 0" />
      <path d="M16 29c3 3 6 3 8 3s5 0 8-3" />
      <path d="M24 37v6" />
      <path d="M20 43h8" />
    </svg>
  );
}

export function DizzinessIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="15" />
      <path d="M16 20c1.5-2 4-2 5 0" />
      <path d="M13 24l6-2-2 6" opacity="0.9" />
      <path d="M27 20c1.5-2 4-2 5 0" />
      <path d="M35 24l-6-2 2 6" opacity="0.9" />
      <path d="M18 31c2 2 4 3 6 3s4-1 6-3" />
    </svg>
  );
}

export function InjuryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 38l10-22 6 4 6-12 6 10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M30 38l4-6 4 2" />
    </svg>
  );
}

export function BleedingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 6c6 8 11 15 11 21a11 11 0 1 1-22 0c0-6 5-13 11-21z" />
      <path d="M20 28c0 2 1.5 3 4 3" opacity="0.6" />
    </svg>
  );
}

export function BreathingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 8v6" />
      <path d="M16 18c-4 0-7 3-7 7s3 7 7 6" />
      <path d="M32 18c4 0 7 3 7 7s-3 7-7 6" />
      <path d="M16 31v4a8 8 0 0 0 16 0v-4" />
      <circle cx="24" cy="14" r="4" />
    </svg>
  );
}

export function CantMoveIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="10" r="4" />
      <path d="M24 16v14" />
      <path d="M24 20l-10 6" />
      <path d="M24 20l10 6" />
      <path d="M24 30l-6 10" />
      <path d="M24 30l6 10" />
      <path d="M6 6l36 36" opacity="0.7" />
    </svg>
  );
}
