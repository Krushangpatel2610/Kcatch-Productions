// lib/motion/lenis.ts
// Lenis smooth scroll instance creation utility
// One instance is created at the root SmoothScrollProvider level.

export type LenisOptions = {
  duration?: number;
  easing?: (t: number) => number;
  lerp?: number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal" | "both";
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
};

/**
 * Default Lenis configuration for KCATCH.
 * These are tuned for a smooth, not sluggish, feel.
 */
export const LENIS_DEFAULTS: LenisOptions = {
  duration: 1.2,
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
};

/**
 * Creates a Lenis instance (browser only).
 * Call inside useEffect() in SmoothScrollProvider.
 */
export async function createLenisInstance(options?: LenisOptions) {
  if (typeof window === "undefined") return null;

  const { default: Lenis } = await import("lenis");
  const lenis = new Lenis({
    ...LENIS_DEFAULTS,
    ...options,
  });

  return lenis;
}
