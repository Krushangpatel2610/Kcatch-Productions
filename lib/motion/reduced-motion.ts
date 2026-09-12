// lib/motion/reduced-motion.ts
// Central reduced-motion utility

/**
 * Checks whether the user has requested reduced motion.
 * Works in both browser and SSR contexts.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * React-friendly hook for watching prefers-reduced-motion.
 * Import this in client components only.
 */
export function createReducedMotionWatcher(callback: (reduced: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  mql.addEventListener("change", handler);
  callback(mql.matches);

  return () => mql.removeEventListener("change", handler);
}
