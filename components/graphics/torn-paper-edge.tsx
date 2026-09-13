// components/graphics/torn-paper-edge.tsx
// A torn-paper edge rendered from the real paper-texture PNG assets
// (public/Images/PNGs/PaperEffectTop.png and PaperEffectBottom.png)
// instead of a procedurally generated SVG silhouette — actual scanned
// paper fiber texture and organic tear shape, not a vector approximation.
//
// Both source PNGs ship with a lot of transparent padding around the
// actual paper/tear content (the opaque band only covers roughly
// 33% / 18% of the raw canvas height). Using the raw files directly and
// scaling them to the edge's actual on-page height (a few dozen px)
// squeezes most of that padding into the visible box, so most of the box
// renders transparent — that's the "gap" between the tape/section and
// the paper look this component was supposed to produce. The *.cropped
// PNGs (generated once, checked into public/) are tight-cropped to just
// the opaque content band, so the full component height is real paper
// with no wasted transparent margin.
//
// PaperEffectTop.cropped.png: tear at the TOP of the frame, solid paper
// below it — used as-is for the TOP edge of a sheet (dark section behind
// shows through above the tear line, paper bridges into the sheet below).
//
// PaperEffectBottom.cropped.png: solid paper at the TOP of the frame,
// tear at the BOTTOM — used as-is for the BOTTOM edge of a sheet (paper
// above, tear drops toward the dark section below). Note this is used
// AS-IS, not vertically flipped — it already has the correct orientation
// for a bottom edge; flipping it would put the tear at the top instead.
//
// This is deliberately a separate system from <TapeStack /> — tape is a
// moving, overlapping physical strip; a paper edge is the (mostly static)
// silhouette of a sheet's own boundary.

import { cn } from "@/lib/utils";

type TornPaperEdgeProps = {
  /**
   * "top" = top edge of a sheet (dark above, paper below the tear).
   * "bottom" = bottom edge of a sheet (paper above, dark below the tear).
   * Each uses its own dedicated, correctly-oriented asset — neither is
   * derived from the other via a CSS flip.
   */
  variant?: "top" | "bottom";
  className?: string;
};

const TOP_SRC = "/Images/PNGs/PaperEffectTop.cropped.png";
const BOTTOM_SRC = "/Images/PNGs/PaperEffectBottom.cropped.png";

export function TornPaperEdge({ variant = "top", className }: TornPaperEdgeProps) {
  const src = variant === "bottom" ? BOTTOM_SRC : TOP_SRC;

  return (
    <div
      className={cn("relative w-full pointer-events-none select-none overflow-hidden", className)}
      style={{ height: "clamp(24px, 3.6vw, 48px)" }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: "repeat-x",
          // "auto 100%": height fills the container, width follows the
          // image's own intrinsic aspect ratio — the tear shape scales
          // correctly at every viewport instead of stretching.
          backgroundSize: "auto 100%",
          backgroundPosition: "left center",
        }}
      />
    </div>
  );
}
