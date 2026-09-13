"use client";
// components/home/featured-work-section.tsx
// Home Featured Work horizontal scroll section.
//
// Architecture:
//   - Desktop (md+): GSAP ScrollTrigger pins the section and translates
//     the track horizontally as the user scrolls vertically.
//   - Mobile: no pinning — the track is a native overflow-x-auto
//     scroll-snap carousel, tracked via a scroll listener instead of
//     ScrollTrigger.
//
// SCROLL PROGRESS IS THE SINGLE SOURCE OF TRUTH.
// Every per-project visual state (scale, opacity, text position) is
// derived directly from the scrubbed ScrollTrigger's progress on every
// tick via gsap.set() — never from a separate fromTo()/timeline that
// plays on mount or on an activeIndex state change. That event-based
// approach (an earlier version of this file) fights the scrub: it
// restarts from a fixed "from" state regardless of where the user
// actually is in the scroll, which desyncs on fast scroll, scrolling
// backward, or jumping between projects, and made Project 01 render
// partway through its own entrance animation instead of already-settled
// on first paint. There is exactly one calculation path now: scroll
// progress -> each project's own normalized progress -> gsap.set().

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}
import { ArrowLeft, ArrowRight } from "lucide-react";
import { featuredProjects } from "@/content/projects";
import { FEATURED_WORK } from "@/content/site";
import { ProjectScene } from "./project-scene";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { OrbitalIndicator } from "@/components/motion/orbital-indicator";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { MaskText } from "@/components/motion/mask-text";
import { Container } from "@/components/layout/container";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { buildMaskClipPath } from "@/lib/motion/mask-reveal";
import { onPreloaderDone } from "@/lib/motion/preloader-gate";

// Maps a value from one range to another, clamped to [0,1] output.
function mapRange(value: number, inMin: number, inMax: number): number {
  if (inMax === inMin) return value >= inMax ? 1 : 0;
  const t = (value - inMin) / (inMax - inMin);
  return Math.max(0, Math.min(1, t));
}

export function FeaturedWorkSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = featuredProjects.length;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  // Holds the "set up the pinned ScrollTrigger" function so the separate
  // preloader-gate effect below can call it once the gate fires —
  // useGSAP's own callback return value isn't used as a cleanup hook by
  // @gsap/react (only its internal context.revert() on unmount is), so
  // a plain window-event subscription's lifecycle needs a real useEffect
  // instead, exactly the pattern already used in hero-section.tsx.
  const createScrollTriggerRef = useRef<(() => void) | null>(null);

  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const reduced = prefersReducedMotion();
    const track = trackRef.current;

    // The ONLY reliable source of the horizontal scroll distance is a
    // fresh DOM measurement on every scroll tick, NOT a value cached at
    // mount time. Previously this used:
    //
    //   const tween = gsap.to(track, { x: () => -getScrollAmount() });
    //   ScrollTrigger.create({ animation: tween, scrub: 1, ... });
    //
    // GSAP evaluates the function value ONCE when the tween is created
    // (inside useGSAP on mount — before any images are decoded, before
    // Lenis has settled, before fonts have shifted layout). The resulting
    // cached x-end value was consistently too small, which cut the pin
    // range short and produced the "can't scroll past project 4" symptom.
    //
    // The fix: drive track translation entirely from onUpdate. We read
    // track.scrollWidth on every scroll tick — the DOM has always had
    // the correct width by the time the user is actually scrolling — and
    // use document.documentElement.clientWidth (excludes scrollbar) rather
    // than window.innerWidth for accuracy.
    //
    // No `animation` property on the ScrollTrigger — GSAP's scrub proxy
    // is replaced by a direct gsap.set() call that is 100% driven by
    // the live progress value ScrollTrigger provides.
    const getScrollAmount = () =>
      track.scrollWidth - document.documentElement.clientWidth;

    // Each project gets an equal "active window" along the 0-1 global
    // progress. Project i's own progress reaches 1 (fully settled) at
    // the center of its window and fades toward 0 at the edges — this
    // is the projectProgress = mapRange(...) model, evaluated fresh on
    // every scrub tick rather than played once as an independent timeline.
    const applySceneState = (globalProgress: number) => {
      const step = 1 / total;
      sceneRefs.current.forEach((scene, i) => {
        if (!scene) return;

        const center = i * step + step / 2;
        // Distance from this project's center, normalized so 0 = fully
        // active, 1 = one full window away (fully settled neighbor state).
        const distance = Math.abs(globalProgress - center) / step;
        const settleAmount = 1 - mapRange(distance, 0, 1); // 1 at center, 0 one window away

        const mask = scene.querySelector<HTMLElement>("[data-fw-mask]");

        if (reduced) {
          gsap.set(scene, { opacity: 1 });
          const imageWrap = scene.querySelector("[data-fw-image-wrap]");
          if (imageWrap) gsap.set(imageWrap, { opacity: 1, scale: 1, x: 0 });
          const photo = scene.querySelector("[data-fw-photo]");
          if (photo) gsap.set(photo, { scale: 1, x: 0, y: 0 });
          if (mask) mask.style.clipPath = buildMaskClipPath(1);
          return;
        }

        // Scene-level dominance: current scene reads at full strength,
        // neighbors recede but never fully vanish (keeps the "next
        // project" glimpse and the "previous project stays present"
        // feel from the brief) — never below a readable floor.
        const sceneOpacity = 0.28 + settleAmount * 0.72;
        gsap.set(scene, { opacity: sceneOpacity });

        const imageWrap = scene.querySelector("[data-fw-image-wrap]");
        if (imageWrap) {
          gsap.set(imageWrap, {
            scale: 0.94 + settleAmount * 0.06,
            x: (1 - settleAmount) * (globalProgress < center ? 24 : -24),
          });
        }

        // Mask reveal: its own dedicated node (see project-scene.tsx),
        // driven by the same settleAmount so it opens/closes in lockstep
        // with everything else — set via plain style.clipPath rather
        // than gsap.set, since clip-path polygons aren't one of GSAP's
        // optimized CSS properties and a direct style write is cheaper
        // here than routing it through GSAP's property-parsing. The clip
        // path's own internal pacing (see buildMaskClipPath) gives the
        // crack -> major reveal -> settle rhythm, not linear settleAmount.
        if (mask) mask.style.clipPath = buildMaskClipPath(settleAmount);

        // Photo travel: the image itself drifts in and settles as the
        // crop opens — same settleAmount input as the mask so the two
        // stay perfectly in lockstep at every scroll tick (forward,
        // reverse, jump, or stopped mid-scroll), just reading as "the
        // photograph sliding into place" rather than a static image
        // sitting behind a moving crop.
        const photo = scene.querySelector("[data-fw-photo]");
        if (photo) {
          gsap.set(photo, {
            scale: 1.08 - settleAmount * 0.08,
            x: (1 - settleAmount) * 18,
            y: (1 - settleAmount) * -10,
          });
        }

        const textEls = scene.querySelectorAll(
          "[data-fw-number], [data-fw-title], [data-fw-desc], [data-fw-tags] > *, [data-fw-cta]"
        );
        gsap.set(textEls, {
          opacity: settleAmount,
          y: (1 - settleAmount) * 14,
        });
      });
    };

    // Prime the first frame before any scroll happens so Project 01
    // renders already-settled, not mid-entrance.
    applySceneState(0);
    gsap.set(track, { x: 0, force3D: true });

    createScrollTriggerRef.current = () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        // end is a function so GSAP re-evaluates it on every refresh().
        // clientWidth excludes the scrollbar (innerWidth includes it),
        // preventing a 15-17px under-count that was also trimming the range.
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          // Re-prime scene state AND reset track to the correct x position
          // for the current progress so there's no visible jump after refresh.
          gsap.set(track, { x: -getScrollAmount() * self.progress, force3D: true });
          applySceneState(self.progress);
        },
        onUpdate: (self) => {
          // Fresh measurement on every tick — this is the key fix.
          // getScrollAmount() reads track.scrollWidth which the browser
          // always has correct by the time the user is actually scrolling.
          gsap.set(track, { x: -getScrollAmount() * self.progress, force3D: true });
          applySceneState(self.progress);
          // Same window model as applySceneState: project i owns the
          // range [i/total, (i+1)/total), so the displayed index always
          // matches whichever scene is actually dominant on screen.
          const index = Math.min(total - 1, Math.floor(self.progress * total));
          setActiveIndex(index);
        },
      });
    };
  }, { scope: sectionRef });

  // A plain effect (not useGSAP) so the subscription has real,
  // React-managed cleanup — see the comment on createScrollTriggerRef.
  useEffect(() => {
    return onPreloaderDone(() => {
      // The 1000ms delay ensures the Hero entrance is done before we do
      // the layout measurement. However that's still not enough on slower
      // machines/connections because Next.js Image components (which are
      // all in this track) may not have painted their final sizes yet.
      // We create the ScrollTrigger first, then call ScrollTrigger.refresh()
      // a further 400ms later so the scrub end-distance is re-calculated
      // against the fully-rendered, fully-settled DOM. This is the root
      // cause of the intermittent "can't scroll past project 3" bug:
      // the first measurement was producing a scrollWidth that was 0-200px
      // too short, cutting the pin range short.
      setTimeout(() => {
        createScrollTriggerRef.current?.();
        // Second pass: re-measure after images have decoded and laid out.
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 400);
      }, 1000);
    });
  }, []);

  // Mobile: the track is a native scroll-snap carousel, so track the
  // active index from scroll position instead of GSAP's ScrollTrigger.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

    const handleScroll = () => {
      if (!isMobile()) return;
      const children = Array.from(track.children) as HTMLElement[];
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      children.forEach((child, i) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(childCenter - trackCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i));
    setActiveIndex(clamped);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const el = document.querySelector(`[data-scene="${featuredProjects[clamped].id}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      return;
    }

    // Desktop: the pinned ScrollTrigger owns scroll position, so move the
    // window scroll to the point in the pin range that matches this index.
    // Same window-center formula as applySceneState/onUpdate above
    // ((i + 0.5) / total, not i / (total - 1)) so a next/prev click lands
    // exactly where that project is fully dominant, not partway into its
    // neighbor's window.
    const st = ScrollTrigger.getAll().find((t) => t.trigger === sectionRef.current);
    if (!st) return;
    const progress = (clamped + 0.5) / total;
    const target = st.start + (st.end - st.start) * progress;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-kc-black overflow-hidden"
      aria-label="Featured Work"
      data-section="featured-work"
    >
      {/* Seam — reads as this section physically sliding up over the Hero
          beneath it (both share bg-kc-black, so a color-based torn edge
          would be invisible; a soft shadow + thin yellow rule stands in
          as the physical edge instead). */}
      <div
        className="absolute top-0 left-0 right-0 h-10 md:h-14 -translate-y-full pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
        }}
        aria-hidden="true"
      />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-kc-yellow/70" aria-hidden="true" />

      {/* ── Section header ── */}
      {/* Top padding matches (and slightly exceeds) the fixed nav's own
          height at each breakpoint (h-16 / md:h-[80px] / lg:h-[96px]) so
          the section label never sits underneath/behind the nav once this
          section is pinned to the top of the viewport. Kept tight (not
          more than needed) because this whole section gets pinned to
          exactly one viewport height — every extra px here is a px the
          horizontal scene viewport doesn't get, which is what was
          pushing the CTA/progress bar past the bottom of the screen. */}
      <Container className="pt-20 md:pt-24 lg:pt-28 pb-4 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: label + headline */}
          <div className="lg:col-span-1">
            <p className="font-body text-xs uppercase tracking-widest text-kc-muted mb-3">
              {FEATURED_WORK.sectionLabel}
            </p>
            <MaskText
              as="h2"
              className="font-display text-kc-white uppercase leading-none"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
              lines={[FEATURED_WORK.headline1, { text: FEATURED_WORK.headline2, className: "text-kc-yellow" }]}
              stagger={0.1}
            />
          </div>

          {/* Center: annotation words */}
          <div className="lg:col-span-1 flex flex-col items-start md:items-center">
            <HandwrittenNote
              text={FEATURED_WORK.supportWords.join("\n")}
              size="md"
              color="white"
              rotation={-2}
            />
          </div>

          {/* Right: description + nav controls */}
          <div className="lg:col-span-1 flex flex-col items-start lg:items-end gap-4">
            <p className="font-body text-kc-muted text-sm leading-relaxed max-w-xs lg:text-right">
              {FEATURED_WORK.annotation}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-body text-[10px] uppercase tracking-widest text-kc-muted mr-2">
                {FEATURED_WORK.scrollHint}
              </span>
              <button
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="w-10 h-10 border border-kc-white/30 flex items-center justify-center text-kc-white hover:border-kc-yellow hover:text-kc-yellow transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-kc-yellow"
                aria-label="Previous project"
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
              <button
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === total - 1}
                className="w-10 h-10 border border-kc-white/30 flex items-center justify-center text-kc-white hover:border-kc-yellow hover:text-kc-yellow transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-kc-yellow"
                aria-label="Next project"
              >
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* ── Horizontal scroll viewport ── */}
      {/*
        Desktop (md+): GSAP pins the section and translates the track.
        Mobile: no pinning — the track becomes a native horizontal
        scroll-snap carousel so it never overflows the page or gets stuck
        off-screen with no way to reach it.
        data-horizontal-section → the pinned outer container
        data-horizontal-track   → the element that gets translateX
        Each ProjectScene is data-scene="<id>"
      */}
      {/* Height contract is genuinely different per breakpoint, not just
          smaller numbers: desktop pins the whole scene inside one
          viewport height (clamp below), so every descendant can safely
          assume h-full. Mobile is a natural-height, vertically-stacked
          card (metadata column ABOVE media, not beside it — see
          project-scene.tsx's flex-col default) that needs to lay out at
          its own content height; forcing that stack into the same
          ~360-520px pinned-viewport box is what was clipping/crushing
          project content on mobile (metadata and media fighting for
          space that isn't there). h-auto md:h-[...] gives mobile its own
          natural height while leaving the desktop pinned contract
          untouched. */}
      <div
        className="relative overflow-visible h-auto md:h-[clamp(360px,48svh,520px)]"
        data-horizontal-section
        data-cursor="drag"
      >
        {/* Horizontal track — GSAP applies translateX on desktop.
            On mobile it's a native overflow-x-auto snap carousel instead.
            pl-6/md:pl-10 matches Container's own gutter so Project 01's
            metadata aligns with the section header above it instead of
            starting flush against the browser edge; pr matches on the
            trailing side so the last scene gets the same breathing room. */}
        <div
          ref={trackRef}
          className="flex items-stretch h-auto md:h-full w-max md:overflow-visible overflow-x-auto snap-x snap-mandatory md:snap-none scrollbar-none pl-6 md:pl-10 pr-6 md:pr-10"
          data-horizontal-track
        >
          {featuredProjects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => {
                sceneRefs.current[i] = el;
              }}
              className="h-auto md:h-full flex-shrink-0 w-[90vw] md:w-[88vw] lg:w-[82vw] flex items-center justify-center pr-4 md:pr-8 snap-center"
            >
              <ProjectScene
                project={project}
                index={i}
                total={total}
                variant="featured"
              />
            </div>
          ))}
        </div>

        {/* Edge gradient — shows next scene is coming */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 md:w-32 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to left, #05070B 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-8 md:w-12 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to right, #05070B 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Progress indicator ── */}
      {/* Orbital node ring sits alongside the linear bar as a secondary,
          decorative confirmation of the same state (RocketAir-inspired,
          kept intentionally small/subtle) — not a replacement for it. */}
      <Container className="pt-4 pb-6 md:pb-8 flex items-center gap-4">
        <ScrollProgress
          current={activeIndex + 1}
          total={total}
          className="max-w-sm flex-1"
        />
        <OrbitalIndicator current={activeIndex + 1} total={total} />
      </Container>
    </section>
  );
}
