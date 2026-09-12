"use client";
// components/graphics/kcatch-tape.tsx
// Reusable KCATCH yellow tape strip component.
// Animation-ready seamless loop using GSAP.

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type KcatchTapeProps = {
  text?: string;
  rotation?: number;
  variant?: "yellow" | "white" | "dark";
  /** Marquee continuously scrolls the text */
  marquee?: boolean;
  className?: string;
};

export function KcatchTape({
  text = "KCATCH THE EYE",
  rotation = 0,
  variant = "yellow",
  marquee = false,
  className,
}: KcatchTapeProps) {
  const bgColor = {
    yellow: "bg-kc-yellow text-kc-black",
    white: "bg-kc-white text-kc-black",
    dark: "bg-kc-black text-kc-white",
  }[variant];

  // Repeat text so it tiles naturally. Add a trailing star so it connects seamlessly to the next segment.
  const repeatedText = Array(12).fill(text).join(" ★ ") + " ★ ";

  const trackRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marquee || !trackRef.current || !segmentRef.current) return;

    let tween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const segmentWidth = segmentRef.current!.offsetWidth;

      tween = gsap.to(trackRef.current, {
        x: -segmentWidth,
        ease: "none",
        duration: segmentWidth / 60, // constant calm speed based on actual width
        repeat: -1,
      });
    }, trackRef);

    // Recalculate the loop distance on resize so the seam never shows.
    const handleResize = () => {
      tween?.kill();
      gsap.set(trackRef.current, { x: 0 });
      const newWidth = segmentRef.current!.offsetWidth;
      tween = gsap.to(trackRef.current, {
        x: -newWidth,
        ease: "none",
        duration: newWidth / 60,
        repeat: -1,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [marquee]);

  const segments = [0, 1, 2];

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      {/* Perforated edges — reinforce the "physical tape" read */}
      <div
        className="absolute left-0 right-0 top-0 h-[3px] opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(0,0,0,0.5) 0 6px, transparent 6px 14px)",
        }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 h-[3px] opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(0,0,0,0.5) 0 6px, transparent 6px 14px)",
        }}
      />
      <div className="relative overflow-hidden w-full">
        <div
          ref={trackRef}
          className={cn(
            "flex items-center gap-0 whitespace-nowrap shadow-sm w-max",
            bgColor
          )}
          style={{ height: "clamp(40px, 5vw, 70px)" }}
        >
          {segments.map((i) => (
            <div
              key={i}
              ref={i === 0 ? segmentRef : undefined}
              className="flex items-center flex-shrink-0 font-display uppercase tracking-widest px-2 leading-none pb-1"
              style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.9rem)" }}
            >
              {repeatedText}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
