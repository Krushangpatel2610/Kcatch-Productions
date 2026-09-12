"use client";
// components/motion/smooth-scroll-provider.tsx
// Root-level Lenis smooth scroll provider.
// ONE instance — never create Lenis per section or per route.
//
// Architecture:
//   Lenis → RAF → GSAP ticker → ScrollTrigger → section timelines

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    // Skip Lenis if user prefers reduced motion
    if (prefersReducedMotion()) return;

    let lenisInstance: { destroy: () => void; raf: (time: number) => void; on: (event: string, cb: () => void) => void } | null = null;

    async function init() {
      try {
        // Dynamic imports to prevent SSR issues
        const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
          await Promise.all([
            import("lenis"),
            import("gsap"),
            import("gsap/ScrollTrigger"),
          ]);

        // Register GSAP plugin
        gsap.registerPlugin(ScrollTrigger);

        // Create single Lenis instance
        const lenis = new Lenis({
          duration: 1.2,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        }) as typeof lenisInstance;

        lenisInstance = lenis;

        // Sync Lenis scroll position with GSAP ScrollTrigger
        if (lenis) lenis.on("scroll", ScrollTrigger.update);

        // Tick Lenis on every GSAP frame
        gsap.ticker.add((time: number) => {
          if (lenis) lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Fonts (and any late-loading images) can shift layout after
        // ScrollTrigger has already measured section positions — refresh
        // once everything has settled so pin/scrub ranges stay accurate.
        if ("fonts" in document) {
          document.fonts.ready.then(() => ScrollTrigger.refresh());
        }
        window.addEventListener("load", () => ScrollTrigger.refresh());
      } catch (err) {
        // Gracefully degrade if Lenis/GSAP fails to load
        console.warn("[SmoothScrollProvider] Failed to initialize:", err);
      }
    }

    init();

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
      }
    };
  }, []);

  return <>{children}</>;
}
