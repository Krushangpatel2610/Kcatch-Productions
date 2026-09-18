"use client";
// components/motion/custom-cursor.tsx
// Cuberto-inspired custom cursor: a small follower that trails the
// pointer with soft inertia and swaps to short text labels over specific
// interactive zones. Not a giant cursor-replacement circle — stays small
// enough that it never fights with the real pointer for attention.
//
// States are driven by data attributes on any element in the page:
//   data-cursor="view"  -> shows "VIEW"
//   data-cursor="play"  -> shows "PLAY"
//   data-cursor="drag"  -> shows "DRAG"
// Elements with none of these just get the default small dot.
//
// Desktop only: bails out entirely on touch devices and under
// prefers-reduced-motion, per the brief's explicit "disable on touch,
// respect reduced motion" requirement — a custom cursor is actively
// harmful on a device with no real pointer.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

const CURSOR_IMAGE_SRC = "/Images/logo/KcatchMedia Lm2.png";

type CursorState = "default" | "view" | "play" | "drag";

const LABELS: Record<Exclude<CursorState, "default">, string> = {
  view: "VIEW",
  play: "PLAY",
  drag: "DRAG",
};

function isTouchDevice() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(pointer: coarse)").matches;
}

export function CustomCursor() {
  // Starts false on every environment — SSR, and the client's hydration
  // render too. A lazy useState initializer runs during the client's
  // FIRST render, which for a client component IS the hydration render:
  // `typeof window === "undefined"` is already false at that point (this
  // code is executing in the browser), so reading matchMedia/reduced-
  // motion there produced real values immediately and made the very
  // first client render diverge from the window-less server render —
  // an actual hydration mismatch, not a false alarm. The fix is the
  // standard "decide after mount" gate: render nothing on both the
  // server AND the client's first paint, then flip to the real value in
  // an effect (which only runs post-hydration) and re-render.
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const dotRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    // Reading a real browser API (matchMedia) to decide whether this
    // component renders anything — exactly the "subscribe to an
    // external system, then setState" case the lint rule's own
    // rationale describes as fine; the alternative (a lazy useState
    // initializer) reads that same API during hydration itself and
    // causes a genuine mismatch, which is strictly worse.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(!isTouchDevice() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled || !dotRef.current) return;

    quickX.current = gsap.quickTo(dotRef.current, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    quickY.current = gsap.quickTo(dotRef.current, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    // mousemove can fire at 60-120+Hz. Position updates (quickTo) are
    // cheap either way, but el.closest("[data-cursor]") walks up the DOM
    // from the hovered element on every single call — real, continuous
    // work that doesn't need to run at mousemove's native rate, since
    // "am I over a different data-cursor zone" only actually changes a
    // tiny fraction of those events. Splitting the two: position updates
    // every event (cheap), the DOM-walk/state-check throttled to one
    // rAF per frame (cheap regardless of how many mousemove events
    // landed in that frame) removes a real per-event cost that was
    // running continuously on every page, all the time — not just
    // during the preloader window, but a standing contributor to
    // "everything feels laggy."
    let pendingX = 0;
    let pendingY = 0;
    let rafId: number | null = null;

    const checkCursorZone = () => {
      rafId = null;
      const el = document.elementFromPoint(pendingX, pendingY) as HTMLElement | null;
      const target = el?.closest<HTMLElement>("[data-cursor]");
      const next = (target?.dataset.cursor as CursorState) || "default";
      setCursorState((prev) => (prev === next ? prev : next));
    };

    const handleMove = (e: MouseEvent) => {
      quickX.current?.(e.clientX);
      quickY.current?.(e.clientY);

      pendingX = e.clientX;
      pendingY = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(checkCursorZone);
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  const isLabeled = cursorState !== "default";

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[90] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      {isLabeled ? (
        // Labeled hover state — unchanged existing interaction/rendering:
        // a solid white pill with the VIEW/PLAY/DRAG text, still
        // difference-blended exactly as before.
        <div
          className="flex items-center justify-center rounded-full bg-kc-white mix-blend-difference transition-[width,height] duration-300 ease-out"
          style={{ width: 64, height: 64 }}
        >
          <span className="font-body text-kc-black text-[9px] font-bold uppercase tracking-widest">
            {LABELS[cursorState as Exclude<CursorState, "default">]}
          </span>
        </div>
      ) : (
        // Default state — the KCATCH logo mark, sized as a small cursor
        // icon (not its full source resolution). object-contain inside a
        // fixed box guarantees no distortion regardless of the source
        // PNG's exact aspect ratio. No mix-blend-difference here: that
        // mode was tuned for a plain white dot silhouette and would
        // invert the logo's actual brand color depending on what's
        // beneath it — the logo should render in its true colors.
        <div className="relative w-10 h-7 transition-[width,height] duration-300 ease-out">
          <Image
            src={CURSOR_IMAGE_SRC}
            alt=""
            fill
            sizes="40px"
            className="object-contain"
            priority
          />
        </div>
      )}
    </div>
  );
}
