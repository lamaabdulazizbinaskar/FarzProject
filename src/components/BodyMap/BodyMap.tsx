import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getBackRegions, getFrontRegions, VIEW_HEIGHT, VIEW_WIDTH, type RegionDef } from './regions';
import type { BodyShape, BodySide } from '../../types';

interface Pin {
  number: number;
  region: string;
  side: BodySide;
}

interface BodyMapProps {
  side: BodySide;
  shape?: BodyShape;
  pins: Pin[];
  onRegionTap: (region: string) => void;
}

function RegionShapeEl({ shape }: { shape: RegionDef['shapes'][number] }) {
  if (shape.type === 'ellipse') {
    return <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />;
  }
  if (shape.type === 'path') {
    return <path d={shape.d} />;
  }
  return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx} />;
}

export function BodyMap({ side, shape = 'male', pins, onRegionTap }: BodyMapProps) {
  const { t } = useTranslation();
  const gradientId = useId();
  // Naming the region under the pointer turns a silhouette into a labelled
  // chart: the patient can confirm they are about to tap the right place.
  const [hovered, setHovered] = useState<string | null>(null);
  const regions = side === 'front' ? getFrontRegions(shape) : getBackRegions(shape);
  const markedIds = new Set(pins.filter((p) => p.side === side).map((p) => p.region));
  const hoveredRegion = hovered ? regions.find((r) => r.id === hovered) : undefined;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="mx-auto h-full max-h-[70vh] w-full max-w-[280px] sm:max-w-[320px]"
      role="group"
      aria-label={t(side === 'front' ? 'common.front' : 'common.backSide')}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary-soft)" />
          <stop offset="100%" stopColor="var(--color-body-fill-deep)" />
        </linearGradient>
      </defs>

      <ellipse cx={VIEW_WIDTH / 2} cy={VIEW_HEIGHT - 16} rx={100} ry={11} fill="#000000" opacity={0.09} />

      {regions.map((region) => {
        const label = t(`bodyMap.regions.${region.id}`);
        const marked = markedIds.has(region.id);
        return (
          <g
            key={region.id}
            role="button"
            tabIndex={0}
            aria-label={label}
            aria-pressed={marked}
            data-marked={marked}
            onClick={() => onRegionTap(region.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRegionTap(region.id);
              }
            }}
            onPointerEnter={() => setHovered(region.id)}
            onPointerLeave={() => setHovered((h) => (h === region.id ? null : h))}
            onFocus={() => setHovered(region.id)}
            onBlur={() => setHovered((h) => (h === region.id ? null : h))}
            className="body-region outline-none"
            style={{ fill: marked ? 'var(--color-pain-soft)' : `url(#${gradientId})` }}
          >
            <title>{label}</title>
            {region.hit?.map((shape, i) => (
              <g key={`hit-${i}`} style={{ fill: 'transparent', stroke: 'none' }}>
                <RegionShapeEl shape={shape} />
              </g>
            ))}
            {region.shapes.map((shape, i) => (
              <RegionShapeEl key={i} shape={shape} />
            ))}
          </g>
        );
      })}

      {pins
        .filter((p) => p.side === side)
        .map((pin) => {
          const region = regions.find((r) => r.id === pin.region);
          if (!region) return null;
          return (
            <g key={pin.number} className="animate-pin-drop" style={{ transformOrigin: `${region.anchor.x}px ${region.anchor.y}px` }}>
              <circle
                cx={region.anchor.x}
                cy={region.anchor.y}
                r={13}
                fill="none"
                stroke="var(--color-pain)"
                strokeWidth={2.5}
                className="animate-ring-pulse"
                style={{ transformOrigin: `${region.anchor.x}px ${region.anchor.y}px` }}
              />
              <circle cx={region.anchor.x} cy={region.anchor.y + 2} r={13.5} fill="#000000" opacity={0.12} />
              <circle
                cx={region.anchor.x}
                cy={region.anchor.y}
                r={13}
                fill="var(--color-pain)"
                stroke="var(--color-surface)"
                strokeWidth={2.5}
              />
              <text
                x={region.anchor.x}
                y={region.anchor.y + 4.5}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill="#ffffff"
              >
                {pin.number}
              </text>
            </g>
          );
        })}
      {hoveredRegion && <RegionLabel region={hoveredRegion} label={t(`bodyMap.regions.${hoveredRegion.id}`)} />}
    </svg>
  );
}

/** A chart-style callout naming the region under the pointer. Drawn in SVG
 * space so it scales with the figure and never escapes the viewBox. */
function RegionLabel({ region, label }: { region: RegionDef; label: string }) {
  const charW = 7.2;
  const w = Math.max(60, label.length * charW + 20);
  const h = 26;
  const above = region.anchor.y > 70;
  const y = above ? region.anchor.y - 34 : region.anchor.y + 16;
  const x = Math.min(Math.max(region.anchor.x - w / 2, 4), VIEW_WIDTH - w - 4);

  return (
    <g className="pointer-events-none animate-pop-in">
      <line
        x1={region.anchor.x}
        y1={region.anchor.y}
        x2={region.anchor.x}
        y2={above ? y + h : y}
        stroke="var(--color-text)"
        strokeOpacity={0.35}
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <circle cx={region.anchor.x} cy={region.anchor.y} r={4} fill="var(--color-text)" opacity={0.55} />
      <rect x={x} y={y} width={w} height={h} rx={9} fill="var(--color-text)" opacity={0.92} />
      <text
        x={x + w / 2}
        y={y + h / 2 + 5}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--color-surface)"
      >
        {label}
      </text>
    </g>
  );
}
