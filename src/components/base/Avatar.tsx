interface AvatarProps {
  tone?: 'blue' | 'alert' | 'neutral';
  size?: 'md' | 'lg';
  className?: string;
}

const TONE_CLASSES: Record<string, string> = {
  blue: 'from-sky-100 to-blue-200 text-blue-600 ring-blue-300',
  alert: 'from-rose-100 to-red-200 text-alert ring-red-300',
  neutral: 'from-slate-100 to-slate-200 text-slate-500 ring-slate-300',
};

const SIZE_CLASSES: Record<string, string> = {
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
};

/**
 * A generic "no photo" headshot placeholder — a silhouette on a soft
 * gradient disc, styled to read as a photo slot without using anyone's
 * actual likeness (we can't license real doctor/patient photography here).
 */
export function Avatar({ tone = 'neutral', size = 'md', className = '' }: AvatarProps) {
  return (
    <span
      className={`inline-flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b ring-2 ring-offset-1 ring-offset-white ${TONE_CLASSES[tone]} ${SIZE_CLASSES[size]} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[55%] w-[55%]">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    </span>
  );
}
