"use client";
// components/motion/magnetic-button.tsx
// Magnetic hover effect wrapper.
// Architecture-ready: GSAP will handle the magnetic offset later.
// Currently passes through without animation (correct baseline).

import { useRef } from "react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: React.ReactNode;
  strength?: number;
  className?: string;
};

export function MagneticButton({
  children,
  strength = 0.3,
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  // TODO: add GSAP magnetic offset in motion phase
  // The data attribute makes the element discoverable for the GSAP implementation.

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      data-magnetic
      data-magnetic-strength={strength}
    >
      {children}
    </div>
  );
}
