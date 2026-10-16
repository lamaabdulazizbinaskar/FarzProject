import type { BodyShape } from '../../types';

export type RegionShape =
  | { type: 'rect'; x: number; y: number; w: number; h: number; rx: number }
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { type: 'path'; d: string };

export interface RegionDef {
  id: string;
  shapes: RegionShape[];
  /** Invisible, larger shapes used only to catch taps. Small joints like the
   * elbow are drawn to scale but would otherwise be a sub-24px target, which
   * fails WCAG 2.5.8 and is simply hard to hit with a thumb in pain. */
  hit?: RegionShape[];
  anchor: { x: number; y: number };
}

export const VIEW_WIDTH = 240;
export const VIEW_HEIGHT = 660;

const CENTER = 120;

/**
 * SIDE CONVENTION — the figure faces the patient, so on the FRONT view the
 * patient's right side is drawn on the *screen's left* (exactly how the
 * clinical quadrant diagrams are labelled). On the BACK view we are behind
 * the patient, so the two line up: screen left is the patient's left.
 * Every id below is the PATIENT's side, which is the only side a clinician
 * cares about, and `sided()` maps it onto the right half of the screen.
 */
function sided(view: 'front' | 'back', screen: 'left' | 'right'): 'left' | 'right' {
  if (view === 'back') return screen;
  return screen === 'left' ? 'right' : 'left';
}

interface Proportions {
  head: { cy: number; rx: number; ry: number };
  neck: { y: number; h: number; w: number };
  /** Torso silhouette: half-width at a given y, interpolated between landmarks. */
  landmarks: [y: number, halfWidth: number][];
  shoulderX: { left: number; right: number };
  shoulderY: number;
  torsoTop: number;
  chestBottom: number;
  hipY: number;
  arm: { top: number; bottom: number; w0: number; w1: number; elbowY: number; handCy: number };
  leg: { x: number; thighTop: number; thighBottom: number; kneeCy: number; shinTop: number; shinBottom: number; footCy: number };
}

/**
 * Three figures, not two. A child is not a small adult: the head is a far
 * larger share of the body, the shoulders are narrow and the limbs are short
 * and soft. Getting this right matters clinically — a parent pointing at a
 * toddler's belly on an adult silhouette lands in the wrong place.
 */
const PROPORTIONS: Record<BodyShape, Proportions> = {
  male: {
    head: { cy: 55, rx: 36, ry: 40 },
    neck: { y: 90, h: 30, w: 30 },
    landmarks: [
      [118, 72],
      [150, 80],
      [205, 68],
      [250, 60],
      [300, 72],
      [330, 68],
    ],
    shoulderX: { left: 44, right: 196 },
    shoulderY: 123,
    torsoTop: 118,
    chestBottom: 205,
    hipY: 330,
    arm: { top: 132, bottom: 345, w0: 21, w1: 12, elbowY: 243, handCy: 370 },
    leg: { x: 38, thighTop: 330, thighBottom: 460, kneeCy: 472, shinTop: 488, shinBottom: 605, footCy: 621 },
  },
  female: {
    head: { cy: 55, rx: 34, ry: 39 },
    neck: { y: 90, h: 30, w: 27 },
    landmarks: [
      [118, 62],
      [150, 68],
      [205, 58],
      [250, 47],
      [300, 78],
      [330, 73],
    ],
    shoulderX: { left: 54, right: 186 },
    shoulderY: 123,
    torsoTop: 118,
    chestBottom: 205,
    hipY: 330,
    arm: { top: 132, bottom: 345, w0: 18, w1: 10, elbowY: 243, handCy: 370 },
    leg: { x: 38, thighTop: 330, thighBottom: 460, kneeCy: 472, shinTop: 488, shinBottom: 605, footCy: 621 },
  },
  child: {
    head: { cy: 66, rx: 47, ry: 50 },
    neck: { y: 112, h: 20, w: 26 },
    landmarks: [
      [130, 50],
      [160, 55],
      [210, 54],
      [255, 54],
      [300, 58],
      [332, 54],
    ],
    shoulderX: { left: 62, right: 178 },
    shoulderY: 141,
    torsoTop: 130,
    chestBottom: 210,
    hipY: 332,
    arm: { top: 148, bottom: 336, w0: 16, w1: 11, elbowY: 243, handCy: 360 },
    leg: { x: 30, thighTop: 332, thighBottom: 448, kneeCy: 460, shinTop: 474, shinBottom: 578, footCy: 596 },
  },
};

function torsoHalfWidth(shape: BodyShape, y: number): number {
  const landmarks = PROPORTIONS[shape].landmarks;
  for (let i = 0; i < landmarks.length - 1; i++) {
    const [y0, w0] = landmarks[i];
    const [y1, w1] = landmarks[i + 1];
    if (y >= y0 && y <= y1) {
      const t = (y - y0) / (y1 - y0);
      const eased = (1 - Math.cos(t * Math.PI)) / 2;
      return w0 + (w1 - w0) * eased;
    }
  }
  return landmarks[landmarks.length - 1][1];
}

function sampleSide(shape: BodyShape, y0: number, y1: number, steps = 10): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps;
    pts.push([y, torsoHalfWidth(shape, y)]);
  }
  return pts;
}

/** One half of the torso (left or right of the vertical centerline), bounded
 * by flat cuts at y0/y1 and the natural silhouette curve on the outside. */
function torsoBand(shape: BodyShape, y0: number, y1: number, screenSide: 'left' | 'right'): string {
  const sign = screenSide === 'left' ? -1 : 1;
  const pts = sampleSide(shape, y0, y1);
  const outer = pts.map(([y, hw]) => `${CENTER + sign * hw},${y}`).join(' L ');
  return `M ${CENTER},${y0} L ${outer} L ${CENTER},${y1} Z`;
}

/** Full-width torso band (both sides of centerline), used for the back. */
function torsoBandFull(shape: BodyShape, y0: number, y1: number): string {
  const pts = sampleSide(shape, y0, y1);
  const left = pts.map(([y, hw]) => `${CENTER - hw},${y}`).join(' L ');
  const rightRev = [...pts].reverse().map(([y, hw]) => `${CENTER + hw},${y}`).join(' L ');
  return `M ${left} L ${rightRev} Z`;
}

/** Share of the half-width taken by the central column of the abdominal grid —
 * the midclavicular planes that separate the central strip from the flanks. */
const MIDCLAVICULAR = 0.4;

/** One cell of the 3x3 abdominal grid, following the silhouette on the outside. */
function abdomenCell(shape: BodyShape, y0: number, y1: number, col: 'left' | 'center' | 'right'): string {
  const pts = sampleSide(shape, y0, y1);
  if (col === 'center') {
    const left = pts.map(([y, hw]) => `${CENTER - hw * MIDCLAVICULAR},${y}`).join(' L ');
    const rightRev = [...pts].reverse().map(([y, hw]) => `${CENTER + hw * MIDCLAVICULAR},${y}`).join(' L ');
    return `M ${left} L ${rightRev} Z`;
  }
  const sign = col === 'left' ? -1 : 1;
  const inner = pts.map(([y, hw]) => `${CENTER + sign * hw * MIDCLAVICULAR},${y}`).join(' L ');
  const outerRev = [...pts].reverse().map(([y, hw]) => `${CENTER + sign * hw},${y}`).join(' L ');
  return `M ${inner} L ${outerRev} Z`;
}

/** A gently tapered, slightly bulging limb tube from (cx,y0) width w0 to (cx,y1) width w1. */
function tube(cx: number, y0: number, y1: number, w0: number, w1: number): string {
  const midY = (y0 + y1) / 2;
  const bulge = Math.max(w0, w1) * 1.06;
  return `M ${cx - w0},${y0} Q ${cx - bulge},${midY} ${cx - w1},${y1} L ${cx + w1},${y1} Q ${cx + bulge},${midY} ${cx + w0},${y0} Z`;
}

function limbRegions(shape: BodyShape, view: 'front' | 'back'): RegionDef[] {
  const p = PROPORTIONS[shape];
  const { left: armLX, right: armRX } = p.shoulderX;
  const { top, bottom, w0, w1, elbowY, handCy } = p.arm;
  const legLX = CENTER - p.leg.x - 2;
  const legRX = CENTER + p.leg.x + 2;
  const { thighTop, thighBottom, kneeCy, shinTop, shinBottom, footCy } = p.leg;

  // Each limb is built once per screen side, then labelled with the patient's side.
  const sides = [
    { screen: 'left' as const, armX: armLX, legX: legLX, thumbDir: 1 },
    { screen: 'right' as const, armX: armRX, legX: legRX, thumbDir: -1 },
  ];

  return sides.flatMap(({ screen, armX, legX, thumbDir }) => {
    const s = sided(view, screen);
    return [
      {
        id: `shoulder_${s}`,
        shapes: [{ type: 'ellipse', cx: armX, cy: p.shoulderY, rx: 24, ry: 18 }],
        anchor: { x: armX, y: p.shoulderY },
      },
      {
        id: `arm_${s}`,
        shapes: [{ type: 'path', d: tube(armX, top, bottom, w0, w1) }],
        anchor: { x: armX, y: top + (elbowY - top) / 2 },
      },
      {
        // Joints get their own region: "my elbow hurts" is a different
        // complaint from "my arm hurts", and the patient can't say so
        // if the whole arm is one target.
        id: `elbow_${s}`,
        shapes: [{ type: 'ellipse', cx: armX, cy: elbowY, rx: 17, ry: 15 }],
        hit: [{ type: 'ellipse', cx: armX, cy: elbowY, rx: 24, ry: 23 }],
        anchor: { x: armX, y: elbowY },
      },
      {
        id: `hand_${s}`,
        shapes: [
          { type: 'ellipse', cx: armX, cy: handCy, rx: 15, ry: 27 },
          { type: 'ellipse', cx: armX + 12 * thumbDir, cy: handCy - 14, rx: 7, ry: 10 },
        ],
        anchor: { x: armX, y: handCy },
      },
      {
        id: `leg_${s}`,
        shapes: [
          { type: 'path', d: tube(legX, thighTop, thighBottom, 30, 20) },
          { type: 'path', d: tube(legX, shinTop, shinBottom, 18, 13) },
        ],
        anchor: { x: legX, y: thighTop + (thighBottom - thighTop) / 2 },
      },
      {
        id: `knee_${s}`,
        shapes: [{ type: 'ellipse', cx: legX, cy: kneeCy, rx: 20, ry: 16 }],
        hit: [{ type: 'ellipse', cx: legX, cy: kneeCy, rx: 26, ry: 24 }],
        anchor: { x: legX, y: kneeCy },
      },
      {
        id: `foot_${s}`,
        shapes: [
          { type: 'ellipse', cx: legX, cy: footCy, rx: 22, ry: 15 },
          { type: 'ellipse', cx: legX, cy: footCy + 17, rx: 15, ry: 9 },
        ],
        anchor: { x: legX, y: footCy + 3 },
      },
    ];
  });
}

function head(shape: BodyShape): RegionDef {
  const { cy, rx, ry } = PROPORTIONS[shape].head;
  return { id: 'head', shapes: [{ type: 'ellipse', cx: CENTER, cy, rx, ry }], anchor: { x: CENTER, y: cy } };
}

function neck(shape: BodyShape): RegionDef {
  const { y, h, w } = PROPORTIONS[shape].neck;
  return {
    id: 'neck',
    shapes: [{ type: 'rect', x: CENTER - w / 2, y, w, h, rx: 11 }],
    hit: [{ type: 'ellipse', cx: CENTER, cy: y + h / 2, rx: 22, ry: 20 }],
    anchor: { x: CENTER, y: y + h / 2 },
  };
}

export function getFrontRegions(shape: BodyShape): RegionDef[] {
  const p = PROPORTIONS[shape];
  const { chestBottom, hipY } = p;
  // The two planes of the clinical nine-region scheme: the subcostal and
  // transtubercular lines, here as equal thirds of the abdomen.
  const row1 = chestBottom + (hipY - chestBottom) / 3;
  const row2 = chestBottom + (2 * (hipY - chestBottom)) / 3;

  const grid: { id: string; y0: number; y1: number; col: 'left' | 'center' | 'right' }[] = [
    { id: `hypochondriac_${sided('front', 'left')}`, y0: chestBottom, y1: row1, col: 'left' },
    { id: 'epigastric', y0: chestBottom, y1: row1, col: 'center' },
    { id: `hypochondriac_${sided('front', 'right')}`, y0: chestBottom, y1: row1, col: 'right' },
    { id: `flank_${sided('front', 'left')}`, y0: row1, y1: row2, col: 'left' },
    { id: 'umbilical', y0: row1, y1: row2, col: 'center' },
    { id: `flank_${sided('front', 'right')}`, y0: row1, y1: row2, col: 'right' },
    { id: `iliac_${sided('front', 'left')}`, y0: row2, y1: hipY, col: 'left' },
    { id: 'hypogastric', y0: row2, y1: hipY, col: 'center' },
    { id: `iliac_${sided('front', 'right')}`, y0: row2, y1: hipY, col: 'right' },
  ];

  return [
    head(shape),
    neck(shape),
    ...limbRegions(shape, 'front'),
    {
      id: `chest_${sided('front', 'left')}`,
      shapes: [{ type: 'path', d: torsoBand(shape, p.torsoTop, chestBottom, 'left') }],
      anchor: { x: CENTER - 30, y: (p.torsoTop + chestBottom) / 2 },
    },
    {
      id: `chest_${sided('front', 'right')}`,
      shapes: [{ type: 'path', d: torsoBand(shape, p.torsoTop, chestBottom, 'right') }],
      anchor: { x: CENTER + 30, y: (p.torsoTop + chestBottom) / 2 },
    },
    ...grid.map(({ id, y0, y1, col }) => {
      const mid = (y0 + y1) / 2;
      const hw = torsoHalfWidth(shape, mid);
      const offset = col === 'center' ? 0 : hw * ((MIDCLAVICULAR + 1) / 2) * (col === 'left' ? -1 : 1);
      return {
        id,
        shapes: [{ type: 'path' as const, d: abdomenCell(shape, y0, y1, col) }],
        anchor: { x: CENTER + offset, y: mid },
      };
    }),
  ];
}

export function getBackRegions(shape: BodyShape): RegionDef[] {
  const p = PROPORTIONS[shape];
  const mid = p.torsoTop + (p.hipY - p.torsoTop) * 0.46;
  return [
    head(shape),
    neck(shape),
    ...limbRegions(shape, 'back'),
    {
      id: 'back_upper',
      shapes: [{ type: 'path', d: torsoBandFull(shape, p.torsoTop, mid) }],
      anchor: { x: CENTER, y: (p.torsoTop + mid) / 2 },
    },
    {
      id: `loin_${sided('back', 'left')}`,
      shapes: [{ type: 'path', d: torsoBand(shape, mid, p.hipY, 'left') }],
      anchor: { x: CENTER - 30, y: (mid + p.hipY) / 2 },
    },
    {
      id: `loin_${sided('back', 'right')}`,
      shapes: [{ type: 'path', d: torsoBand(shape, mid, p.hipY, 'right') }],
      anchor: { x: CENTER + 30, y: (mid + p.hipY) / 2 },
    },
  ];
}
