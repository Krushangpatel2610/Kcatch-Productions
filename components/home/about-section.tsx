"use client";
// components/home/about-section.tsx
// "VISIBILITY ISN'T LUCK. IT'S DESIGN." cinematic dark section.
// A brief cinematic interruption between the two paper sections — layered
// parallax gives it depth: background moves slow, headline stays still,
// the handwritten annotation drifts a little faster than the background.

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ABOUT_SECTION } from "@/content/site";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.to(bgRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(handRef.current, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-kc-black"
      aria-label="About KCATCH"
      data-section="about"
    >
      {/* Background image slot */}
      {/* TODO: replace with approved KCATCH "GOOD IDEAS MAKE NOISE" background image */}
      <div ref={bgRef} className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, #0d1535 0%, #1a1a2e 50%, #05070B 100%)",
          }}
        />
        {/* Simulated billboard/wall texture */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-10"
          aria-hidden="true"
        >
          <div className="font-display text-kc-white text-center leading-none select-none"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}>
            GOOD<br />IDEAS<br />MAKE<br />NOISE
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(5,7,11,0.95) 0%, rgba(5,7,11,0.7) 50%, rgba(5,7,11,0.4) 100%)",
        }}
        aria-hidden="true"
      />

      <Container className="py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: headline + body + CTA */}
          <div>
            <Reveal direction="up">
              <h2
                className="font-display text-kc-yellow uppercase leading-none"
                style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
              >
                <span className="block">{ABOUT_SECTION.headline1}</span>
                <span className="block">{ABOUT_SECTION.headline2}</span>
                <span className="block">{ABOUT_SECTION.headline3}</span>
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="font-body text-kc-muted text-sm md:text-base leading-relaxed mt-6 max-w-md">
                {ABOUT_SECTION.body}
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.25}>
              <Link
                href={ABOUT_SECTION.cta.href}
                className="inline-flex items-center gap-2 mt-8 border border-kc-white text-kc-white font-body text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-kc-white hover:text-kc-black transition-all duration-300 focus-visible:outline-kc-yellow group"
              >
                {ABOUT_SECTION.cta.label}
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          {/* Right: annotation */}
          <div ref={handRef} className="flex justify-end items-end">
            <HandwrittenNote
              text={ABOUT_SECTION.annotation}
              size="lg"
              color="white"
              rotation={-3}
              className="text-right"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
