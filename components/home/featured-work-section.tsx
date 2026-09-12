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

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { featuredProjects } from "@/content/projects";
import { FEATURED_WORK } from "@/content/site";
import { ProjectScene } from "./project-scene";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Container } from "@/components/layout/container";

export function FeaturedWorkSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = featuredProjects.length;
  
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current) return;
    
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const track = trackRef.current;
    const getScrollAmount = () => track.scrollWidth - window.innerWidth;
    
    const tween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none"
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "center center",
      end: () => `+=${getScrollAmount()}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = Math.round(self.progress * (total - 1));
        setActiveIndex(index);
      }
    });

  }, { scope: sectionRef });

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
    const st = ScrollTrigger.getAll().find((t) => t.trigger === sectionRef.current);
    if (!st) return;
    const progress = clamped / (total - 1);
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
      {/* ── Section header ── */}
      <Container className="pt-16 md:pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: label + headline */}
          <div className="lg:col-span-1">
            <p className="font-body text-xs uppercase tracking-widest text-kc-muted mb-3">
              {FEATURED_WORK.sectionLabel}
            </p>
            <h2
              className="font-display text-kc-white uppercase leading-none"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
            >
              <span className="block">{FEATURED_WORK.headline1}</span>
              <span className="block text-kc-yellow">{FEATURED_WORK.headline2}</span>
            </h2>
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
      <div
        className="relative overflow-visible"
        data-horizontal-section
        style={{ height: "70vh" }}
      >
        {/* Horizontal track — GSAP applies translateX on desktop.
            On mobile it's a native overflow-x-auto snap carousel instead. */}
        <div
          ref={trackRef}
          className="flex h-full w-max md:overflow-visible overflow-x-auto snap-x snap-mandatory md:snap-none scrollbar-none"
          data-horizontal-track
        >
          {featuredProjects.map((project, i) => (
            <div
              key={project.id}
              className={cn(
                "h-full flex-shrink-0 snap-center transition-opacity duration-500 w-[90vw] md:w-[88vw] lg:w-[82vw] flex items-center justify-center pr-4 md:pr-8",
                i === activeIndex ? "opacity-100" : "opacity-30 md:opacity-40"
              )}
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
      <Container className="py-6">
        <ScrollProgress
          current={activeIndex + 1}
          total={total}
          className="max-w-sm"
        />
      </Container>
    </section>
  );
}
