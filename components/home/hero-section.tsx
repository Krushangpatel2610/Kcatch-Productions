"use client";
// components/home/hero-section.tsx
// KCATCH Hero — cinematic full-viewport entrance.
//
// ALL elements are pre-hidden via inline `style` on JSX — invisible from
// the server's first byte of HTML. GSAP's only job is to REVEAL.
//
// Entrance timeline (triggered once by preloader gate):
//   t=0.0  BG image: opacity 0→1, scale 1.08→1 (2s, power2.out)
//   t=0.3  "KCATCH"   slides up from clip  (0.8s, power4.out)
//   t=0.45 "THE"      slides up from clip  (0.8s, power4.out)
//   t=0.6  "DAMN EYE" slides up from clip  (0.8s, power4.out)
//   t=0.9  Handwritten note: fade + rise   (0.6s)
//   t=1.05 Sub text: fade + rise           (0.55s)
//   t=1.2  CTA button: fade + rise         (0.5s)
//   t=0.5  Right col item 1: fade + rise   (0.65s, stagger 0.14s each)
//   t=1.5  Scroll indicator fades in       (0.5s)
//
// Parallax deferred 1400ms so it never touches the entrance frame budget.

import Link from "next/link";
import { Play } from "lucide-react";
import { HOME_HERO } from "@/content/site";
import { TapeStack } from "@/components/graphics/tape-stack";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Container } from "@/components/layout/container";
import { HeroVideoBackground } from "./hero-video-background";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Sticker } from "@/components/graphics/sticker";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { onPreloaderDone } from "@/lib/motion/preloader-gate";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const rightColRef  = useRef<HTMLDivElement>(null);
  const stickerRef   = useRef<HTMLDivElement>(null);
  const bgRef        = useRef<HTMLDivElement>(null);
  // Inner spans — what actually slides up (GSAP target)
  const line0Ref = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const handRef  = useRef<HTMLDivElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const right0Ref = useRef<HTMLDivElement>(null);
  const right1Ref = useRef<HTMLDivElement>(null);
  const right2Ref = useRef<HTMLDivElement>(null);

  const playEntranceRef   = useRef<(() => void) | null>(null);
  const createParallaxRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      // Reduced motion: instantly clear all pre-hidden states.
      if (reduced) {
        gsap.set(
          [
            bgRef.current, line0Ref.current, line1Ref.current, line2Ref.current,
            handRef.current, subRef.current, ctaRef.current, scrollRef.current,
            right0Ref.current, right1Ref.current, right2Ref.current,
          ],
          { clearProps: "all" }
        );
        return;
      }

      // ── Entrance factory ──────────────────────────────────────────────
      // Each step is positioned with an absolute time (seconds) so the
      // whole sequence reads as one directed cut, not stacked delays.
      playEntranceRef.current = () => {
        const tl = gsap.timeline();

        // 1. Background: fade in + scale settle
        tl.to(bgRef.current, {
          opacity: 1,
          scale: 1,
          duration: 2.0,
          ease: "power2.out",
          force3D: true,
        }, 0);

        // 2. Headline line 1: "KCATCH"
        tl.to(line0Ref.current, {
          y: "0%",
          duration: 0.85,
          ease: "power4.out",
          force3D: true,
        }, 0.3);

        // 3. Headline line 2: "THE"
        tl.to(line1Ref.current, {
          y: "0%",
          duration: 0.85,
          ease: "power4.out",
          force3D: true,
        }, 0.47);

        // 4. Headline line 3: "DAMN EYE"
        tl.to(line2Ref.current, {
          y: "0%",
          duration: 0.85,
          ease: "power4.out",
          force3D: true,
        }, 0.62);

        // 5. Handwritten note
        tl.to(handRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        }, 0.95);

        // 6. Sub text
        tl.to(subRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        }, 1.12);

        // 7. CTA
        tl.to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        }, 1.27);

        // 8. Right column — staggered over the headline window
        tl.to(right0Ref.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        }, 0.55);
        tl.to(right1Ref.current, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
        }, 0.72);
        tl.to(right2Ref.current, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
        }, 0.88);

        // 9. Scroll indicator — last, after everything settled
        tl.to(scrollRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        }, 1.5);
      };

      // ── Parallax ─────────────────────────────────────────────────────
      createParallaxRef.current = () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        })
          .to(rightColRef.current,  { yPercent: -6,  ease: "none" }, 0)
          .to(stickerRef.current,   { yPercent: -14, ease: "none" }, 0);
      };
    },
    { scope: containerRef }
  );

  useEffect(() => {
    return onPreloaderDone(() => {
      playEntranceRef.current?.();
      setTimeout(() => {
        createParallaxRef.current?.();
      }, 1400);
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full flex flex-col bg-kc-black selection:bg-kc-yellow selection:text-kc-black overflow-hidden"
      aria-label="KCATCH hero"
      data-section="hero"
    >
      {/* ── 1. Background image ──
          Pre-hidden (opacity:0, scale:1.08). Solid kc-black shows while
          preloader is up. GSAP fades + settles it as the first entrance beat. */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 bg-kc-black"
        aria-hidden="true"
        style={{ opacity: 0, transform: "scale(1.08)", willChange: "transform, opacity" }}
      >
        <HeroVideoBackground sectionRef={containerRef} />
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── 2. Dark overlay ── */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-kc-black/75 via-kc-black/40 to-kc-black/10 pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Main content grid ── */}
      <Container className="relative flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-y-16 lg:gap-x-12 items-center w-full pt-28 pb-16 lg:pt-32 lg:pb-20">

        {/* ── Left column ── */}
        <div className="relative z-10 flex flex-col items-start">

          {/* Headline — each line: outer span = clip window, inner span = GSAP target */}
          <h1
            className="font-display uppercase text-kc-yellow leading-[0.87] tracking-tight m-0 p-0"
            style={{ fontSize: "clamp(3.25rem, 7.5vw, 7.5rem)" }}
          >
            <span className="block overflow-hidden">
              <span
                ref={line0Ref}
                className="block"
                style={{ transform: "translateY(110%)", willChange: "transform" }}
              >
                {HOME_HERO.headlineLine1}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                ref={line1Ref}
                className="block"
                style={{ transform: "translateY(110%)", willChange: "transform" }}
              >
                {HOME_HERO.headlineLine2}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                ref={line2Ref}
                className="block"
                style={{ transform: "translateY(110%)", willChange: "transform" }}
              >
                {HOME_HERO.headlineLine3}
              </span>
            </span>
          </h1>

          {/* Handwritten note — pre-hidden */}
          <div
            ref={handRef}
            className="mt-4 pl-1"
            style={{ opacity: 0, transform: "translateY(14px)" }}
          >
            <HandwrittenNote text={"OH, I MADE YOU LOOK"} size="md" color="white" rotation={-4} />
          </div>

          {/* Sub text — pre-hidden */}
          <p
            ref={subRef}
            className="font-body text-kc-white/80 text-sm md:text-base leading-relaxed mt-8 max-w-[400px]"
            style={{ opacity: 0, transform: "translateY(14px)" }}
          >
            {HOME_HERO.subtext}
          </p>

          {/* CTA — pre-hidden */}
          <div
            ref={ctaRef}
            className="flex items-center gap-6 mt-8"
            style={{ opacity: 0, transform: "translateY(14px)" }}
          >
            <MagneticButton>
              <Link
                href={HOME_HERO.primaryCta.href}
                data-cursor="play"
                className="inline-flex items-center justify-center gap-3 bg-kc-yellow text-kc-black font-body text-sm font-bold uppercase tracking-widest px-8 py-3 hover:bg-kc-white hover:text-kc-black border border-transparent transition-all duration-300 focus-visible:outline-kc-white rounded-none"
              >
                <Play size={14} aria-hidden="true" className="flex-shrink-0" />
                {HOME_HERO.primaryCta.label}
              </Link>
            </MagneticButton>
          </div>

          {/* Scroll indicator — pre-hidden */}
          <div
            ref={scrollRef}
            className="hidden lg:flex items-center gap-3 mt-14"
            aria-hidden="true"
            style={{ opacity: 0 }}
          >
            <div className="relative w-5 h-8 rounded-full border border-kc-white/30 flex items-start justify-center pt-1.5">
              <div className="w-1 h-1.5 bg-kc-white/60 rounded-full animate-bounce" />
            </div>
            <span className="font-body text-[9px] uppercase tracking-[0.3em] text-kc-white/60">
              {HOME_HERO.scrollCue}
            </span>
          </div>
        </div>

        {/* ── Right column ── all items pre-hidden */}
        <div
          ref={rightColRef}
          className="relative z-10 flex flex-col items-start lg:items-end gap-8 lg:pl-6"
        >
          {/* IDEAS BRANDS CULTURE PEOPLE */}
          <div
            ref={right0Ref}
            className="text-left lg:text-right lg:rotate-[2deg]"
            style={{ opacity: 0, transform: "translateY(18px)" }}
          >
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
            ref={right1Ref}
            className="border border-kc-yellow px-5 py-2 text-kc-yellow font-display text-lg tracking-widest"
            aria-hidden="true"
            style={{ opacity: 0, transform: "translateY(18px)" }}
          >
            KCATCH
          </div>

          {/* Handwritten note + sticker */}
          <div
            ref={right2Ref}
            className="relative flex items-end gap-6 lg:flex-row-reverse mt-4 lg:mt-8"
            style={{ opacity: 0, transform: "translateY(18px)" }}
          >
            <div ref={stickerRef}>
              <Sticker
                src="/Images/PNGs/Finger image tilt right.png"
                alt="KCATCH illustrated character"
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

      {/* ── Tape stack ──
          Taller container so the tape strips are clearly visible at the
          bottom of the hero viewport, inviting the user to scroll. */}
      <div className="relative z-20 w-full mt-auto">
        <TapeStack text={HOME_HERO.tapeText} />
      </div>
    </section>
  );
}
