"use client";
// components/graphics/marquee-strip.tsx
// Infinite horizontal ticker. Adapted from kcatch-media's marquee-strip.tsx
// onto Project A's cn()/--kc-* token conventions. The "checker" variant
// reuses the existing .kc-checker pattern (app/globals.css) instead of
// duplicating a second checkerboard implementation.

import { cn } from "@/lib/utils";

type MarqueeVariant = "yellow" | "black" | "checker";

type MarqueeStripProps = {
  items: string[];
  reverse?: boolean;
  duration?: number;
  variant?: MarqueeVariant;
  className?: string;
};

const variantClasses: Record<MarqueeVariant, string> = {
  yellow: "bg-kc-yellow text-kc-black",
  black: "bg-kc-black text-kc-paper",
  checker: "kc-checker text-kc-black",
};

export function MarqueeStrip({
  items,
  reverse = false,
  duration = 28,
  variant = "yellow",
  className,
}: MarqueeStripProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className={cn("relative overflow-hidden py-3", variantClasses[variant], className)}
      role="presentation"
      aria-hidden="true"
    >
      <div
        className={cn("kc-marquee-track", reverse && "kc-marquee-reverse")}
        style={{ "--kc-marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-6 whitespace-nowrap font-display text-2xl uppercase md:text-3xl"
          >
            {item}
            <span className="inline-block h-3 w-3 rotate-45 bg-current" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
