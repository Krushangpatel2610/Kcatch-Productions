"use client";
// components/home/hero-section.tsx
// KCATCH Hero — static, normal-flow hero section. Background is a static
// image (kcatch-media's own hero-poster.png, copied into
// public/Images/BG Images/HeroBg.png) — no video, no video playback
// logic, no scroll-pinning. Nothing in this section is scroll-driven.

import Image from "next/image";
import { HOME_HERO } from "@/content/site";
import { Container } from "@/components/layout/container";
import { TapeStack } from "@/components/graphics/tape-stack";

const HERO_BG_SRC = "/Images/BG Images/HeroBg.png";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-kc-black"
      aria-label="KCATCH cinematic hero"
      data-section="hero"
    >
      {/* Background media layer — static image, no video */}
      <div className="absolute inset-0">
        <Image
          src={HERO_BG_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Cinematic darkening */}
      <div className="absolute inset-0 bg-gradient-to-b from-kc-black/70 via-kc-black/30 to-kc-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(5,11,32,0.7)_100%)]" />

      {/* Caution tape top strip */}
      <div
        className="caution-tape absolute top-0 left-0 h-2 w-full opacity-90"
        aria-hidden="true"
      />

      {/* Headline */}
      <Container className="relative z-10 flex min-h-screen flex-col justify-center py-24">
        <div className="max-w-3xl">
          <p className="mb-6 flex items-center gap-3 font-body text-xs font-bold uppercase tracking-[0.3em] text-kc-yellow">
            <span className="inline-block h-2 w-2 bg-kc-yellow" />
            {HOME_HERO.eyebrow}
          </p>
          <h1 className="kc-display text-kc-paper text-[15vw] md:text-[11vw]">
            <span className="block">{HOME_HERO.headlineLine1}</span>
            <span className="block">
              {HOME_HERO.headlineLine2}{" "}
              <span className="text-kc-yellow">{HOME_HERO.headlineLine3}</span>
            </span>
          </h1>

          <p className="mt-8 max-w-md text-balance font-body text-base text-kc-paper/80 md:text-lg">
            {HOME_HERO.subtext}
          </p>
        </div>
      </Container>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center"
        aria-hidden="true"
      >
        <div className="mx-auto mb-2 flex h-10 w-6 items-start justify-center rounded-full border border-kc-paper/40 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-kc-yellow" />
        </div>
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-kc-paper/50">
          {HOME_HERO.scrollCue}
        </span>
      </div>

      {/* Catchline bottom-right */}
      <div className="absolute bottom-6 right-5 z-10 hidden text-right md:right-10 md:block">
        <p className="font-display text-sm font-black uppercase tracking-widest text-kc-paper/70">
          {HOME_HERO.tapeText}
        </p>
      </div>

      {/* Bottom tape transition */}
      <div className="absolute bottom-0 left-0 z-30 w-full">
        <TapeStack text={HOME_HERO.tapeText} animateIn={false} />
      </div>
    </section>
  );
}
