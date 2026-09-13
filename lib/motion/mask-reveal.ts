// lib/motion/mask-reveal.ts
// Generates a clip-path polygon for the Featured Work image mask reveal.
//
// At progress 0 the image is fully hidden behind a closed "torn edge"
// positioned just past the frame's right side; as progress advances
// toward 1 that edge sweeps left across the frame, uncovering the image.
// The edge itself is irregular (a jagged clipped-photograph edge) rather
// than a straight wipe or a generic circle/diagonal reveal — echoing the
// site's existing torn-paper/print-clip visual language instead of
// inventing an unrelated mask style.
//
// Kept intentionally simple (7 points) so it reads as "editorial crop,"
// not a distorted or broken-looking shape.

// Relative x-jitter (in % of frame width) applied to each point of the
// vertical reveal edge, and its y position (0-100%). Both fixed so the
// jag pattern is stable/repeatable across renders rather than random
// each time — a deliberate, designed irregularity, not noise.
const EDGE_POINTS: Array<{ y: number; jitter: number }> = [
  { y: 0, jitter: 0 },
  { y: 12, jitter: 4 },
  { y: 30, jitter: -3 },
  { y: 50, jitter: 5 },
  { y: 70, jitter: -4 },
  { y: 88, jitter: 3 },
  { y: 100, jitter: 0 },
];

// Reveal pacing: a hand-tuned curve (not linear, not a stock ease) so the
// crop feels like it's being physically peeled back rather than wiped at
// a constant rate — a slow initial "crack" of light, a fast mid-section
// where most of the image becomes visible, then a settle as it finishes.
// Keyframes: 0->0, 0.10->0.06, 0.30->0.42, 0.60->0.82, 0.80->0.95, 1->1.
const PACE_KEYS: Array<[number, number]> = [
  [0, 0],
  [0.1, 0.06],
  [0.3, 0.42],
  [0.6, 0.82],
  [0.8, 0.95],
  [1, 1],
];

function paceReveal(p: number): number {
  const clamped = Math.max(0, Math.min(1, p));
  for (let i = 0; i < PACE_KEYS.length - 1; i++) {
    const [x0, y0] = PACE_KEYS[i];
    const [x1, y1] = PACE_KEYS[i + 1];
    if (clamped >= x0 && clamped <= x1) {
      const t = x1 === x0 ? 0 : (clamped - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return clamped;
}

/**
 * Builds a clip-path polygon that reveals the frame from left to right
 * as `progress` goes 0 -> 1, with a jagged (not straight) leading edge.
 * The reveal itself is paced (see paceReveal) rather than linear.
 */
export function buildMaskClipPath(progress: number): string {
  const p = paceReveal(progress);
  // Edge sweeps from -5% (fully closed, hidden past the left) to 105%
  // (fully open, past the right) so the jagged points never clip visibly
  // at the very start/end of the reveal.
  const edgeX = -5 + p * 110;

  const points = EDGE_POINTS.map(({ y, jitter }) => {
    const x = Math.max(0, Math.min(100, edgeX + jitter));
    return `${x}% ${y}%`;
  });

  // Polygon: left edge (0,0 -> 0,100) closes the shape behind the jagged
  // reveal line, so everything left of the jagged edge is visible.
  return `polygon(0% 0%, ${points.join(", ")}, 0% 100%)`;
}
