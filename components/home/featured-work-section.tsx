"use client";
// components/home/featured-work-section.tsx
// Home Featured Work horizontal scroll section.
//
// Architecture:
//   One GSAP ScrollTrigger pins a track and translates it horizontally
//   as the user scrolls/swipes vertically, at every viewport width.
//   >=1024px: pins the WHOLE section (intro header + image carousel +
//     progress footer) as one frozen unit — unchanged original behavior.
//   <1024px: pins ONLY the image carousel + progress footer (pinTargetRef
//     below) — the intro header sits above it in normal scroll flow, so
//     it scrolls past first, and the pin engages once the carousel
//     itself reaches the viewport top ("intro -> scroll -> image
//     animation frame"). See project-scene.tsx for the matching
//     image-dominant/metadata-overlay layout on this range.
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
  // <1024px only: wraps just the image-carousel viewport (+ progress
  // footer), NOT the intro header above it. Used as the pin trigger on
  // mobile/tablet so the intro scrolls past normally first, and only the
  // image-carousel itself pins — see the trigger selection in useGSAP
  // below. Unused (and inert) at >=1024px, where sectionRef (the whole
  // section, intro included) stays the trigger exactly as before.
  const pinTargetRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current || !pinTargetRef.current) return;

    // Reused unchanged for every viewport width — see the height/layout
    // split in the JSX below (and project-scene.tsx's FeaturedScene) for
    // the only viewport-specific adjustments: this pin+scrub mechanism
    // itself is identical everywhere. ScrollTrigger reads native scroll
    // position directly (no Lenis dependency — see smooth-scroll-provider,
    // which already skips Lenis on touch devices), so vertical touch-swipe
    // drives this exactly the same way vertical wheel-scroll does on
    // desktop: no extra touch listener, no preventDefault, nothing added.
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
    const getScrollAmount = () => {
      if (!track) return 0;
      return track.scrollWidth - document.documentElement.clientWidth;
    };
    // We will cache layout measurements during onRefresh to avoid thrashing.
    let cachedMetrics = {
      viewportWidth: 0,
      maxScroll: 0,
      scenes: [] as { left: number; width: number }[],
    };

    const applySceneState = (progress: number) => {
      const { viewportWidth, maxScroll, scenes } = cachedMetrics;
      if (!viewportWidth || scenes.length === 0) return;

      const trackX = -maxScroll * progress;
      const viewportCenter = viewportWidth / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      sceneRefs.current.forEach((scene, i) => {
        if (!scene || !scenes[i]) return;

        const metrics = scenes[i];
        const sceneCenterInViewport = metrics.left + trackX + metrics.width / 2;
        const distanceFromCenter = Math.abs(sceneCenterInViewport - viewportCenter);
        
        // Track the closest scene for activeIndex
        if (distanceFromCenter < minDistance) {
          minDistance = distanceFromCenter;
          closestIndex = i;
        }

        // Distance from this project's center, normalized so 0 = fully active, 1 = one full window away.
        // We use metrics.width as the "window" size since the scenes are adjacent.
        const normalizedDistance = distanceFromCenter / metrics.width;
        const settleAmount = 1 - Math.max(0, Math.min(1, normalizedDistance));

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

        const sceneOpacity = 0.28 + settleAmount * 0.72;
        gsap.set(scene, { opacity: sceneOpacity });

        const imageWrap = scene.querySelector("[data-fw-image-wrap]");
        if (imageWrap) {
          gsap.set(imageWrap, {
            scale: 0.94 + settleAmount * 0.06,
            x: (1 - settleAmount) * (sceneCenterInViewport < viewportCenter ? -24 : 24),
          });
        }

        if (mask) mask.style.clipPath = buildMaskClipPath(settleAmount);

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

      // Update React state safely (if it changed)
      setActiveIndex((prev) => (prev !== closestIndex ? closestIndex : prev));
    };

    const updateMetrics = () => {
      cachedMetrics.viewportWidth = document.documentElement.clientWidth;
      cachedMetrics.maxScroll = getScrollAmount();
      cachedMetrics.scenes = sceneRefs.current.map((scene) => {
        if (!scene) return { left: 0, width: 0 };
        return { left: scene.offsetLeft, width: scene.offsetWidth };
      });
    };

    // Prime the first frame before any scroll happens so Project 01
    // renders already-settled, not mid-entrance.
    // Cache initial metrics and prime the first frame
    updateMetrics();
    applySceneState(0);

    // The pin (and the pin-spacer GSAP inserts to reserve the horizontal
    // scroll distance) must be created HERE, synchronously on mount — not
    // deferred until after the preloader. A previous version deferred this
    // via onPreloaderDone + a 500ms timeout (~2-3s after page load). If a
    // user scrolled during that window, Featured Work still existed at its
    // short natural (unpinned) height; the instant the deferred pin fired,
    // GSAP inserted a multi-thousand-px spacer at its position, shifting
    // every section below it down without adjusting the user's current
    // scroll position — landing them inside the newly-created, visually
    // empty spacer (page background showing through) until they scrolled
    // far enough to reach the real pinned content again. That was the
    // "Featured Work disappears into a blank dark area" bug. Creating the
    // pin immediately reserves the correct height from first paint, before
    // any scroll can happen, so there's nothing to shift into later.
    //
    // 1. The Tween: horizontally translates the track.
    // Using function-based values and invalidateOnRefresh ensures
    // GSAP recalculates the exact distance whenever ScrollTrigger refreshes.
    const tween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none",
    });

    // 2. The ScrollTrigger: pins the section and scrubs the tween.
    // Pin trigger differs by breakpoint (checked once here, not a second
    // scroll system — still exactly one ScrollTrigger.create() call):
    // >=1024px pins the WHOLE section (sectionRef, intro included) so it
    // scrolls in as one frozen unit with the image carousel, exactly as
    // before this change. <1024px pins ONLY pinTargetRef (the image
    // carousel + progress footer, not the intro header) so the intro
    // scrolls past normally first and the pin engages once the carousel
    // itself reaches the top — matching the intended
    // "intro -> scroll -> image animation frame" mobile sequence.
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const pinTrigger = isDesktop ? sectionRef.current : pinTargetRef.current;
    ScrollTrigger.create({
      trigger: pinTrigger,
      start: "top top",
      end: () => `+=${getScrollAmount()}`,
      pin: true,
      animation: tween,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        updateMetrics();
        applySceneState(self.progress);
      },
      onUpdate: (self) => {
        applySceneState(self.progress);
      },
    });

    // GSAP automatically handles window resize refreshes on its own.
  }, { scope: sectionRef });

  // Once the preloader has fully left (and any preloader-gated entrance
  // animations elsewhere have run), fonts/images may have shifted layout —
  // RE-MEASURE the already-created pin in place via refresh(), never
  // re-create it. refresh() recalculates start/end without touching the
  // user's current scroll position, so it can't reproduce the blank-area
  // bug a re-created pin would.
  useEffect(() => {
    return onPreloaderDone(() => {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      return () => clearTimeout(timer);
    });
  }, []);

  // ROOT CAUSE of "scroll glitches whenever project data changes": the
  // pin above is created exactly once on mount (useGSAP has no
  // dependency array, so it never re-runs when featuredProjects changes).
  // Its scroll range is captured via function-based values that are only
  // RE-EVALUATED when something calls ScrollTrigger.refresh() — and
  // nothing was tied to the track's own content actually changing.
  // scene width is fixed (vw-based, not content-driven), so the ONLY
  // thing that changes track.scrollWidth is the number of scenes —
  // meaning this one measurement is exactly the DOM-derived signal that
  // captures "project data changed" without ever hardcoding a count.
  //
  // A previous attempt at a ResizeObserver here caused an infinite
  // refresh loop (see git history) — that happened because it called
  // refresh() unconditionally on every callback firing, and refresh()
  // itself can transiently reflow enough to re-trigger the observer.
  // This version is safe because it (a) compares against the last known
  // width and bails out on no-op/sub-pixel changes, and (b) debounces
  // the actual refresh call, so a burst of resize notifications
  // collapses into a single refresh instead of a cascade.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;

    let lastWidth = track.scrollWidth;
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    const observer = new ResizeObserver(() => {
      const newWidth = track.scrollWidth;
      if (Math.abs(newWidth - lastWidth) < 2) return;
      lastWidth = newWidth;

      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    });

    observer.observe(track);
    return () => {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, []);

  // The pinned ScrollTrigger now owns scroll position at every viewport
  // width (the track is transform-driven, never natively scrollable), so
  // activeIndex tracking lives entirely in applySceneState's onUpdate —
  // no separate scroll listener needed.
  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i));
    setActiveIndex(clamped);

    // The pinned ScrollTrigger owns scroll position, so move the window
    // scroll to the point in the pin range that matches this index. Same
    // window-center formula as applySceneState/onUpdate above
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

      {/* ── Image-carousel + progress footer — the pin target ── */}
      {/* >=1024px: this wrapper is purely structural — sectionRef (the
          whole section, intro included) is still the actual pin trigger,
          so nothing here changes desktop's behavior.
          <1024px: THIS wrapper (pinTargetRef) is the pin trigger, not
          sectionRef — the intro Container above scrolls normally, and
          only once this wrapper's own top reaches the viewport top does
          the pin engage, matching "intro -> scroll -> image animation
          frame." */}
      <div ref={pinTargetRef} className="relative">
        {/* ── Horizontal scroll viewport ── */}
        {/*
          data-horizontal-section → the pinned outer container
          data-horizontal-track   → the element that gets translateX
          Each ProjectScene is data-scene="<id>"
        */}
        {/* Height contract differs by breakpoint. <1024px: the scene is
            now an image-dominant frame (metadata overlays the image
            rather than stacking above it — see project-scene.tsx), so
            this scales with the actual viewport (88svh) rather than a
            conservative fixed range, so the pinned frame (this + the
            progress footer below) fills most of the real screen instead
            of leaving the section's own background exposed as dead
            space beneath the project composition — purely a visual
            frame height, unrelated to the horizontal scroll DISTANCE
            (still driven entirely by track.scrollWidth in useGSAP above).
            >=1024px (unchanged): desktop's side-by-side clamp. */}
        <div
          className="relative overflow-visible h-[clamp(600px,88svh,820px)] lg:h-[clamp(360px,48svh,520px)]"
          data-horizontal-section
          data-cursor="drag"
        >
          {/* Horizontal track — GSAP applies translateX at every viewport
              width now (see the pin+scrub ScrollTrigger above); the track
              is never natively scrollable, so overflow/snap stay fixed
              regardless of breakpoint. pl-6/md:pl-10 matches Container's
              own gutter so Project 01's metadata aligns with the section
              header above it instead of starting flush against the browser
              edge; pr matches on the trailing side so the last scene gets
              the same breathing room. */}
          <div
            ref={trackRef}
            className="flex items-stretch h-full w-max overflow-visible snap-none scrollbar-none pl-6 md:pl-10 pr-6 md:pr-10"
            data-horizontal-track
          >
            {featuredProjects.map((project, i) => (
              <div
                key={project.id}
                ref={(el) => {
                  sceneRefs.current[i] = el;
                }}
                className="h-full flex-shrink-0 w-[90vw] md:w-[88vw] lg:w-[82vw] flex items-center justify-center pr-4 md:pr-8"
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
      </div>
    </section>
  );
}
