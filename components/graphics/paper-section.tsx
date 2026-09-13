// components/graphics/paper-section.tsx
// A physical "sheet of paper" laid over the section before it.
// Composes <TornPaperEdge /> (the real paper-texture PNG assets) with a
// paper-toned surface and very subtle depth — this reads as one sheet
// placed on top of another poster, not a UI card.
//
// The edge slightly overlaps into its own sheet (not into the previous
// section's real content) via a small negative margin between the edge
// and the paper surface, so there's never a hairline seam at any
// viewport width regardless of subpixel rounding.
//
// Kept deliberately separate from <TapeStack />: paper is the (mostly
// static) transition between two sections; tape is a moving strip that
// sits on top of content.

import { cn } from "@/lib/utils";
import { TornPaperEdge } from "./torn-paper-edge";

type PaperTone = "paper" | "white";

type PaperSectionProps = {
  children: React.ReactNode;
  tone?: PaperTone;
  /** Render only the top edge, only the bottom, or both (default) */
  edges?: "top" | "bottom" | "both";
  /** Give the paper edges their own subtle scroll drift (see TornPaperEdge) */
  parallax?: boolean;
  className?: string;
  sectionClassName?: string;
  "aria-label"?: string;
  "data-section"?: string;
};

const toneBgClass: Record<PaperTone, string> = {
  paper: "bg-kc-paper",
  white: "bg-kc-white",
};

export function PaperSection({
  children,
  tone = "paper",
  edges = "both",
  parallax = false,
  className,
  sectionClassName,
  ...aria
}: PaperSectionProps) {
  return (
    <div className={cn("relative", className)}>
      {(edges === "top" || edges === "both") && (
        <TornPaperEdge className="relative z-[1] -mb-px" parallax={parallax} />
      )}

      <section
        className={cn(toneBgClass[tone], "relative", sectionClassName)}
        {...aria}
      >
        {/* Extremely subtle depth — a soft inner shadow at the very top,
            not a floating-card shadow — so the sheet reads as sitting on
            the page rather than a Material elevation surface. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-6 opacity-[0.06]"
          style={{ background: "linear-gradient(to bottom, #000, transparent)" }}
          aria-hidden="true"
        />
        {children}
      </section>

      {(edges === "bottom" || edges === "both") && (
        <TornPaperEdge variant="bottom" className="relative z-[1] -mt-px" parallax={parallax} />
      )}
    </div>
  );
}
