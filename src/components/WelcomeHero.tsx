import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFrontRegions, VIEW_HEIGHT, VIEW_WIDTH } from './BodyMap/regions';

/**
 * Three findings the hero cycles through. These are the app's own vocabulary
 * (same region and quality keys the patient will pick), so the panel is a
 * truthful preview of the output, not decorative filler — and it translates.
 */
const DEMO_FINDINGS = [
  { region: 'chest_left', quality: 'pressure', intensity: 8, level: 2 },
  { region: 'iliac_right', quality: 'colicky', intensity: 6, level: 3 },
  { region: 'knee_right', quality: 'stiffness', intensity: 4, level: 4 },
] as const;

const CYCLE_MS = 2800;

const LEVEL_TONE: Record<number, string> = {
  2: 'bg-red-500/15 text-red-300 ring-red-400/30',
  3: 'bg-orange-500/15 text-orange-300 ring-orange-400/30',
  4: 'bg-amber-500/15 text-amber-200 ring-amber-400/30',
};

/**
 * The welcome screen's hero: a live intake panel. The real body map silhouette
 * is examined in front of the patient — a marker lands on a body part, and the
 * reading underneath fills in with what that tap produced. It shows the whole
 * product in five seconds, in whatever language the screen is in.
 */
export function WelcomeHero({ className }: { className?: string }) {
  const { t } = useTranslation();
  const gradientId = useId();
  const glowId = useId();
  const gridId = useId();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % DEMO_FINDINGS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const regions = getFrontRegions('male');
  const finding = DEMO_FINDINGS[index];
  const anchor = regions.find((r) => r.id === finding.region)?.anchor ?? { x: VIEW_WIDTH / 2, y: VIEW_HEIGHT / 2 };

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] bg-slate-900 p-5 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.6)] ring-1 ring-white/10 ${className ?? ''}`}
    >
      {/* Ambient depth: a cool wash behind the figure plus a warm pain glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(60% 45% at 50% 18%, rgba(59,130,246,0.35), transparent 70%), radial-gradient(45% 35% at 72% 78%, rgba(232,102,79,0.22), transparent 70%)',
        }}
      />

      {/* Height-bound, not width-bound: the figure is tall and narrow, so a
          width-driven box would run off the screen. */}
      <div className="relative h-36 sm:h-56 md:h-72">
        <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.55" />
            </linearGradient>
            <radialGradient id={glowId}>
              <stop offset="0%" stopColor="var(--color-pain)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-pain)" stopOpacity="0" />
            </radialGradient>
            <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Faint measurement grid, like a clinical diagram */}
          <rect x="0" y="0" width={VIEW_WIDTH} height={VIEW_HEIGHT} fill={`url(#${gridId})`} />

          {regions.map((region) => (
            <g
              key={region.id}
              fill={`url(#${gradientId})`}
              stroke="#dbeafe"
              strokeOpacity={region.id === finding.region ? 0.85 : 0.22}
              strokeWidth={1.5}
            >
              {region.shapes.map((shape, i) =>
                shape.type === 'ellipse' ? (
                  <ellipse key={i} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />
                ) : shape.type === 'path' ? (
                  <path key={i} d={shape.d} />
                ) : (
                  <rect key={i} x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx} />
                ),
              )}
            </g>
          ))}

          {/* The marker, re-keyed so it re-animates on every finding */}
          <g key={index}>
            <circle cx={anchor.x} cy={anchor.y} r={46} fill={`url(#${glowId})`} className="animate-pop-in" />
            <circle
              cx={anchor.x}
              cy={anchor.y}
              r={15}
              fill="none"
              stroke="var(--color-pain)"
              strokeWidth={2.5}
              className="animate-tap-ripple"
              style={{ transformOrigin: `${anchor.x}px ${anchor.y}px`, animationDuration: `${CYCLE_MS}ms` }}
            />
            <circle
              cx={anchor.x}
              cy={anchor.y}
              r={14}
              fill="var(--color-pain)"
              stroke="#ffffff"
              strokeWidth={2.5}
              className="animate-pop-in"
              style={{ transformOrigin: `${anchor.x}px ${anchor.y}px` }}
            />
          </g>
        </svg>
      </div>

      {/* The reading this tap produced — the actual output, in this language */}
      <div
        key={index}
        className="relative mt-4 animate-pop-in rounded-2xl bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold text-white">{t(`bodyMap.regions.${finding.region}`)}</p>
            <p className="truncate text-xs text-blue-100/70">{t(`painType.types.${finding.quality}`)}</p>
          </div>
          <span
            className={`shrink-0 whitespace-nowrap rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${LEVEL_TONE[finding.level]}`}
          >
            {t(`triage.level.${finding.level}`)}
          </span>
        </div>

        {/* Intensity, drawn the way the doctor reads it */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-white/15">
            <div
              className="h-full rounded-pill bg-pain transition-[width] duration-700 ease-out"
              style={{ width: `${finding.intensity * 10}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold tabular-nums text-white">{finding.intensity}/10</span>
        </div>
      </div>

      {/* Progress through the three findings, doubling as a "live" cue */}
      <div className="relative mt-3 flex justify-center gap-1.5">
        {DEMO_FINDINGS.map((f, i) => (
          <span
            key={f.region}
            className={`h-1 rounded-pill transition-all duration-300 ${
              i === index ? 'w-6 bg-white/80' : 'w-2 bg-white/25'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
