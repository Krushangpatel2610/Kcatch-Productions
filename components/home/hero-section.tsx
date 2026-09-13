"use client";
// components/home/hero-section.tsx
// KCATCH Hero — full viewport cinematic section.
//
// POST-PRELOADER ANIMATION (clean rebuild):
// ─────────────────────────────────────────
// Every animated element is pre-hidden via inline `style` on the JSX so it
// is invisible from the server's first byte of HTML — before React, before
// GSAP, before the browser's first paint. No race condition, no flash.
//
// Sequence after preloader signals done:
//   1. Background image fades in + scale settles (1.05 → 1) over 1.8s
//   2. Headline lines slide up from behind clip masks (stagger 0.1s)
//   3. Handwritten note fades + rises
//   4. Subtext fades + rises
//   5. CTA fades + rises
//   6. Scroll indicator fades in
//   7. Right column items cascade in (stagger 0.13s)
//
// Parallax ScrollTrigger deferred 1200ms so it never contends with the
// entrance frame budget.

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
  const rightColRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineInnerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const handRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rightItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playEntranceRef = useRef<(() => void) | null>(null);
  const createParallaxRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      // Reduced motion: reveal everything immediately since inline styles hid them.
      if (reduced) {
        gsap.set(
          [
            bgRef.current,
            ...lineInnerRefs.current.filter(Boolean),
            handRef.current,
            subRef.current,
            ctaRef.current,
            scrollRef.current,
            ...rightItemRefs.current.filter(Boolean),
          ],
          { clearProps: "all" }
        );
        return;
      }

      const lines = lineInnerRefs.current.filter(Boolean) as HTMLSpanElement[];
      const rightItems = rightItemRefs.current.filter(Boolean) as HTMLDivElement[];

      // Build the entrance timeline. Called only once by the preloader-gate effect.
      // Elements start in their inline-style hidden states; this only animates TO visible.
      playEntranceRef.current = () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1. Background: fade from black + scale settle. The bg div starts with
        //    opacity:0 and scale:1.05 via inline style. This gives a clean
        //    "image appearing" moment with no pop or glitch.
        tl.to(bgRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
        }, 0);

        // 2. Headline lines: slide up from behind the overflow-hidden clip
        tl.to(lines, {
          y: "0%",
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
        }, 0.3);

        // 3–6. Supporting elements fade + rise in cascade
        tl.to(handRef.current, { opacity: 1, y: 0, duration: 0.55 }, 0.85);
        tl.to(subRef.current,  { opacity: 1, y: 0, duration: 0.55 }, 1.0);
        tl.to(ctaRef.current,  { opacity: 1, y: 0, duration: 0.5  }, 1.15);
        tl.to(scrollRef.current, { opacity: 1, duration: 0.5 }, 1.3);

        // 7. Right column: staggered fade + rise
        tl.to(rightItems, { opacity: 1, y: 0, duration: 0.65, stagger: 0.13 }, 0.7);
      };

      // Parallax: deferred so it never contends with entrance frame budget.
      createParallaxRef.current = () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        })
          .to(rightColRef.current, { yPercent: -6, ease: "none" }, 0)
          .to(stickerRef.current, { yPercent: -14, ease: "none" }, 0);
      };
    },
    { scope: containerRef }
  );

  useEffect(() => {
    return onPreloaderDone(() => {
      playEntranceRef.current?.();
      setTimeout(() => {
        createParallaxRef.current?.();
      }, 1200);
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full flex flex-col bg-kc-black selection:bg-kc-yellow selection:text-kc-black overflow-hidden"
      aria-label="KCATCH hero"
      data-section="hero"
    >
      {/* ── 1. Background ──
          Pre-hidden: opacity:0, scale:1.05.
          The bg-kc-black on this div shows as solid black while the
          preloader is up. GSAP fades it in + settles scale after preloader. */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 bg-kc-black"
        aria-hidden="true"
        style={{ opacity: 0, transform: "scale(1.05)" }}
      >
        <HeroVideoBackground sectionRef={containerRef} />
        {/* Subtle noise/grain overlay */}
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
        className="absolute inset-0 z-[1] bg-gradient-to-r from-kc-black/70 via-kc-black/35 to-kc-black/10"
        aria-hidden="true"
      />

      {/* ── Main content ── */}
      <Container className="relative flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-y-16 lg:gap-x-12 items-center w-full pt-28 pb-16 lg:pt-32 lg:pb-16">

        {/* Left column */}
        <div className="relative z-10 flex flex-col items-start">

          {/* ── 3. Headline ──
              Outer span = overflow-hidden clip window (stays still).
              Inner span = what GSAP slides (pre-hidden at translateY 110%). */}
          <h1
            className="font-display uppercase text-kc-yellow leading-[0.87] tracking-tight m-0 p-0 relative"
            style={{ fontSize: "clamp(3.25rem, 7.5vw, 7.5rem)" }}
          >
            <span className="block overflow-hidden">
              <span
                className="block"
                ref={(el) => { lineInnerRefs.current[0] = el; }}
                style={{ transform: "translateY(110%)" }}
              >
                {HOME_HERO.headlineLine1}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="block"
                ref={(el) => { lineInnerRefs.current[1] = el; }}
                style={{ transform: "translateY(110%)" }}
              >
                {HOME_HERO.headlineLine2}
              </span>
            </span>
            <span className="block relative overflow-hidden">
              <span
                className="block"
                ref={(el) => { lineInnerRefs.current[2] = el; }}
                style={{ transform: "translateY(110%)" }}
              >
                {HOME_HERO.headlineLine3}
              </span>
            </span>
          </h1>

          {/* ── 4. Handwritten note ── pre-hidden */}
          <div
            ref={handRef}
            className="mt-4 pl-1"
            style={{ opacity: 0, transform: "translateY(12px)" }}
          >
            <HandwrittenNote
              text={"OH, I MADE YOU LOOK"}
              size="md"
              color="white"
              rotation={-4}
            />
          </div>

          {/* ── 5. Sub text ── pre-hidden */}
          <p
            ref={subRef}
            className="font-body text-kc-white/80 text-sm md:text-base leading-relaxed mt-8 max-w-[400px]"
            style={{ opacity: 0, transform: "translateY(12px)" }}
          >
            {HOME_HERO.subtext}
          </p>

          {/* ── 6. CTA ── pre-hidden */}
          <div
            ref={ctaRef}
            className="flex items-center gap-6 mt-8"
            style={{ opacity: 0, transform: "translateY(12px)" }}
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

          {/* ── 7. Scroll indicator ── pre-hidden */}
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

        {/* Right column — all items pre-hidden */}
        <div
          ref={rightColRef}
          className="relative z-10 flex flex-col items-start lg:items-end gap-8 lg:pl-6"
        >
          {/* IDEAS BRANDS CULTURE PEOPLE */}
          <div
            ref={(el) => { rightItemRefs.current[0] = el; }}
            className="text-left lg:text-right transform lg:rotate-[2deg]"
            style={{ opacity: 0, transform: "translateY(16px)" }}
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
            ref={(el) => { rightItemRefs.current[1] = el; }}
            className="border border-kc-yellow px-5 py-2 text-kc-yellow font-display text-lg tracking-widest"
            aria-hidden="true"
            style={{ opacity: 0, transform: "translateY(16px)" }}
          >
            KCATCH
          </div>

          {/* Handwritten note + sticker */}
          <div
            ref={(el) => { rightItemRefs.current[2] = el; }}
            className="relative flex items-end gap-6 lg:flex-row-reverse mt-4 lg:mt-8"
            style={{ opacity: 0, transform: "translateY(16px)" }}
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

      {/* ── Tape stack ── */}
      <div className="relative z-20 w-full mt-auto">
        <TapeStack text={HOME_HERO.tapeText} />
      </div>
    </section>
  );
}
