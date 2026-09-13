"use client";
// components/graphics/tape-strip.tsx
// A single physical "tape" ribbon: a colored strip with an irregular
// (not perfectly rectangular) top/bottom edge, a seamless marquee, and a
// slight rotation — the building block for <TapeStack />.
//
// The irregular edge is a clip-path polygon with hand-tuned points, not a
// generated wave — subtle and premium rather than cartoonish, and cheap
// to render (no SVG mask, no per-frame cost).
//
// Two motion strategies, both transform-based (translate3d) so nothing
// but the compositor layer is touched per frame:
//   - text variants (yellow/white/dark): a duplicated flex track is
//     translated horizontally (classic seamless marquee).
//   - checker variant: an oversized checker-pattern layer is translated
//     by exactly one checker tile period and loops seamlessly — same
//     mechanism as the text marquee, just without a DOM text track.

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

export type TapeStripProps = {
  text: string;
  variant?: "yellow" | "checker" | "white" | "dark";
  /** Marquee direction */
  direction?: "left" | "right";
  rotation?: number;
  /** Vertical offset in px — used to stagger stacked tapes */
  offsetY?: number;
  className?: string;
  /** Checker cell size in px (checker variant only) */
  checkerSize?: number;
};

// Irregular top/bottom edge as a clip-path polygon. Points are expressed
// as percentages so the same shape scales to any width without distortion.
// Deliberately restrained — a few points of a few percent of the tape's
// own height, not a cartoon wave.
const TOP_EDGE: [number, number][] = [
  [0, 3], [8, 0], [19, 2.5], [31, 0.5], [44, 2.5],
  [57, 0], [69, 2], [82, 0.5], [93, 2.5], [100, 0.5],
];
const BOTTOM_EDGE: [number, number][] = [
  [100, 97], [91, 100], [80, 97.5], [67, 99.5], [55, 97],
  [43, 100], [30, 98], [18, 99.5], [8, 97], [0, 99.5],
];

function buildClipPath() {
  const top = TOP_EDGE.map(([x, y]) => `${x}% ${y}%`).join(", ");
  const bottom = BOTTOM_EDGE.map(([x, y]) => `${x}% ${y}%`).join(", ");
  return `polygon(${top}, ${bottom})`;
}

const CLIP_PATH = buildClipPath();

export function TapeStrip({
  text,
  variant = "yellow",
  direction = "left",
  rotation = 0,
  offsetY = 0,
  className,
  checkerSize = 22,
}: TapeStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);
  const checkerRef = useRef<HTMLDivElement>(null);

  const isChecker = variant === "checker";

  const bgClass = {
    yellow: "bg-kc-yellow text-kc-black",
    white: "bg-kc-white text-kc-black",
    dark: "bg-kc-black text-kc-white",
    checker: "bg-white",
  }[variant];

  const checkerBgImage = `
    linear-gradient(45deg, #000 25%, transparent 25%),
    linear-gradient(-45deg, #000 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #000 75%),
    linear-gradient(-45deg, transparent 75%, #000 75%)
  `;

  // Text marquee (yellow/white/dark)
  useEffect(() => {
    if (isChecker || prefersReducedMotion() || !trackRef.current || !segmentRef.current) return;

    let tween: gsap.core.Tween | null = null;
    const sign = direction === "left" ? -1 : 1;

    const ctx = gsap.context(() => {
      const segmentWidth = segmentRef.current!.offsetWidth;
      tween = gsap.to(trackRef.current, {
        x: sign * segmentWidth,
        ease: "none",
        duration: segmentWidth / 60,
        repeat: -1,
        force3D: true,
      });
    }, trackRef);

    const handleResize = () => {
      tween?.kill();
      gsap.set(trackRef.current, { x: 0 });
      const newWidth = segmentRef.current!.offsetWidth;
      tween = gsap.to(trackRef.current, {
        x: sign * newWidth,
        ease: "none",
        duration: newWidth / 60,
        repeat: -1,
        force3D: true,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [direction, isChecker]);

  // Checker pattern motion — translate a checker layer twice the strip's
  // width by exactly one checker period, looping seamlessly. Uses the same
  // transform-based mechanism as the text marquee (reliable across
  // browsers, GPU-accelerated) rather than animating background-position
  // on a multi-layer gradient background.
  useEffect(() => {
    if (!isChecker || prefersReducedMotion() || !checkerRef.current) return;

    const sign = direction === "left" ? -1 : 1;
    const period = checkerSize * 2; // one full checker tile repeat

    const tween = gsap.to(checkerRef.current, {
      x: sign * period,
      ease: "none",
      duration: 1.6,
      repeat: -1,
      force3D: true,
    });

    return () => {
      tween.kill();
    };
  }, [isChecker, direction, checkerSize]);

  // Repeat text so the marquee tiles seamlessly; unused for the checker layer.
  const repeatedText = Array(12).fill(text).join(" ★ ") + " ★ ";
  const segments = [0, 1, 2];

  return (
    <div
      className={cn("absolute top-1/2 left-[-8%] right-[-8%] w-[116%]", className)}
      style={{
        transform: `translateY(calc(-50% + ${offsetY}px)) rotate(${rotation}deg)`,
      }}
      aria-hidden="true"
    >
      <div
        className={cn("relative overflow-hidden w-full shadow-lg", bgClass)}
        style={{
          height: "clamp(38px, 5vw, 68px)",
          clipPath: CLIP_PATH,
        }}
      >
        {isChecker ? (
          <div className="absolute inset-0 overflow-hidden">
            {/* Oversized by one checker period on each side so translating
                by exactly that period loops with no visible edge. */}
            <div
              ref={checkerRef}
              className="absolute will-change-transform"
              style={{
                top: 0,
                bottom: 0,
                left: -checkerSize * 2,
                right: -checkerSize * 2,
                transform: "translate3d(0,0,0)",
                backgroundImage: checkerBgImage,
                backgroundSize: `${checkerSize}px ${checkerSize}px`,
                backgroundPosition: `0 0, 0 ${checkerSize / 2}px, ${checkerSize / 2}px -${checkerSize / 2}px, -${checkerSize / 2}px 0`,
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            <div
              ref={trackRef}
              className="flex items-center h-full w-max will-change-transform"
              style={{ transform: "translate3d(0,0,0)" }}
            >
              {segments.map((i) => (
                <div
                  key={i}
                  ref={i === 0 ? segmentRef : undefined}
                  className="flex items-center flex-shrink-0 font-display uppercase tracking-widest px-2 leading-none pb-1"
                  style={{ fontSize: "clamp(1.05rem, 2.1vw, 1.8rem)" }}
                >
                  {repeatedText}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
