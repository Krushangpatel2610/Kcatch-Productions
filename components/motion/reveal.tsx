"use client";
// components/motion/reveal.tsx
// Scroll-triggered reveal wrapper.
// Architecture-ready for GSAP ScrollTrigger.
// Uses CSS transition as baseline (works without GSAP).

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();
  // Start visible if reduced motion, otherwise start hidden
  const [visible, setVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setVisible(true), delay * 1000);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, reduced]);

  const translateMap = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: "",
  };

  const Comp = Tag as React.ElementType;

  return (
    <Comp
      ref={ref}
      className={cn(
        "transition-all duration-700",
        !visible && "opacity-0",
        !visible && translateMap[direction],
        visible && "opacity-100 translate-y-0 translate-x-0",
        className
      )}
    >
      {children}
    </Comp>
  );
}
