// components/graphics/checkerboard.tsx
// Reusable checkerboard divider.
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
  const half = `calc(${cellSize} / 2)`;

  const style = {
    backgroundImage: `
      linear-gradient(45deg, ${colorB} 25%, transparent 25%),
      linear-gradient(-45deg, ${colorB} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${colorB} 75%),
      linear-gradient(-45deg, transparent 75%, ${colorB} 75%)
    `,
    backgroundSize: `${cellSize} ${cellSize}`,
    backgroundPosition: `0 0, 0 ${half}, ${half} -${half}, -${half} 0`,
    backgroundColor: colorA,
  } as React.CSSProperties;

  return (
    <div
      className={cn("w-full", heightMap[height], className)}
      style={style}
      aria-hidden="true"
    />
  );
}
