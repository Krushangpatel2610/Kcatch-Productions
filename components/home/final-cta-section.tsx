// components/home/final-cta-section.tsx
// "LET'S MAKE THEM LOOK." final CTA section.
// Yellow/dark bold CTA with tape, checkerboard and character.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FINAL_CTA } from "@/content/site";
import { TapeStack } from "@/components/graphics/tape-stack";
import { Sticker } from "@/components/graphics/sticker";
import { Reveal } from "@/components/motion/reveal";
import { Checkerboard } from "@/components/graphics/checkerboard";
import { Container } from "@/components/layout/container";
import { MagneticButton } from "@/components/motion/magnetic-button";

export function FinalCTASection() {
  return (
    <section
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

          {/* Right: annotation words + sticker */}
          <div className="flex flex-col items-end gap-4 relative">
            <div
              className="font-display uppercase text-kc-white/20 text-right leading-none select-none"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              aria-hidden="true"
            >
              {FINAL_CTA.supportWords.map((word) => (
                <div key={word}>{word}</div>
              ))}
            </div>

            <Sticker
              src="/Images/PNGs/Loudspeaker.png"
              alt="KCATCH making noise graphic"
              width={160}
              height={160}
              rotation={5}
              className="absolute bottom-0 right-0 md:-bottom-8"
            />
          </div>
        </div>
      </Container>

      {/* Bottom tape stack — transition into the footer */}
      <TapeStack text="LET'S MAKE THEM LOOK" />
    </section>
  );
}
