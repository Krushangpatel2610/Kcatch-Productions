// components/motion/orbital-indicator.tsx
// RocketAir-inspired orbital work indicator — a subtle circular node
// system around the project number, not a themed rebuild of the site.
// One small ring with a dot per project; the current project's dot sits
// at a fixed "12 o'clock" position while the ring itself rotates so that
// dot always represents the active project — same information as the
// existing linear ScrollProgress bar, presented as a secondary,
// decorative confirmation rather than a replacement for it.
//
// Purely presentational: takes the same current/total props as
// ScrollProgress and derives rotation from them — no independent scroll
// listener, no separate source of truth.

import { cn } from "@/lib/utils";

type OrbitalIndicatorProps = {
  current: number; // 1-based
  total: number;
  className?: string;
};

const SIZE = 40;
const RADIUS = 15;
const CENTER = SIZE / 2;

export function OrbitalIndicator({ current, total, className }: OrbitalIndicatorProps) {
  if (total <= 1) return null;

  const anglePerNode = 360 / total;
  // Rotate the whole ring so the active node sits at the top (-90deg base).
  const ringRotation = -((current - 1) * anglePerNode);

  return (
    <div
      className={cn("relative flex-shrink-0", className)}
      style={{ width: SIZE, height: SIZE }}
      aria-hidden="true"
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="transition-transform duration-500 ease-out"
        style={{ transform: `rotate(${ringRotation}deg)` }}
      >
        {/* Orbit path */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          className="text-kc-line"
          strokeWidth={1}
        />
        {/* One node per project, evenly spaced around the ring */}
        {Array.from({ length: total }).map((_, i) => {
          const angle = (i * anglePerNode - 90) * (Math.PI / 180);
          const cx = CENTER + RADIUS * Math.cos(angle);
          const cy = CENTER + RADIUS * Math.sin(angle);
          const isActive = i === current - 1;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={isActive ? 3 : 1.5}
              className={isActive ? "fill-kc-yellow" : "fill-kc-muted/50"}
            />
          );
        })}
      </svg>
      {/* Fixed (non-rotating) center number — the ring rotates around it */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-body text-[9px] text-kc-white tabular-nums">
          {String(current).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
