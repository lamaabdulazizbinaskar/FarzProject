import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function SpeakerOnIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9v6h3l4 4V5L7 9H4z" />
      <path d="M16 8.5a4.5 4.5 0 0 1 0 7" />
      <path d="M18.5 6a8 8 0 0 1 0 12" />
    </svg>
  );
}

export function SpeakerOffIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9v6h3l4 4V5L7 9H4z" />
      <path d="M16 9l5 5" />
      <path d="M21 9l-5 5" />
    </svg>
  );
}

export function TextSizeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7V5h11v2" />
      <path d="M9.5 5v14" />
      <path d="M7 19h5" />
      <path d="M16 12h5" />
      <path d="M16 19h5" />
      <path d="M18.5 9v10" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z" />
    </svg>
  );
}

export function BackArrowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
    </svg>
  );
}

export function ForwardArrowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function FlipIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M17 2l4 4-4 4" />
      <path d="M21 6H9a5 5 0 0 0-5 5" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M3 18h12a5 5 0 0 0 5-5" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9L2.5 17a1.8 1.8 0 0 0 1.5 2.7h16a1.8 1.8 0 0 0 1.5-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0z" />
    </svg>
  );
}

export function PrintIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9V3h12v6" />
      <rect x="4" y="9" width="16" height="8" rx="1.5" />
      <path d="M6 17v4h12v-4" />
    </svg>
  );
}

export function RestartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function MaleSignIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="14" r="7" />
      <path d="M15 9l6.5-6.5" />
      <path d="M16 2.5h5.5V8" />
    </svg>
  );
}

export function FemaleSignIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="7" />
      <path d="M12 16v6" />
      <path d="M9 19h6" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="12" width="8" height="9" rx="1.5" />
      <rect x="3" y="14" width="8" height="7" rx="1.5" />
    </svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="4" width="14" height="18" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
      <path d="M9 19h4" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function MedicalCrossIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h7v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7h7a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-7V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2z" />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

/** A small figure with a proportionally larger head — the child body toggle. */
export function ChildSignIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
      <circle cx="12" cy="6.5" r="4" />
      <path d="M12 10.5v6" />
      <path d="M8.5 13h7" />
      <path d="M9.5 21l2.5-4.5 2.5 4.5" />
    </svg>
  );
}
