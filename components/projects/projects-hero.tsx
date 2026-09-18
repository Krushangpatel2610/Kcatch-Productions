"use client";
// components/projects/projects-hero.tsx
// "ALL THE KCATCH." hero section for Projects page.
// References: Projects.png

import { Sticker } from "@/components/graphics/sticker";
import { TapeStack } from "@/components/graphics/tape-stack";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Reveal } from "@/components/motion/reveal";
import { MaskText } from "@/components/motion/mask-text";
import { Container } from "@/components/layout/container";
import Image from "next/image";

export function ProjectsHero() {
  return (
    <section
      className="relative overflow-hidden pt-28 pb-0"
      aria-label="Projects hero"
      data-section="projects-hero"
    >
      <div
        className="absolute inset-0"
        aria-hidden="true"
      >
        <Image
          src="/Images/BG Images/ProjectsPageBg.png"
          alt="Projects background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(5,7,11,0.9) 0%, rgba(5,7,11,0.5) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          {/* Left: headline */}
          <div>
            <MaskText
              as="h1"
              className="font-display text-kc-yellow uppercase leading-none"
              style={{ fontSize: "clamp(4rem, 11vw, 10rem)" }}
              lines={["ALL", "THE", "KCATCH."]}
              stagger={0.08}
            />

            <Reveal direction="up" delay={0.15}>
              <p className="font-body text-kc-muted text-sm md:text-base leading-relaxed mt-4 max-w-md uppercase tracking-wide">
                A COLLECTION OF IDEAS THAT MADE PEOPLE LOOK.
              </p>
            </Reveal>
          </div>

          {/* Right: decorative annotation block */}
          <div className="hidden lg:flex flex-col items-end gap-6">
            <div
              className="font-display uppercase text-kc-white/80 text-right leading-none"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
              aria-hidden="true"
            >
              <div>CAMPAIGNS</div>
              <div>CONTENT</div>
              <div>CULTURE</div>
              <div>STORIES</div>
            </div>

            {/* Yellow sticker/badge */}
            <div
              className="bg-kc-yellow text-kc-black font-display text-sm uppercase px-4 py-2 rotate-[-2deg]"
              aria-hidden="true"
            >
              SAME IDEAS<br />BIGGER IMPACT
            </div>

            <HandwrittenNote
              text="IDEAS BRANDS CULTURE PEOPLE"
              size="sm"
              color="white"
              rotation={-2}
            />

            <Sticker
              src="/Images/PNGs/Banana man Left.png"
              alt="KCATCH mascot graphic"
              width={100}
              height={100}
              rotation={8}
            />
          </div>
        </div>
      </Container>

      {/* Tape stack — same tape language as the Home hero */}
      <TapeStack text="KCATCH THE EYE" />
    </section>
  );
}
