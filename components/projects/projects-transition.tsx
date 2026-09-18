"use client";
// components/projects/projects-transition.tsx
// "Our Story" — three full-bleed editorial chapters between the project
// archive and the closing yellow CTA on the Projects page: 01 Why We
// Exist (navy), 02 What We Do (cream), 03 What We Believe (navy). Each
// chapter is its OWN full-width section, not a shared boxed container —
// a designed campaign-page feel, not a SaaS landing-page block.
//
// NOTE: this was built from a highly detailed written spec; no
// reference image actually came through in the request. I've followed
// the text spec as literally and completely as possible, but I can't
// claim pixel-exact fidelity to an image I never received.
//
// Reuses existing infrastructure only: MaskText (staggered headline
// reveal), Reveal (fade-up), Checkerboard, HandwrittenNote, Container,
// MagneticButton, next/image, lucide icons. No new dependencies. The
// eye (Chapter 01), mascot (Chapter 02), and architectural (Chapter 03)
// images are exact existing assets supplied for this component — not
// recreated, not substituted, not duplicated. The mascot PNG already
// has its own "GOOD IDEAS DESERVE EYES." text baked in, so that copy is
// NOT also rendered as separate HTML (would duplicate it).
//
// Animation is strictly one-shot "reveal once in view" (IntersectionObserver
// via MaskText/Reveal) — no ScrollTrigger pin, no wheel/touch interception,
// no preventDefault(). Native scrolling is unaffected even if JS fails,
// since Reveal/MaskText both render their final content in reduced-motion
// or no-JS fallback paths.

import Link from "next/link";
import Image from "next/image";
import { Lightbulb, MessageSquare, Sparkles, ArrowRight, ArrowDown } from "lucide-react";
import { Checkerboard } from "@/components/graphics/checkerboard";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { MaskText } from "@/components/motion/mask-text";
import { MagneticButton } from "@/components/motion/magnetic-button";

const EYE_IMAGE_SRC = "/Images/BG Images/413b984d-c43c-4d21-b67d-d2a1d3fb4dab.png";
const MASCOT_IMAGE_SRC = "/Images/BG Images/84a017e2-3b7e-4f12-b283-809fb88afd38.png";
const BELIEVE_BG_SRC = "/Images/BG Images/ae5d81cd-1d5e-4df2-81cb-9a1fa408d11c.png";

const WHAT_WE_DO = [
  { title: "STRATEGY", description: "Ideas backed by thinking.", icon: Lightbulb },
  { title: "CONTENT", description: "Stories built to connect.", icon: MessageSquare },
  { title: "CULTURE", description: "Work that moves beyond the feed.", icon: Sparkles },
];

function ChapterLabel({
  number,
  label,
  tone = "yellow",
}: {
  number: string;
  label: string;
  tone?: "yellow" | "blue";
}) {
  return (
    <div className="flex items-center gap-4">
      <p
        className={`font-body text-xs font-bold uppercase tracking-[0.3em] ${
          tone === "yellow" ? "text-kc-yellow" : "text-kc-blue"
        }`}
      >
        {number} — {label}
      </p>
      <div
        className={`h-px flex-1 max-w-[80px] ${tone === "yellow" ? "bg-kc-yellow/40" : "bg-kc-blue/30"}`}
        aria-hidden="true"
      />
    </div>
  );
}

export function ProjectsTransition() {
  return (
    <div aria-label="Our Story">
      {/* ================= CHAPTER 01 — WHY WE EXIST ================= */}
      <section
        className="relative bg-kc-black overflow-hidden py-24 md:min-h-screen lg:min-h-[105vh] md:flex md:items-center md:py-28"
        aria-label="Why we exist"
        data-section="story-01"
      >
        <Checkerboard height="xs" density="tight" className="absolute left-0 top-0" />

        {/* Upper-right handwritten annotation — positioned well below
            the fixed nav's max height (lg:h-[96px]) so it never collides
            with it. */}
        <Reveal
          direction="up"
          delay={0.3}
          className="hidden lg:block absolute top-32 right-10 z-10"
        >
          <HandwrittenNote
            text={"SAME IDEAS.\nBIGGER IMPACT."}
            size="sm"
            color="white"
            rotation={3}
          />
        </Reveal>

        <Container className="relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-8 items-center">
            {/* Left: typography */}
            <div className="relative z-10">
              <Reveal direction="up" className="mb-8">
                <ChapterLabel number="01" label="WHY WE EXIST" />
              </Reveal>
              <MaskText
                as="h2"
                className="kc-display text-kc-yellow"
                style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)" }}
                lines={["ATTENTION", "IS CURRENCY."]}
                stagger={0.1}
              />
              <Reveal direction="up" delay={0.2} className="mt-8">
                <p className="font-body text-kc-paper/80 text-base md:text-lg leading-relaxed max-w-md">
                  Kcatch Media is an attention-driven creative agency
                  creating brands, campaigns and cultural moments that make
                  people pause, look twice and remember.
                </p>
              </Reveal>

              <Reveal direction="up" delay={0.3} className="mt-14">
                <p className="font-display text-kc-paper uppercase text-sm tracking-widest">
                  IDEAS THAT STICK.
                </p>
                <div className="h-[3px] w-16 bg-kc-yellow mt-2" aria-hidden="true" />
              </Reveal>
            </div>

            {/* Right: eye artwork — allowed to overlap slightly into the
                left column on large screens for the "controlled overlap"
                the reference calls for, via a negative margin rather
                than absolute positioning (keeps it responsive-safe). */}
            <Reveal direction="up" delay={0.15} className="relative flex justify-center lg:justify-end lg:-ml-10">
              <div
                className="relative w-full max-w-[340px] lg:max-w-[420px]"
                style={{
                  aspectRatio: "1371 / 1147",
                  transform: "rotate(-2deg)",
                }}
              >
                <Image
                  src={EYE_IMAGE_SRC}
                  alt="Close-up eye — attention is currency"
                  fill
                  sizes="(min-width: 1024px) 420px, 340px"
                  className="object-contain"
                />
              </div>

              {/* Near the right of the eye */}
              <div className="hidden lg:block absolute bottom-0 -right-4 max-w-[140px] text-right">
                <p className="font-hand text-kc-white text-lg leading-tight">
                  NOT JUST
                  <br />
                  SEEN.
                  <br />
                  <span className="text-kc-yellow">REMEMBERED.</span>
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ================= CHAPTER 02 — WHAT WE DO ================= */}
      <section
        className="relative bg-kc-paper overflow-hidden py-24 md:min-h-screen lg:min-h-[105vh] md:flex md:items-center md:py-28"
        aria-label="What we do"
        data-section="story-02"
      >
        <Container className="relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-8 items-center">
            <div>
              <Reveal direction="up" className="mb-8">
                <ChapterLabel number="02" label="WHAT WE DO" tone="blue" />
              </Reveal>
              <MaskText
                as="h2"
                className="kc-display text-kc-black"
                style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)" }}
                lines={["WE MAKE", "PEOPLE LOOK."]}
                stagger={0.1}
              />
              <div className="h-[3px] w-20 bg-kc-yellow mt-6" aria-hidden="true" />
              {/* No separate "GOOD IDEAS DESERVE EYES." text here — the
                  mascot artwork on the right already has that exact
                  line (with its own yellow underline) baked into the
                  PNG, so rendering it again in HTML would duplicate it. */}
            </div>

            {/* Mascot — the exact supplied artwork (character + its own
                baked-in "GOOD IDEAS DESERVE EYES." text). object-contain
                only, never cover, so nothing is cropped/stretched;
                transparency preserved since this is a plain <img>-style
                render with no background fill behind it. Sized by width
                with an intrinsic aspect-ratio (1095:1437, portrait) so
                it stays prominent without dominating the section. */}
            <Reveal direction="up" delay={0.15} className="flex justify-center lg:justify-end lg:-mr-4">
              <div
                className="relative w-full max-w-[300px] lg:max-w-[360px]"
                style={{ aspectRatio: "1095 / 1437" }}
              >
                <Image
                  src={MASCOT_IMAGE_SRC}
                  alt="KCATCH mascot — good ideas deserve eyes"
                  fill
                  sizes="(min-width: 1024px) 360px, 300px"
                  className="object-contain"
                />
              </div>
            </Reveal>
          </div>

          {/* Editorial info blocks — not cards: no borders/shadows around
              each block, just a yellow icon mark, heading, description,
              and a vertical divider between them on desktop. */}
          <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-0">
            {WHAT_WE_DO.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal
                  key={item.title}
                  direction="up"
                  delay={i * 0.1}
                  className={
                    i > 0
                      ? "sm:border-l sm:border-kc-black/15 sm:pl-8 md:pl-10"
                      : undefined
                  }
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-kc-yellow mb-4">
                    <Icon size={18} className="text-kc-black" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-kc-black uppercase text-xl md:text-2xl mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-kc-black/60 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </Reveal>
              );
            })}
          </div>

          <Reveal direction="up" delay={0.3}>
            <p className="mt-16 md:mt-20 font-body text-kc-black/50 text-xs uppercase tracking-[0.25em]">
              MORE THAN CONTENT. A CULTURE OF ATTENTION.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ================= CHAPTER 03 — WHAT WE BELIEVE ================= */}
      <section
        className="relative bg-kc-black overflow-hidden py-24 md:min-h-screen lg:min-h-[105vh] md:flex md:items-center md:py-28"
        aria-label="What we believe"
        data-section="story-03"
      >
        <Container className="relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-14 lg:gap-10 items-center">
            {/* Left: pure navy negative space carrying the typography —
                the architectural image stays confined to the right
                column, never spanning behind this text. */}
            <div>
              {/* Bespoke large-outlined "03" — deliberately NOT the
                  shared ChapterLabel (used as-is, unmodified, by
                  Chapters 01/02) since this chapter specifically calls
                  for a large outlined numeral rather than small caps
                  text. */}
              <Reveal direction="up" className="mb-6 flex items-center gap-4">
                <span className="text-stroke-yellow font-display text-5xl md:text-6xl leading-none">
                  03
                </span>
                <span className="font-body text-xs font-bold uppercase tracking-[0.3em] text-kc-yellow">
                  WHAT WE BELIEVE
                </span>
                <div className="h-px flex-1 max-w-[80px] bg-kc-yellow/40" aria-hidden="true" />
              </Reveal>
              <MaskText
                as="h2"
                className="kc-display"
                style={{ fontSize: "clamp(3rem, 7.5vw, 7rem)" }}
                lines={[
                  { text: "VISIBILITY ISN'T LUCK.", className: "text-kc-paper" },
                  { text: "IT'S DESIGN.", className: "text-kc-yellow" },
                ]}
                stagger={0.1}
              />
              <Reveal direction="up" delay={0.2} className="mt-6">
                <p className="font-body text-kc-muted text-base md:text-lg leading-relaxed max-w-md">
                  We create ideas that move people, brands and culture.
                </p>
              </Reveal>

              <Reveal direction="up" delay={0.3} className="mt-8">
                <MagneticButton>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-3 border border-kc-yellow text-kc-yellow font-body text-sm uppercase tracking-widest px-7 py-3.5 hover:bg-kc-yellow hover:text-kc-black transition-all duration-300 focus-visible:outline-kc-yellow"
                  >
                    LET&apos;S KCATCH
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </MagneticButton>
              </Reveal>
            </div>

            {/* Right visual — "chapter-three-visual": the architectural
                image confined to its own bounded frame (never the
                section background), with every decoration attached to
                THIS wrapper, not the outer section. */}
            <Reveal direction="up" delay={0.15} className="relative">
              <div className="relative w-full aspect-[4/3] lg:aspect-[16/13] overflow-hidden border border-kc-white/15">
                <Image
                  src={BELIEVE_BG_SRC}
                  alt="Dark architectural scene at night"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-[70%_center]"
                />

                {/* Handwritten note over the image */}
                <div className="absolute bottom-4 left-4">
                  <HandwrittenNote
                    text={"IDEAS\nMOVE\nPEOPLE."}
                    size="sm"
                    color="white"
                    rotation={-2}
                  />
                </div>

                {/* Checkerboard — lower/right area of the image itself,
                    not the whole section. */}
                <Checkerboard
                  height="xs"
                  density="tight"
                  className="absolute bottom-0 right-0 w-20 opacity-70"
                />
              </div>

              {/* Yellow taped label, near the upper-RIGHT of the image
                  — a real tape strip carrying the text, not a plain
                  caption below the frame. */}
              <div
                className="absolute -top-3 right-6 bg-kc-yellow px-3 py-1.5 shadow-md max-w-[220px]"
                style={{ transform: "rotate(2deg)" }}
              >
                <p className="font-body text-kc-black text-[10px] font-bold uppercase tracking-widest leading-tight">
                  KCATCH MEDIA
                  <br />— BUILT TO MAKE YOU SEEN.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Bottom editorial footer treatment — thin horizontal line
              spans the full section width; left = wordmark, right =
              the IDEAS/BRANDS/CULTURE/IMPACT stack + the existing
              circular scroll indicator (kept, not replaced). */}
          <div className="mt-16 md:mt-20 border-t border-kc-line pt-8 flex items-center justify-between gap-6">
            <p className="font-display text-kc-white uppercase text-sm tracking-widest">
              KCATCH MEDIA
            </p>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end gap-0.5 font-body text-[10px] uppercase tracking-[0.25em] text-kc-paper/50">
                <span>IDEAS</span>
                <span>BRANDS</span>
                <span>CULTURE</span>
                <span>IMPACT</span>
              </div>
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-kc-paper/30 text-kc-paper/50">
                <ArrowDown size={14} aria-hidden="true" />
              </span>
            </div>
          </div>
        </Container>

      </section>
    </div>
  );
}
