// components/graphics/tape-stack.tsx
// The KCATCH tape transition system: two physical tape ribbons layered
// together — a black/white checker tape behind, a yellow marquee tape in
// front, each with its own irregular edge, angle and marquee direction.
// This is the standard tape moment used between sections across the site.
//
// Replaces the older pattern of <KcatchTape /> + a thin <Checkerboard />
// border sitting underneath it — that read as "yellow bar with a border,"
// not two overlapping pieces of tape.

import { TapeStrip } from "./tape-strip";
import { cn } from "@/lib/utils";

type TapeStackProps = {
  text: string;
  /** Direction the yellow (front) tape's marquee scrolls */
  yellowDirection?: "left" | "right";
  /** Direction the checker (back) tape's marquee scrolls */
  checkerDirection?: "left" | "right";
  className?: string;
};

export function TapeStack({
  text,
  yellowDirection = "left",
  checkerDirection = "right",
  className,
}: TapeStackProps) {
  return (
    <div
      className={cn("relative w-full overflow-x-clip", className)}
      style={{ height: "clamp(64px, 8.5vw, 108px)" }}
      aria-hidden="true"
    >
      {/* Back layer: checker tape — offset up, opposite angle, peeks out
          above/below the yellow tape rather than sitting flush with it. */}
      <TapeStrip
        text={text}
        variant="checker"
        direction={checkerDirection}
        rotation={-1.75}
        offsetY={-10}
        className="z-10"
      />

      {/* Front layer: yellow marquee tape — visually dominant, slightly
          different angle so the checker layer shows through at the edges. */}
      <TapeStrip
        text={text}
        variant="yellow"
        direction={yellowDirection}
        rotation={1.25}
        offsetY={10}
        className="z-20"
      />
    </div>
  );
}
