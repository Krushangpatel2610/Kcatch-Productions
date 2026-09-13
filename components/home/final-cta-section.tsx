"use client";
// components/home/final-cta-section.tsx
// "LET'S MAKE THEM LOOK." final CTA section.
// Yellow/dark bold CTA with tape, checkerboard and character.

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FINAL_CTA } from "@/content/site";
import { TapeStack } from "@/components/graphics/tape-stack";
import { Sticker } from "@/components/graphics/sticker";
import { Reveal } from "@/components/motion/reveal";
import { Checkerboard } from "@/components/graphics/checkerboard";
import { Container } from "@/components/layout/container";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const speakerRef = useRef<HTMLDivElement>(null);

  // Words and megaphone drift at different rates so the sticker reads as
  // crossing through the typography rather than sitting in its own
  // fixed spot beside it — one shared ScrollTrigger, not two.
  useGSAP(
    () => {
      if (prefersReducedMotion() || !wordsRef.current || !speakerRef.current) return;
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      })
        .to(wordsRef.current, { yPercent: -8, ease: "none" }, 0)
        .to(speakerRef.current, { yPercent: 14, rotate: 5, ease: "none" }, 0);
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-kc-black overflow-hidden"
      aria-label="Final Call to Action"
      data-section="final-cta"
    >
      {/* Top checkerboard accent */}
      <Checkerboard height="sm" density="tight" colorA="#ffffff" colorB="#000000" />

      <Container className="relative py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: headline */}
          <div>
            <Reveal direction="up">
              <h2
                className="font-display text-kc-yellow uppercase leading-none"
                style={{ fontSize: "clamp(2.35rem, 10vw, 9rem)" }}
              >
                <span className="block">{FINAL_CTA.headline1}</span>
                <span className="block">{FINAL_CTA.headline2}</span>
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <MagneticButton>
                <Link
                  href={FINAL_CTA.cta.href}
                  className="inline-flex items-center gap-3 bg-kc-yellow text-kc-black font-body text-sm uppercase tracking-widest px-8 py-4 mt-10 hover:bg-transparent hover:text-kc-yellow hover:border-kc-yellow border border-kc-yellow transition-all duration-300 focus-visible:outline-kc-yellow group"
                >
                  {FINAL_CTA.cta.label}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </MagneticButton>
            </Reveal>
          </div>

          {/* Right: annotation words + sticker. The megaphone sits in the
              gap it's given (its own row inside the word stack, between
              CULTURE and PEOPLE — same technique as a comic-panel
              caption break) rather than absolutely positioned against
              the whole block's bottom edge, which previously landed it
              squarely on top of the last word instead of beside it. */}
          <div className="relative flex flex-col items-end">
            <div
              className="font-display uppercase text-kc-white/20 text-right leading-none select-none"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              aria-hidden="true"
            >
              <div ref={wordsRef}>
                {FINAL_CTA.supportWords.slice(0, -1).map((word) => (
                  <div key={word}>{word}</div>
                ))}
              </div>

              {/* Sticker's own reserved row — pushes the last word down
                  rather than floating over it, and gives the sticker a
                  real slot to sit in beside the text instead of on it. */}
              <div className="flex items-center justify-end gap-4 my-1">
                <div ref={speakerRef}>
                  <Sticker
                    src="/Images/PNGs/Loudspeaker.png"
                    alt="KCATCH making noise graphic"
                    width={110}
                    height={110}
                    rotation={5}
                  />
                </div>
              </div>

              <div>{FINAL_CTA.supportWords[FINAL_CTA.supportWords.length - 1]}</div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom tape stack — transition into the footer */}
      <TapeStack text="LET'S MAKE THEM LOOK" />
    </section>
  );
}
