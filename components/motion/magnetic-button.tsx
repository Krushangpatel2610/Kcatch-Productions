"use client";
// components/motion/magnetic-button.tsx
// Magnetic hover effect wrapper — Cuberto-inspired restrained magnetism:
// the element nudges a few px toward the cursor while hovered, and
// eases back to rest on leave. Reserved for genuinely important CTAs
// (WATCH SHOWREEL, VIEW PROJECT, START A PROJECT, SEND IT) — not every
// link, per the brief's own "don't magnetize everything" rule.

import { useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

type MagneticButtonProps = {
  children: React.ReactNode;
  /** Max offset in px the element moves toward the cursor */
  strength?: number;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "className" | "onMouseMove" | "onMouseLeave">;

export function MagneticButton({
  children,
  strength = 12,
  className,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(ref.current, {
      x: px * strength * 2,
      y: py * strength * 1.4,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
      data-magnetic
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </div>
  );
}
