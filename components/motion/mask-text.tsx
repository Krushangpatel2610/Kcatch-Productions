"use client";
// components/motion/mask-text.tsx
// Editorial "sheet lifts away" text reveal — a physical mask, not a
// generic fade+slide. Each line sits inside its own overflow-hidden
// window; the text itself rises into view from beneath that window's
// lower edge, so it reads as a printed line being uncovered rather than
// a UI element fading in. Reserved for major typography (hero
// headlines, section headings, project titles) per the site's own
// "don't animate every sentence" rule — supporting copy keeps the
// lighter Reveal fade.
//
// Scroll-triggered via IntersectionObserver (not GSAP ScrollTrigger):
// this needs to work for arbitrary standalone headings anywhere on the
// page without requiring a dedicated pinned/scrubbed parent section —
// a one-shot "play once when it enters the viewport" reveal, not a
// scroll-scrubbed state like Featured Work's masks.

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

type MaskLine = string | { text: string; className?: string };

type MaskTextProps = {
  /**
   * One line per array entry; each gets its own mask window. Pass a
   * plain string for a line that uses `lineClassName`, or
   * { text, className } when a specific line needs its own styling
   * (e.g. the second line of a two-tone headline).
   */
  lines: MaskLine[];
  /** Tag for the outer wrapper — h1/h2/h3/div as the context needs. */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  /** className applied to every line's inner (visible) span by default */
  lineClassName?: string;
  /** Stagger between lines, seconds */
  stagger?: number;
  /** Delay before the first line starts, seconds */
  delay?: number;
};

export function MaskText({
  lines,
  as: Tag = "div",
  className,
  style,
  lineClassName,
  stagger = 0.08,
  delay = 0,
}: MaskTextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Starts false on every render, including the client's hydration
  // render (see the CustomCursor/Preloader fix elsewhere in this
  // codebase for why a lazy initializer reading browser state here
  // would itself cause a hydration mismatch) — flips true only once an
  // IntersectionObserver confirms the element is actually in view,
  // strictly after mount.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!inView || !rootRef.current) return;
      const lineEls = rootRef.current.querySelectorAll<HTMLElement>("[data-mask-line]");
      gsap.fromTo(
        lineEls,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger,
          delay,
        }
      );
    },
    { dependencies: [inView], scope: rootRef }
  );

  const Comp = Tag as React.ElementType;
  const reduced = prefersReducedMotion();

  return (
    <Comp ref={rootRef} className={className} style={style}>
      {lines.map((line, i) => {
        const text = typeof line === "string" ? line : line.text;
        const ownClassName = typeof line === "string" ? undefined : line.className;
        return (
          <span key={i} className="block overflow-hidden">
            <span
              data-mask-line
              className={cn("block", lineClassName, ownClassName)}
              style={reduced ? undefined : { transform: inView ? undefined : "translateY(115%)" }}
            >
              {text}
            </span>
          </span>
        );
      })}
    </Comp>
  );
}
