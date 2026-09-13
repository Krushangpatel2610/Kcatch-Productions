// components/graphics/torn-paper-edge.tsx
// A torn-paper edge rendered from the real paper-texture PNG assets
// (public/Images/PNGs/PaperEffectTop.png and PaperEffectBottom.png)
// instead of a procedurally generated SVG silhouette — actual scanned
// paper fiber texture and organic tear shape, not a vector approximation.
//
// Both source PNGs ship with a lot of transparent padding around the
// actual paper/tear content. The *.cropped PNGs (generated once, checked
// into public/) are tight-cropped to the outer opaque bounds, but the
// tear itself is still a diagonal boundary WITHIN that crop — measured
// directly (see the alpha-channel scan that produced these numbers):
// PaperEffectTop.cropped.png (2160x234) is essentially transparent until
// roughly 65% down its own height, solid paper only in the bottom ~30%.
// PaperEffectBottom.cropped.png (2161x134) is the mirror: solid paper in
// the top ~65%, transparent below. That transparent majority is exactly
// why animating this layer's own position is dangerous: shift it by
// more than a few px and the transparent region slides into the visible
// box, exposing whatever sits behind it as a "gap."
//
// TWO-LAYER FIX: a solid-color BACKING layer (this component's own
// tone — always the color the adjacent section actually is, filling the
// whole box, never transformed) sits underneath the PNG texture layer.
// The texture is what may drift a few px for depth (`parallax`); the
// backing guarantees that even if the texture's own transparent margin
// slides into view, what's revealed is the correct section color, never
// a hole through to whatever's further behind. The backing is the
// structural seam; the texture is the visual paper — exactly two
// separate concerns, per the architecture this component is built to.
//
// PaperEffectTop.cropped.png: tear near the top, solid paper below —
// used as-is for the TOP edge of a sheet.
// PaperEffectBottom.cropped.png: solid paper on top, tear near the
// bottom — used as-is for the BOTTOM edge, not flipped (it already has
// the correct orientation).
//
// Single stretched (non-repeating) layer, not a tile: background-size
// "100% 100%". Tiling was the root cause of an earlier duplicate-seam
// artifact — at wider viewports the tile boundary read as a second torn
// edge sitting beside the first.
//
// Deliberately separate from <TapeStack /> — tape is a moving,
// overlapping physical strip; a paper edge is the boundary silhouette
// of a sheet, with only a small optional depth drift.

"use client";

import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type TornPaperEdgeProps = {
  /**
   * "top" = top edge of a sheet (dark above, paper below the tear).
   * "bottom" = bottom edge of a sheet (paper above, dark below the tear).
   * Each uses its own dedicated, correctly-oriented asset — neither is
   * derived from the other via a CSS flip.
   */
  variant?: "top" | "bottom";
  /**
   * The color the NON-paper side of this edge actually is — the dark
   * section variant faces (top edge: the section above; bottom edge:
   * the section below). This becomes the backing layer's solid color,
   * so if the texture's own transparent margin ever slides into view
   * (small parallax drift), what shows through is that real color, not
   * a hole to the page background.
   */
  backingColor?: string;
  className?: string;
  /**
   * Gives the paper texture its own small vertical depth relative to
   * the sections it sits between — a few px, never enough to expose
   * more of the texture's transparent margin than the backing layer
   * safely covers. Off by default; enable per-transition, not globally.
   */
  parallax?: boolean;
};

const TOP_SRC = "/Images/PNGs/PaperEffectTop.cropped.png";
const BOTTOM_SRC = "/Images/PNGs/PaperEffectBottom.cropped.png";

// Barely-perceptible depth — a hint of parallax, not visible movement.
// Reduced from an earlier 6px total after feedback that any noticeably
// moving texture read as "the seam disconnecting" even though the
// backing-color layer made it mathematically gap-safe: the perception
// problem is separate from the safety problem. 2px total travel is
// well inside the ~8-17px of solid-paper margin the alpha scan (see
// file header) found to spare, so it stays exactly as safe, just far
// less visible as motion.
const TRAVEL_PX = 2;

export function TornPaperEdge({
  variant = "top",
  backingColor = "var(--kc-black)",
  className,
  parallax = false,
}: TornPaperEdgeProps) {
  const src = variant === "bottom" ? BOTTOM_SRC : TOP_SRC;
  const wrapRef = useRef<HTMLDivElement>(null);
  const textureRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!parallax || prefersReducedMotion() || !wrapRef.current || !textureRef.current) return;
      // The sheet reads as being pulled upward through the seam as the
      // page scrolls down — a small, felt drift, not a detachment.
      // Scrub kept tight (0.4) so it tracks the wheel/touch input
      // closely rather than feeling laggy — buttery, matching the rest
      // of the site's scroll feel.
      gsap.fromTo(
        textureRef.current,
        { y: TRAVEL_PX / 2 },
        {
          y: -TRAVEL_PX / 2,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.4,
          },
        }
      );
    },
    { scope: wrapRef, dependencies: [parallax, variant] }
  );

  return (
    <div
      ref={wrapRef}
      className={cn("relative w-full pointer-events-none select-none overflow-hidden", className)}
      style={{ height: "clamp(24px, 3.6vw, 48px)", backgroundColor: backingColor }}
      aria-hidden="true"
    >
      {/* Texture layer — the only thing that ever moves. Sized/positioned
          to exactly fill the box at rest; the small TRAVEL_PX drift
          above can only ever expose the backing color (this div's
          parent background), never a page-level gap. */}
      <div
        ref={textureRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
