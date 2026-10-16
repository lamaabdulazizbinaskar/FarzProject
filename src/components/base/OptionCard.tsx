import type { ReactNode } from 'react';

interface OptionCardProps {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
  ariaLabel: string;
  className?: string;
}

export function OptionCard({ selected, onClick, children, ariaLabel, className = '' }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={`min-h-[48px] w-full rounded-card border-2 px-5 py-4 text-start text-lg font-medium
        transition-all duration-150 shadow-softer active:translate-y-0 active:scale-[0.98]
        ${
          selected
            ? 'border-primary bg-primary-soft text-primary shadow-soft'
            : 'border-border bg-surface text-text hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-soft'
        }
        ${className}`}
    >
      {children}
    </button>
  );
}
