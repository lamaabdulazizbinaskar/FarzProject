import type { ReactNode } from 'react';
import type { IconTileTone } from '../iconTileTones';

const TILE_CLASSES: Record<IconTileTone, string> = {
  blue: 'bg-blue-50 text-blue-500',
  violet: 'bg-violet-50 text-violet-500',
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-500',
  emerald: 'bg-emerald-50 text-emerald-600',
  fuchsia: 'bg-fuchsia-50 text-fuchsia-500',
  cyan: 'bg-cyan-50 text-cyan-600',
};

interface IconCardProps {
  selected?: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  tone?: IconTileTone;
  className?: string;
}

export function IconCard({ selected, onClick, icon, label, tone = 'blue', className = '' }: IconCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      className={`flex min-h-[112px] w-full flex-col items-center justify-center gap-2 rounded-card border-2
        px-3 py-4 text-center shadow-softer transition-all duration-150 active:translate-y-0 active:scale-[0.97]
        ${
          selected
            ? 'border-primary bg-primary-soft shadow-soft'
            : 'border-border bg-surface hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-soft'
        }
        ${className}`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-150 ${
          selected ? 'scale-110 bg-primary text-white' : TILE_CLASSES[tone]
        }`}
      >
        <span className="h-6 w-6">{icon}</span>
      </span>
      <span className={`text-sm font-semibold leading-tight ${selected ? 'text-primary' : 'text-text'}`}>
        {label}
      </span>
    </button>
  );
}
