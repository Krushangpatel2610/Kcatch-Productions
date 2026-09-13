// components/graphics/checkerboard.tsx
// Reusable checkerboard divider — an upright, axis-aligned racing-flag /
// zebra-crossing grid of squares (not a 45°-rotated diamond pattern).
// The previous version used a diagonal argyle-style gradient trick,
// which at small cell sizes read as fine dotted noise rather than a
// deliberate checker material.
//
// Uses repeating-conic-gradient, purpose-built for exactly this pattern:
// a single conic gradient centered on each 2x2-cell tile, split into
// four 90° quadrants alternating colorB/colorA/colorB/colorA — that
// IS an upright 2x2 checker unit by definition of what a conic gradient
// is (angular sectors from a center point, not diagonal facets), and
// repeating-conic-gradient tiles it automatically both axes at the
// given background-size. This is the standard, widely-used CSS
// checkerboard technique (distinct from the older diagonal
// linear-gradient trick this file used before, which reads as an
// argyle/diamond pattern rather than a checker one at small cell sizes).
// CSS-based — no images required.

import { cn } from "@/lib/utils";

type CheckerboardProps = {
  height?: "xs" | "sm" | "md";
  density?: "tight" | "normal" | "loose";
  colorA?: string;
  colorB?: string;
  className?: string;
};

const heightMap = {
  xs: "h-3",
  sm: "h-5",
  md: "h-8",
};

const sizeMap = {
  tight: "8px",
  normal: "12px",
  loose: "20px",
};

export function Checkerboard({
  height = "sm",
  density = "normal",
  colorA = "#ffffff",
  colorB = "#000000",
  className,
}: CheckerboardProps) {
  const cellSize = sizeMap[density];

  const style = {
    backgroundImage: `repeating-conic-gradient(${colorB} 0% 25%, ${colorA} 0% 50%)`,
    backgroundSize: `${cellSize} ${cellSize}`,
  } as React.CSSProperties;

  return (
    <div
      className={cn("w-full", heightMap[height], className)}
      style={style}
      aria-hidden="true"
    />
  );
}
