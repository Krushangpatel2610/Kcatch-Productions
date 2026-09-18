"use client";
// components/home/project-scene.tsx
// Reusable project scene component.
// Used in FeaturedWorkSection (horizontal scroll) and Projects archive.
//
// Variants:
//   "featured" — cinematic project-exhibition scene (image dominant,
//                asymmetric editorial composition, physical-media frame)
//   "archive"  — editorial row on Projects page
//   "compact"  — small thumbnail (future use)

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { type Project } from "@/content/projects";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { KcatchImage } from "@/components/ui/kcatch-image";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

type ProjectSceneProps = {
  project: Project;
  index: number;
  total?: number;
  variant?: "featured" | "archive" | "compact";
  className?: string;
};

// ---------------------------------------------------------------------------
// Tag chip
// ---------------------------------------------------------------------------
function Tag({ label, size = "sm" }: { label: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-kc-white/30 text-kc-white/80 font-body uppercase tracking-widest",
        size === "md" ? "text-xs px-3 py-1.5" : "text-[10px] px-2.5 py-1"
      )}
    >
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// TiltImageFrame — the "physical media" image with cursor-following tilt.
// ---------------------------------------------------------------------------
// Reference: RocketAir's work-presentation pages (rocketair.com) use
// gentle depth/motion on their case-study media rather than a flat static
// thumbnail — that's the cue this borrows (restrained 3D tilt + a subtle
// cursor-follow drift), not any copied visuals or layout from that site.
//
// Deliberately its own inner element, separate from the outer
// [data-fw-image-wrap] node: FeaturedWorkSection's scroll-scrub drives
// that outer node's scale/x via gsap.set() every scroll tick. Tilt lives
// on this inner node instead so the two animations never fight over the
// same element's transform.
//
// Uses gsap.quickTo (not gsap.to per mousemove event) — quickTo builds one
// reusable interpolator per property and is the standard GSAP-recommended
// approach for continuous pointer-follow effects: much cheaper than
// creating a new tween on every mousemove, and it already handles
// overlapping/rapid updates smoothly.
function TiltImageFrame({
  children,
  className,
  cursorState,
}: {
  children: React.ReactNode;
  className?: string;
  /** Sets data-cursor for the global CustomCursor to pick up on hover */
  cursorState?: "view" | "play" | "drag";
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  // Cached on enter, not re-read on every mousemove — getBoundingClientRect()
  // forces a layout flush, and this same node's transform changes on
  // every mousemove via the gsap.to below, which is exactly the shape of
  // a layout-thrashing loop if the rect were re-read each time.
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (frameRef.current) rectRef.current = frameRef.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !frameRef.current) return;

    const rect = rectRef.current ?? frameRef.current.getBoundingClientRect();
    // -0.5 to 0.5 across the frame in each axis
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    // Tilt: restrained to rotateX ±2deg / rotateY ±3deg / scale up to
    // ~1.02 — enough to read as depth, not enough to look unstable or
    // become consciously noticeable as "an effect."
    gsap.to(frameRef.current, {
      rotateY: px * 6,
      rotateX: -py * 4,
      x: px * 8,
      y: py * 6,
      scale: 1.018,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (!frameRef.current) return;
    gsap.to(frameRef.current, {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      className="w-full h-full"
      style={{ perspective: "1200px" }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor={cursorState}
    >
      <div
        ref={frameRef}
        className={cn("w-full h-full will-change-transform", className)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Featured variant — cinematic exhibition scene
// ---------------------------------------------------------------------------
// This is "look what KCATCH made," not another hero: the metadata column
// stays compact so the project visual can dominate (~60% of scene width
// on desktop). The image gets a small "physical media" frame treatment —
// a hairline border, a whisper of rotation, one tape accent — rather than
// a plain rectangular card. Every element that should animate in when
// this scene becomes active carries a data-fw-* hook the section's
// GSAP timeline targets directly (see FeaturedWorkSection).
function FeaturedScene({ project, index, className }: ProjectSceneProps) {
  return (
    <article
      className={cn(
        // Mobile: a natural-height, vertically-stacked editorial page —
        // metadata flows top-to-bottom, media gets its own defined block
        // at the end (see data-fw-image-wrap below). No h-full/flex-1
        // anywhere in this mobile path: those only make sense against a
        // fixed-height ancestor, which mobile deliberately doesn't have
        // (the horizontal-viewport wrapper is h-auto on mobile — see
        // FeaturedWorkSection) — that mismatch is what was crushing/
        // clipping this scene's content on mobile.
        // Desktop (md+): unchanged — h-full flex-row scene inside the
        // pinned camera viewport.
        // Desktop: strict 50/50 info/image split via grid-cols-2 (gap is
        // subtracted from the tracks automatically, so this can't drift to
        // 60/70/80% the way flex-1 on the image side previously did).
        // Mobile: unchanged natural-height stacked flex-col.
        "relative w-full h-auto md:h-full flex flex-col md:grid md:grid-cols-2 md:items-center gap-6 md:gap-10 py-6 md:py-0",
        className
      )}
      data-scene={project.id}
      aria-label={`Project: ${project.client}`}
    >
      {/* Metadata column — naturally-flowing block (not stretched with
          justify-between, which was pinning the CTA to the very bottom
          of the scene). Mobile order: number, title, description, tags,
          CTA, then media below (see the mobile grid the brief calls
          for) — desktop keeps its own side-by-side composition. */}
      {/* min-w-0 lets this grid item shrink to its 50% track instead of
          overflowing on long tag/description text. */}
      {/* justify-center: with typography scaled up to properly fill the
          50% column, this block's natural height now tracks the image
          column's height much more closely, so centering it (rather than
          top-flowing) keeps it visually balanced against the image at
          any scene's actual content length instead of drifting toward
          the top with a gap below. */}
      <div className="relative z-10 flex flex-col min-w-0 justify-center">
        {/* Project number — sequential position within the featured order
            (01-07), not the shared archive `number` field (which stays
            untouched since it also drives the /projects archive page). */}
        <div className="flex items-center gap-4 mb-6" data-fw-number>
          <span className="font-display text-kc-yellow text-6xl md:text-7xl leading-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="w-10 h-[1px] bg-kc-muted/40" aria-hidden="true" />
        </div>

        {/* Client name — substantially larger, the dominant text element
            in the column (kc-display for the tight leading/letter-spacing
            treatment used elsewhere for headline-scale type). */}
        <h3
          className="kc-display text-kc-white"
          style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)" }}
          data-fw-title
        >
          {project.client}
        </h3>
        {project.subtitle && (
          <p className="font-hand text-kc-muted text-lg md:text-xl mt-2 mb-6" data-fw-title>
            {project.subtitle}
          </p>
        )}
        {!project.subtitle && <div className="mb-6" />}

        {/* Description — no more max-w-xs: that clamp was leaving most of
            the 50% column's width empty next to the text instead of
            using it, which read as "compressed" even though the column
            itself was correctly sized. */}
        <p className="font-body text-kc-muted text-base md:text-lg leading-relaxed mb-8 max-w-md" data-fw-desc>
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2.5 mb-10" data-fw-tags>
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} size="md" />
          ))}
        </div>

        {/* CTA */}
        <MagneticButton strength={8} data-fw-cta="true">
          <Link
            href={`/projects#${project.id}`}
            className="inline-flex items-center gap-3 bg-kc-yellow text-kc-black font-body text-sm uppercase tracking-widest px-7 py-4 w-fit hover:bg-transparent hover:text-kc-yellow hover:border-kc-yellow border border-kc-yellow transition-all duration-300 group focus-visible:outline-kc-yellow"
            aria-label={`View ${project.client} project`}
          >
            VIEW PROJECT
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </MagneticButton>
      </div>

      {/* The dominant visual — a "physical media" frame, not a plain
          rectangle. A hairline border + whisper of rotation + one tape
          accent reads as a printed/projected image placed into the
          scene. The resting tilt (±0.6deg) lives on this static outer
          wrapper — TiltImageFrame's inner node is fully GSAP-owned
          (rotateX/rotateY/x/y/scale), so a plain CSS transform on that
          same node would get overwritten the first time the pointer
          moves.
          Mobile: a defined height block (not flex-1/h-full, which
          resolve to nothing against this scene's now-auto height) sized
          to feel like a major visual anchor without crowding out the
          metadata above it. Desktop: unchanged flex-1 h-full sizing
          against the pinned scene's fixed height. */}
      {/* md:w-auto (implicit 50% via grid-cols-2) replaces the previous
          md:flex-1, which let this column grow to fill ALL remaining
          space (~70-74%) instead of a strict 50/50 split. */}
      <div
        className="relative w-full h-[32svh] min-h-[220px] max-h-[360px] md:h-full md:min-h-0 md:max-h-none min-w-0 flex items-center justify-center"
        data-fw-image-wrap
      >
        <div
          className="relative w-full h-full md:h-[88%]"
          style={{ transform: `rotate(${index % 2 === 0 ? -0.6 : 0.6}deg)` }}
        >
          <TiltImageFrame
            className="relative overflow-hidden border border-kc-white/15 shadow-2xl"
            cursorState="view"
          >
            {/* Mask layer — a dedicated node so FeaturedWorkSection's
                scroll-scrub can drive its clip-path independently of the
                scale/x transform on [data-fw-image-wrap] and the mouse
                tilt on TiltImageFrame's own node. Editorial jagged-edge
                reveal (see lib/motion/mask-reveal.ts), not a plain
                rectangle wipe. Starts fully closed (progress 0) so the
                image never flashes unmasked before the scroll math runs. */}
            <div
              data-fw-mask
              className="absolute inset-0"
              style={{ clipPath: "polygon(0% 0%, -5% 0%, -5% 100%, 0% 100%)" }}
            >
              {/* Photo layer — travels/settles as the mask opens (its own
                  node, separate from the mask's clip-path and from
                  TiltImageFrame's mouse-driven transform one level up), so
                  the reveal reads as a photograph sliding into place behind
                  an opening crop rather than a flat crop-only wipe. */}
              <div data-fw-photo className="absolute inset-0">
                <KcatchImage
                  src={project.heroImage}
                  alt={`${project.client} campaign visual`}
                  className="absolute inset-0 object-cover"
                  fill
                  priority={index < 2}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  placeholderLabel={project.number}
                />
              </div>

              {/* Tape accent — top-left corner, the one "physical" detail this
                  frame needs; everything else stays clean per-scene. */}
              <div
                className="absolute -top-2 left-6 w-16 h-6 bg-kc-yellow/90 shadow-md"
                style={{ transform: "rotate(-3deg)" }}
                aria-hidden="true"
              />

              {/* Annotation overlay */}
              {project.annotation && (
                <div
                  className="absolute bottom-6 right-6 z-10 text-right"
                  aria-hidden="true"
                >
                  <HandwrittenNote
                    text={project.annotation}
                    rotation={-2}
                    size="md"
                    color="white"
                  />
                </div>
              )}
            </div>
          </TiltImageFrame>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Archive variant — used on Projects page
// ---------------------------------------------------------------------------
function ArchiveScene({ project, className }: ProjectSceneProps) {
  return (
    <article
      id={project.id}
      className={cn("group relative grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_auto] gap-6 md:gap-8 items-center py-8 border-b border-kc-line hover:border-kc-yellow/40 transition-colors", className)}
      aria-label={`Project: ${project.client}`}
    >
      {/* Number + category */}
      <div className="flex md:flex-col items-baseline md:items-start gap-3 md:gap-1 min-w-[80px]">
        <span className="font-display text-kc-yellow text-4xl md:text-5xl leading-none">
          {project.number}
        </span>
        <span className="font-body text-kc-muted text-[10px] uppercase tracking-widest">
          {project.category}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="font-display text-kc-white text-2xl md:text-3xl uppercase mb-1 group-hover:text-kc-yellow transition-colors">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="font-hand text-kc-muted text-sm mb-2">
            {project.subtitle}
          </p>
        )}
        <p className="font-body text-kc-muted text-sm leading-relaxed max-w-sm">
          {project.description}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>

      {/* Image slot */}
      <div className="hidden md:block">
        <div className="relative h-32 lg:h-40 w-64 lg:w-80 overflow-hidden">
          <KcatchImage
            src={project.heroImage}
            alt={`${project.client} campaign visual`}
            fill
            className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            placeholderLabel={project.number}
          />
        </div>
      </div>

      {/* CTA arrow */}
      <Link
        href={`/projects#${project.id}`}
        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-kc-white/30 text-kc-white hover:border-kc-yellow hover:bg-kc-yellow hover:text-kc-black transition-all duration-300 group-hover:border-kc-yellow group-hover:translate-x-1 focus-visible:outline-kc-yellow flex-shrink-0"
        aria-label={`View ${project.client} project`}
      >
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function ProjectScene({
  project,
  index,
  variant = "featured",
  className,
}: ProjectSceneProps) {
  if (variant === "archive") {
    return <ArchiveScene project={project} index={index} className={className} />;
  }
  return (
    <FeaturedScene
      project={project}
      index={index}
      className={className}
    />
  );
}
