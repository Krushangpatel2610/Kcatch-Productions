// components/graphics/tape-stack.tsx
// The KCATCH tape transition system: two physical tape ribbons layered
// together — a black/white checker tape behind, a yellow marquee tape in
// front, each with its own irregular edge, angle and marquee direction.
// This is the standard tape moment used between sections across the site.
//
// Replaces the older pattern of <KcatchTape /> + a thin <Checkerboard />
// border sitting underneath it — that read as "yellow bar with a border,"
// not two overlapping pieces of tape.
//
// ENTRANCE ANIMATION (`animateIn` prop — default: true):
//   When true both ribbons slide in from opposite sides simultaneously:
//     Checker tape: enters from the LEFT  (slides right  → center)
//     Yellow tape:  enters from the RIGHT (slides left   → center)
//   The arrival reads as two tapes being slapped down from both sides
//   at the same moment — physical and immediate.
//   An IntersectionObserver on the stack wrapper triggers the entrance
//   once, universally, on every page that uses TapeStack.

import { useRef } from "react";
import { TapeStrip } from "./tape-strip";
import { cn } from "@/lib/utils";

type TapeStackProps = {
  text: string;
  /** Direction the yellow (front) tape's marquee scrolls */
  yellowDirection?: "left" | "right";
  /** Direction the checker (back) tape's marquee scrolls */
  checkerDirection?: "left" | "right";
  className?: string;
  /**
   * Animate both ribbons in from opposite edges when the stack enters the
   * viewport. Defaults to true — pass false for tape strips that should
   * be immediately visible (e.g. mid-page transition strips that are
   * already below the fold and shouldn't fire on scroll).
   */
  animateIn?: boolean;
};

export function TapeStack({
  text,
  yellowDirection = "left",
  checkerDirection = "right",
  className,
  animateIn = true,
}: TapeStackProps) {
  // The outer wrapper is the IntersectionObserver target for both strips —
  // a single observation point rather than two per-strip observers.
  const stackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={stackRef}
      className={cn("relative w-full overflow-x-clip", className)}
      style={{ height: "clamp(80px, 10vw, 128px)" }}
      aria-hidden="true"
    >
      {/* Back layer: checker tape — enters from LEFT, scrolls right */}
      <TapeStrip
        text={text}
        variant="checker"
        direction={checkerDirection}
        rotation={-1.75}
        offsetY={-10}
        checkerSize={34}
        className="z-10"
        animateIn={animateIn}
        enterFrom="left"
        enterDelay={0}
        observerTarget={stackRef}
      />

      {/* Front layer: yellow tape — enters from RIGHT, scrolls left */}
      <TapeStrip
        text={text}
        variant="yellow"
        direction={yellowDirection}
        rotation={1.25}
        offsetY={10}
        className="z-20"
        animateIn={animateIn}
        enterFrom="right"
        enterDelay={0.06}
        observerTarget={stackRef}
      />
    </div>
  );
}
