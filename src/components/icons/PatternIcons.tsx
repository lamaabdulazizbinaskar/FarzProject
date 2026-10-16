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

export function ConstantIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 24h8l3-10 5 20 4-16 3 6h13" />
    </svg>
  );
}

export function IntermittentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 24h6l3-8 4 16 4-16 4 16 3-8h6" strokeDasharray="6 5" />
    </svg>
  );
}

export function OnMovementIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="26" cy="8" r="4" />
      <path d="M26 14l-3 10 5 2 2 14" />
      <path d="M23 24l-9 5" />
      <path d="M28 26l6 4-2 10" />
      <path d="M16 8c3 3 3 7 1 10" strokeDasharray="1 5" />
    </svg>
  );
}

export function UnknownPatternIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="19" />
      <path d="M19 19c0-3 2-5 5-5s5 2 5 5c0 3-3 4-4 6-.5 1-.5 2-.5 3" />
      <path d="M24 34h.01" />
    </svg>
  );
}
