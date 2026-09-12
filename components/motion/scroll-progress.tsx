"use client";
// components/motion/scroll-progress.tsx
// Horizontal scroll progress indicator.
// Used inside the FeaturedWorkSection.
// GSAP ScrollTrigger will control the progress value later.

import { cn } from "@/lib/utils";

type ScrollProgressProps = {
  current: number; // 1-based index of current scene
  total: number;
  className?: string;
};

export function ScrollProgress({ current, total, className }: ScrollProgressProps) {
  const progress = total > 1 ? (current - 1) / (total - 1) : 0;

  return (
    <div
      className={cn("flex items-center gap-4", className)}
      role="status"
      aria-live="polite"
      aria-label={`Project ${current} of ${total}`}
    >
      {/* Counter */}
      <span className="font-body text-xs text-kc-muted tracking-widest tabular-nums">
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>

      {/* Track */}
      <div
        className="relative h-[2px] flex-1 bg-kc-line overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-y-0 left-0 bg-kc-yellow transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
          data-progress-bar
        />
      </div>
    </div>
  );
}
