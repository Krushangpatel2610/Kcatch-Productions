"use client";
// components/motion/smooth-scroll-provider.tsx
// Root-level Lenis smooth scroll provider.
// ONE instance — never create Lenis per section or per route.
//
// Architecture:
//   Lenis → RAF → GSAP ticker → ScrollTrigger → section timelines

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

// Same touch-device check CustomCursor uses to bail out of a
// desktop-only enhancement.
function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    // Skip Lenis if user prefers reduced motion
    if (prefersReducedMotion()) return;

    // Lenis is a desktop-only enhancement (wheel-scroll easing). On a
    // touch device it never actually smooths touch input (syncTouch
    // defaults to false), but it still attaches its own non-passive
    // touchstart/touchmove/touchend listeners and inserts itself as an
    // extra relay between native scroll and ScrollTrigger.update() — a
    // real source of scroll-position desync/glitching on mobile for
    // zero user-facing benefit. ScrollTrigger already listens to native
    // scroll directly and doesn't need Lenis to function, so skipping it
    // here removes that risk entirely without touching a single
    // animation: every ScrollTrigger instance still fires off the
    // browser's own native scroll position exactly as it would with no
    // smooth-scroll library at all.
    if (isTouchDevice()) {
      if ("fonts" in document) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
      const handleLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }

    // Static imports (gsap/ScrollTrigger are already static imports in
    // Preloader, HeroSection, Navigation, etc.) — the previous dynamic
    // import() here fetched and re-evaluated a SEPARATE copy of these
    // modules at runtime, on the client's main thread, at the exact
    // moment the preloader's own GSAP timeline was trying to run. That
    // extra parse/eval work landing in the middle of the preloader's
    // critical first ~1.5s is a very plausible cause of the reported
    // lag/glitch during that window. gsap/ScrollTrigger/lenis are none
    // of them large enough to justify a lazy-loaded chunk here anyway —
    // the site depends on them for the very first frame regardless.
    gsap.registerPlugin(ScrollTrigger);

    // Create single Lenis instance. Tuned for "buttery, not floaty":
    // duration lowered from 1.2 -> 0.9 so input still feels directly
    // connected to the wheel/touch (1.2 read as laggy/disconnected),
    // with an easeOutExpo-ish curve so motion still decelerates softly
    // rather than stopping abruptly.
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Tick Lenis on every GSAP frame
    const tickLenis = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickLenis);

    // NOT gsap.ticker.lagSmoothing(0) — that fully disables GSAP's
    // frame-drop compensation site-wide, so any momentary main-thread
    // stall (an image decode, a layout pass, GC) shows up as a visible
    // jump/glitch in every GSAP-driven animation instead of being
    // smoothed over. Lag smoothing is the thing that's SUPPOSED to
    // absorb exactly the kind of stutter being reported; disabling it
    // was working directly against that. Default smoothing (500ms
    // threshold, 500ms adjusted delta) is what GSAP recommends for
    // scroll-heavy sites — restore it instead of turning it off.
    gsap.ticker.lagSmoothing(500, 500);

    // Fonts (and any late-loading images) can shift layout after
    // ScrollTrigger has already measured section positions — refresh
    // once everything has settled so pin/scrub ranges stay accurate.
    if ("fonts" in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
      gsap.ticker.remove(tickLenis);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
