import { INTENSITY_GRADIENT } from './intensityGradient';

interface FaceProps {
  value: number;
  selected: boolean;
  onClick: () => void;
  label: string;
}

function FaceSvg({ value }: { value: number }) {
  const t = value / 10;
  const mouthY = 32 + t * 10;
  const mouthCurve = 10 - t * 20;
  const browY = 16 + t * 3;
  const browTilt = t * 4;

  return (
    <svg viewBox="0 0 56 56" className="h-full w-full">
      <circle cx="28" cy="28" r="26" fill="var(--face-fill)" stroke="var(--face-stroke)" strokeWidth="2" />
      <path
        d={`M16 ${browY + browTilt} L24 ${browY}`}
        stroke="var(--face-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M40 ${browY + browTilt} L32 ${browY}`}
        stroke="var(--face-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="19" cy="25" r="2.4" fill="var(--face-stroke)" />
      <circle cx="37" cy="25" r="2.4" fill="var(--face-stroke)" />
      <path
        d={`M16 ${mouthY} Q28 ${mouthY + mouthCurve} 40 ${mouthY}`}
        stroke="var(--face-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {t > 0.55 && (
        <>
          <path d="M12 34c0 4 2 7 2 10" stroke="var(--tear)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M44 34c0 4-2 7-2 10" stroke="var(--tear)" strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}

const GRADIENT = INTENSITY_GRADIENT;

export function Face({ value, selected, onClick, label }: FaceProps) {
  const idx = Math.round((value / 10) * (GRADIENT.length - 1));
  const color = GRADIENT[idx];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${label} — ${value}/10`}
      style={
        {
          '--face-fill': selected ? `${color}22` : 'var(--color-surface)',
          '--face-stroke': selected ? color : 'var(--color-text-muted)',
          '--tear': '#6FA8DC',
        } as React.CSSProperties
      }
      className={`flex min-h-[48px] flex-1 flex-col items-center gap-2 rounded-card border-2 px-2 py-3 transition-all duration-150
        active:scale-95 ${selected ? 'scale-110 shadow-soft' : 'hover:border-primary/40'}`}
    >
      <span className="block h-12 w-12 sm:h-16 sm:w-16" style={{ borderColor: selected ? color : 'var(--color-border)' }}>
        <FaceSvg value={value} />
      </span>
      <span className="text-sm font-bold" style={{ color: selected ? color : 'var(--color-text)' }}>
        {value}
      </span>
      <span className="text-center text-xs font-medium leading-tight text-text-muted">{label}</span>
    </button>
  );
}
