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
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

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

function shouldEnableCursor(): boolean {
  if (typeof window === "undefined") return false; // SSR: always off
  return !isTouchDevice() && !prefersReducedMotion();
}

export function CustomCursor() {
  // Lazy initializer (not an effect + setState) — runs once, synchronously,
  // on the client's first render. Server always renders null (see the
  // typeof window guard above), so there's no hydration mismatch and no
  // cascading-render lint complaint from setting state inside an effect.
  const [enabled] = useState(shouldEnableCursor);
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const dotRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

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

    const handleMove = (e: MouseEvent) => {
      quickX.current?.(e.clientX);
      quickY.current?.(e.clientY);

      // Walk up from the exact hovered element to find the nearest
      // data-cursor state — lets nested elements (e.g. text inside a
      // project image) still report the parent's intended state.
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      const next = (target?.dataset.cursor as CursorState) || "default";
      setCursorState((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [enabled]);

  if (!enabled) return null;

  const isLabeled = cursorState !== "default";

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[90] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      aria-hidden="true"
    >
      <div
        className="flex items-center justify-center rounded-full bg-kc-white transition-[width,height] duration-300 ease-out"
        style={{
          width: isLabeled ? 64 : 10,
          height: isLabeled ? 64 : 10,
        }}
      >
        {isLabeled && (
          <span className="font-body text-kc-black text-[9px] font-bold uppercase tracking-widest">
            {LABELS[cursorState as Exclude<CursorState, "default">]}
          </span>
        )}
      </div>
    </div>
  );
}
