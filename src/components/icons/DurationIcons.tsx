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

export function MinutesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="26" r="16" />
      <path d="M24 26V16" />
      <path d="M24 26l8 4" />
      <path d="M18 6h12" />
      <path d="M24 6v4" />
    </svg>
  );
}

export function HoursIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="19" />
      <path d="M24 24V13" />
      <path d="M24 24l10 6" />
    </svg>
  );
}

export function TodayIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="9" />
      <path d="M24 5v6" />
      <path d="M24 37v6" />
      <path d="M5 24h6" />
      <path d="M37 24h6" />
      <path d="M10.5 10.5l4.2 4.2" />
      <path d="M33.3 33.3l4.2 4.2" />
      <path d="M10.5 37.5l4.2-4.2" />
      <path d="M33.3 14.7l4.2-4.2" />
    </svg>
  );
}

export function DaysIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="9" width="34" height="32" rx="4" />
      <path d="M7 18h34" />
      <path d="M15 5v8" />
      <path d="M33 5v8" />
      <rect x="14" y="24" width="7" height="7" rx="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WeeksIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="9" width="34" height="32" rx="4" />
      <path d="M7 18h34" />
      <path d="M15 5v8" />
      <path d="M33 5v8" />
      <rect x="10.5" y="24" width="27" height="7" rx="1.5" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}

export function MonthsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="9" width="34" height="32" rx="4" />
      <path d="M7 18h34" />
      <path d="M15 5v8" />
      <path d="M33 5v8" />
      <rect x="11" y="23" width="6" height="6" rx="1" fill="currentColor" stroke="none" />
      <rect x="21" y="23" width="6" height="6" rx="1" fill="currentColor" stroke="none" />
      <rect x="31" y="23" width="6" height="6" rx="1" fill="currentColor" stroke="none" />
      <rect x="11" y="32" width="6" height="6" rx="1" fill="currentColor" stroke="none" />
      <rect x="21" y="32" width="6" height="6" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
