"use client";
// components/home/hero-section.tsx
// KCATCH Hero — full viewport cinematic section.
// Asymmetric two-column composition: left = headline/copy/CTA,
// right = editorial annotation block (IDEAS/BRANDS/CULTURE/PEOPLE + sticker).
//
// Layers (bottom → top):
//   1. Background image slot (full bleed, parallax-ready)
//   2. Dark overlay
//   3. Main headline (yellow, display font — sized for composition, not viewport-fill)
//   4. Handwritten support copy
//   5. Sub text
//   6. Primary CTA
//   7. Scroll indicator
//   8. Right column: annotation, badge, handwritten note, sticker
//   9. Tape strip (bottom)

import Link from "next/link";
import { Play } from "lucide-react";
import { HOME_HERO } from "@/content/site";
import { KcatchTape } from "@/components/graphics/kcatch-tape";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Container } from "@/components/layout/container";
import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Sticker } from "@/components/graphics/sticker";
import { Checkerboard } from "@/components/graphics/checkerboard";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      // ── Entrance sequence: line-mask reveal, back to front ──
      const lines = gsap.utils.toArray<HTMLElement>("[data-reveal-line] > span");
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      if (!reduced) {
        tl.fromTo(
          lines,
          { yPercent: 110 },
          { yPercent: 0, duration: 1, stagger: 0.08 }
        )
          .fromTo(
            "[data-reveal-hand]",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.5"
          )
          .fromTo(
            "[data-reveal-sub]",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.35"
          )
          .fromTo(
            "[data-reveal-cta]",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.5 },
            "-=0.3"
          )
          .fromTo(
            "[data-reveal-scroll]",
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            "-=0.2"
          )
          .fromTo(
            "[data-reveal-right] > *",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
            "-=0.6"
          );

        // ── Restrained parallax: right column + sticker move at different rates ──
        gsap.to(rightColRef.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
        gsap.to(stickerRef.current, {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full flex flex-col bg-kc-black selection:bg-kc-yellow selection:text-kc-black overflow-hidden"
      aria-label="KCATCH hero"
      data-section="hero"
    >
      {/* ── 1. Background image slot ── */}
      {/* TODO: replace with approved KCATCH studio/hero video or image */}
      <div
        className="absolute inset-0 -z-10"
        data-parallax
        data-parallax-depth="-0.2"
        aria-hidden="true"
      >
        <div
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, #05070B 0%, #0d1535 30%, #1a1f3a 60%, #05070B 100%)",
          }}
        />
        {/* Subtle noise/grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── 2. Dark overlay ── */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-kc-black/90 via-kc-black/60 to-transparent"
        aria-hidden="true"
      />

      {/* ── Main content: asymmetric grid, left ~55% / right ~40% with a gap ── */}
      <Container className="relative flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-y-16 lg:gap-x-12 items-center w-full pt-28 pb-16 lg:pt-24 lg:pb-16">
        {/* Left column: primary content */}
        <div className="relative z-10 flex flex-col items-start">
          {/* ── 3. Headline — sized for composition, not viewport-fill ── */}
          <h1
            className="font-display uppercase text-kc-yellow leading-[0.87] tracking-tight m-0 p-0 relative"
            style={{ fontSize: "clamp(3.25rem, 7.5vw, 7.5rem)" }}
          >
            <span className="block overflow-hidden" data-reveal-line>
              <span className="block">{HOME_HERO.headlineLine1}</span>
            </span>
            <span className="block overflow-hidden" data-reveal-line>
              <span className="block">{HOME_HERO.headlineLine2}</span>
            </span>
            <span className="block relative overflow-hidden" data-reveal-line>
              <span className="block">{HOME_HERO.headlineLine3}</span>
            </span>
          </h1>

          {/* ── 4. Handwritten support — anchored just under the headline, not overlapping it ── */}
          <div data-reveal-hand className="mt-4 pl-1">
            <HandwrittenNote
              text={"OH, I MADE YOU LOOK"}
              size="md"
              color="white"
              rotation={-4}
            />
          </div>

          {/* ── 5. Sub text ── */}
          <p
            data-reveal-sub
            className="font-body text-kc-white/80 text-sm md:text-base leading-relaxed mt-8 max-w-[400px]"
          >
            {HOME_HERO.subtext}
          </p>

          {/* ── 6. Primary CTA ── */}
          <div data-reveal-cta className="flex items-center gap-6 mt-8">
            <Link
              href={HOME_HERO.primaryCta.href}
              className="inline-flex items-center justify-center gap-3 bg-kc-yellow text-kc-black font-body text-sm font-bold uppercase tracking-widest px-8 py-3 hover:bg-kc-white hover:text-kc-black border border-transparent transition-all duration-300 focus-visible:outline-kc-white rounded-none"
            >
              <Play size={14} aria-hidden="true" className="flex-shrink-0" />
              {HOME_HERO.primaryCta.label}
            </Link>
          </div>

          {/* ── 7. Scroll indicator ── */}
          <div
            data-reveal-scroll
            className="hidden lg:flex items-center gap-3 mt-14"
            aria-hidden="true"
          >
            <div className="relative w-5 h-8 rounded-full border border-kc-white/30 flex items-start justify-center pt-1.5">
              <div className="w-1 h-1.5 bg-kc-white/60 rounded-full animate-bounce" />
            </div>
            <span className="font-body text-[9px] uppercase tracking-[0.3em] text-kc-white/60">
              {HOME_HERO.scrollCue}
            </span>
          </div>
        </div>

        {/* Right column: editorial annotation block — lives fully in the right track */}
        <div
          ref={rightColRef}
          data-reveal-right
          className="relative z-10 flex flex-col items-start lg:items-end gap-8 lg:pl-6"
        >
          {/* Annotation block — "IDEAS BRANDS CULTURE PEOPLE" */}
          <div className="text-left lg:text-right transform lg:rotate-[2deg]">
            <div
              className="font-display uppercase text-kc-white/90 leading-[0.9]"
              style={{ fontSize: "clamp(1.75rem, 3vw, 3.25rem)" }}
              aria-hidden="true"
            >
              <div>IDEAS</div>
              <div>BRANDS</div>
              <div>CULTURE</div>
              <div>PEOPLE</div>
            </div>
          </div>

          {/* KCATCH badge */}
          <div
            className="border border-kc-yellow px-5 py-2 text-kc-yellow font-display text-lg tracking-widest"
            aria-hidden="true"
          >
            KCATCH
          </div>

          {/* Handwritten note + sticker group */}
          <div className="relative flex items-end gap-6 lg:flex-row-reverse mt-4 lg:mt-8">
            <div ref={stickerRef}>
              <Sticker
                alt="KCATCH illustrated character"
                placeholder="CHARACTER STICKER"
                width={110}
                height={110}
                rotation={4}
              />
            </div>
            <HandwrittenNote
              text={"MAKE\nGOOD\nTROUBLE."}
              rotation={-8}
              size="md"
              color="white"
              className="text-left lg:text-right"
            />
          </div>
        </div>
      </Container>

      {/* ── 8. Bottom tape strip ── */}
      <div className="relative z-20 w-full mt-auto" aria-hidden="true">
        {/* Checkerboard accent on tape right side */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-30">
          <Checkerboard height="md" density="tight" colorA="#fff000" colorB="#000000" className="w-16 md:w-24 lg:w-32" />
        </div>
        <KcatchTape
          text={HOME_HERO.tapeText}
          marquee
          variant="yellow"
          className="shadow-2xl"
        />
      </div>
    </section>
  );
}
