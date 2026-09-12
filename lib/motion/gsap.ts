// lib/motion/gsap.ts
// GSAP + ScrollTrigger registration utility

/**
 * Call this once on the client side to register GSAP plugins.
 * Import and call in the SmoothScrollProvider.
 *
 * Usage (client component):
 *   import { registerGSAP } from "@/lib/motion/gsap";
 *   useEffect(() => { registerGSAP(); }, []);
 */
export async function registerGSAP(): Promise<void> {
  if (typeof window === "undefined") return;

  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");

  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Default GSAP ease tokens.
 * These should match the MOTION constants in lib/constants.ts.
 */
export const GSAP_EASE = {
  out: "power3.out",
  inOut: "power3.inOut",
  bounce: "elastic.out(1, 0.3)",
} as const;
