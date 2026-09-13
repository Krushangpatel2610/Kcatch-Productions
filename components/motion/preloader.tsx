"use client";
// components/motion/preloader.tsx
// Premium KCATCH launch sequence — Caractère Bois-inspired: a short,
// intentional identity moment, not a generic progress bar.
//
// Behavior:
//   - Runs once per browser session (sessionStorage), not on every route
//     navigation — a client-side route change should feel instant, only
//     the very first page load of the visit gets the launch moment.
//   - Skipped entirely under prefers-reduced-motion (content underneath
//     is already rendered; a reduced-motion user just sees it immediately).
//   - Capped at a firm ~1.1s exit regardless of how fast assets load, so
//     it always registers as one deliberate beat rather than either
//     flashing invisibly or stalling the page.
//   - Never blocks interaction: it's an overlay on top of the real page
//     (already mounted underneath), not a gate the page waits on.
//
// The decision (show / skip) is computed in a lazy useState initializer
// rather than in an effect — that initializer runs once, synchronously,
// on the client's first render, so there's no setState-inside-an-effect
// cascade. Next.js only ever renders this component's real markup on the
// client for the same reason next/image-style client-only checks do:
// the decision depends on sessionStorage/matchMedia, which don't exist
// during SSR, so the server-rendered output is always the "skip" (null)
// case and the client either matches it (skip) or upgrades to "visible"
// on the very first paint — never a flash of the wrong state.

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

const SESSION_KEY = "kcatch:preloader-shown";

function shouldShowPreloader(): boolean {
  if (typeof window === "undefined") return false; // SSR: always skip
  if (prefersReducedMotion()) return false;
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // sessionStorage unavailable (private mode etc.) — show it anyway,
    // just won't persist across reloads in that case.
  }
  return true;
}

export function Preloader() {
  const [visible, setVisible] = useState(shouldShowPreloader);
  const rootRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!visible || !rootRef.current) return;

      document.body.style.overflow = "hidden";

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setVisible(false);
        },
      });

      // Identity moment: the yellow panel is already covering the screen
      // (rendered at full opacity/scale by default, no fade-from-nothing);
      // the wordmark reveals via a line-mask, holds briefly, then the
      // whole panel wipes up and away — a torn-tape-style exit rather
      // than a fade, echoing the site's tape/paper physical language.
      tl.fromTo(
        wordmarkRef.current,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.5, ease: "power4.out" }
      )
        .to({}, { duration: 0.35 }) // brief hold — the identity moment
        .to(panelRef.current, {
          yPercent: -100,
          duration: 0.5,
          ease: "power3.inOut",
        })
        .set(rootRef.current, { display: "none" });
    },
    { dependencies: [visible], scope: rootRef }
  );

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100]"
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        className="absolute inset-0 bg-kc-black flex items-center justify-center"
      >
        <div className="overflow-hidden">
          <div
            ref={wordmarkRef}
            className="font-display text-kc-yellow uppercase leading-none"
            style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}
          >
            KCATCH
          </div>
        </div>
      </div>
    </div>
  );
}
