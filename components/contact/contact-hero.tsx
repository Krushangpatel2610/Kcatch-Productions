// components/contact/contact-hero.tsx
// "LET'S MAKE THEM LOOK." contact hero.
// References: Contact.png

import { CONTACT_HERO } from "@/content/contact";
import { TapeStack } from "@/components/graphics/tape-stack";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Sticker } from "@/components/graphics/sticker";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";

export function ContactHero() {
  return (
    <section
      className="relative overflow-hidden bg-kc-black pt-28 pb-0"
      aria-label="Contact hero"
      data-section="contact-hero"
    >
      {/* Background image slot */}
      {/* TODO: replace with approved studio/lighting hero image */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, #05070B 0%, #0d1535 30%, #1a1f3a 70%, #05070B 100%)",
          }}
        />
      </div>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(5,7,11,0.92) 0%, rgba(5,7,11,0.6) 60%, rgba(5,7,11,0.3) 100%)",
        }}
        aria-hidden="true"
      />

      <Container className="pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
          {/* Left: headline */}
          <div>
            <Reveal direction="up">
              <p className="font-body text-xs uppercase tracking-widest text-kc-muted mb-4">
                {CONTACT_HERO.eyebrow}
              </p>
              <h1
                className="font-display text-kc-yellow uppercase leading-[0.85] tracking-tight"
                style={{ fontSize: "clamp(4rem, 10vw, 11rem)" }}
              >
                <span className="block">{CONTACT_HERO.headline1}</span>
                <span className="block">{CONTACT_HERO.headline2}</span>
                <span className="block">{CONTACT_HERO.headline3}</span>
                <span className="block">{CONTACT_HERO.headline4 ?? ""}</span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <div className="mt-6">
                <p className="font-body text-kc-muted text-sm uppercase tracking-wide">
                  {CONTACT_HERO.supportWords.join(" ")}
                </p>
                <p className="font-body text-kc-muted text-sm uppercase tracking-wide">
                  {CONTACT_HERO.supportTagline}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: annotations + sticker */}
          <div className="hidden lg:flex flex-col items-end gap-5 relative z-10">
            <HandwrittenNote
              text={CONTACT_HERO.annotation1}
              size="md"
              color="white"
              rotation={-4}
            />
            <div
              className="bg-kc-white text-kc-black font-display text-2xl uppercase px-8 py-4 transform rotate-[2deg] shadow-xl"
              aria-hidden="true"
            >
              {CONTACT_HERO.annotation2}
            </div>
            <div className="flex items-center gap-6 mr-4">
              <div
                className="border border-kc-yellow text-kc-yellow font-display text-xl tracking-widest uppercase px-6 py-2"
                aria-hidden="true"
              >
                KCATCH
              </div>
              <Sticker
                src="/Images/PNGs/Finger image tilt right.png"
                alt="KCATCH hand gesture sticker"
                width={100}
                height={100}
                rotation={-8}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Tape stack transition into the paper section below */}
      <TapeStack text="KCATCH THE EYE" />
    </section>
  );
}
