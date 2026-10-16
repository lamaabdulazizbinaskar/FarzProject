import type { ReactNode } from 'react';
import { AlertIcon } from '../icons/UiIcons';

interface BannerProps {
  title: string;
  message?: ReactNode;
  tone?: 'alert' | 'info';
}

export function Banner({ title, message, tone = 'alert' }: BannerProps) {
  const isAlert = tone === 'alert';
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-card border-2 px-5 py-4 shadow-soft ${
        isAlert ? 'border-alert bg-alert-soft text-alert' : 'border-primary bg-primary-soft text-primary'
      }`}
    >
      <AlertIcon className="mt-0.5 h-7 w-7 flex-shrink-0" />
      <div>
        <p className="text-lg font-bold">{title}</p>
        {message ? <p className="mt-1 text-base font-medium opacity-90">{message}</p> : null}
      </div>
    </div>
  );
}
