import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'clinical';
  size?: 'md' | 'lg';
  icon?: ReactNode;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-150 ' +
  'focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed select-none';

const variants: Record<string, string> = {
  primary:
    'bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))] text-white shadow-soft ' +
    'hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-6px_rgba(37,99,235,0.45)] active:translate-y-0 active:scale-[0.98]',
  secondary:
    'bg-surface text-text border-2 border-border shadow-softer hover:border-primary hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 active:scale-[0.98]',
  ghost: 'bg-transparent text-text-muted hover:bg-primary-soft active:scale-[0.98]',
  // Used only on the clinical/doctor-facing screens (Review, Doctor View, Dashboard)
  clinical:
    'bg-[linear-gradient(135deg,#3b82f6,#1d4ed8)] text-white shadow-sm ' +
    'hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-6px_rgba(37,99,235,0.45)] active:translate-y-0 active:scale-[0.98]',
};

const sizes: Record<string, string> = {
  md: 'min-h-[48px] px-6 text-base',
  lg: 'min-h-[64px] px-8 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
