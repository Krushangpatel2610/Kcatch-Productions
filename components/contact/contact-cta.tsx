"use client";
// components/contact/contact-cta.tsx
// "CREATIVE PEOPLE ALWAYS FIND A WAY." closing section.
// With polaroid image slots and social links.

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CONTACT_CTA } from "@/content/contact";
import { SocialLinks } from "./social-links";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Sticker } from "@/components/graphics/sticker";
import { Reveal } from "@/components/motion/reveal";
import { KcatchImage } from "@/components/ui/kcatch-image";
import { Container } from "@/components/layout/container";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Polaroid slot — a real physical photograph, not a generic image card:
// paper stock, hard shadow, a torn strip of tape pinning it down, and a
// placeholder that reads as "a KCATCH photo waiting to be dropped in"
// rather than an empty database thumbnail.
function PolaroidSlot({
  src,
  note,
  rotation,
  label,
  parallaxRef,
}: {
  src: string;
  note: string;
  rotation: number;
  label: string;
  parallaxRef: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={parallaxRef} className="relative flex-shrink-0" style={{ transform: `rotate(${rotation}deg)` }}>
      <div
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-5 bg-kc-yellow/90 shadow-md z-10"
        style={{ transform: `rotate(${rotation < 0 ? 4 : -4}deg)` }}
        aria-hidden="true"
      />
      <div
        className="relative bg-kc-white p-3 pb-10 shadow-2xl"
        style={{ width: 200, height: 240 }}
        aria-hidden="true"
      >
        <KcatchImage
          src={src}
          alt={label}
          className="w-full h-[170px]"
          placeholderLabel="KC"
        />
        <HandwrittenNote
          text={note}
          size="sm"
          color="dark"
          rotation={-1}
          className="absolute bottom-3 left-3 right-3 text-center"
        />
      </div>
    </div>
  );
}

export function ContactCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const polaroid1Ref = useRef<HTMLDivElement>(null);
  const polaroid2Ref = useRef<HTMLDivElement>(null);

  // The two polaroids travel at different rates on scroll — real
  // photographs stacked on a desk don't move as one rigid unit, so
  // giving them slightly different speeds (not just different static
  // rotation) is what actually reads as physical depth rather than a
  // single decorative image group.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      })
        .to(polaroid1Ref.current, { yPercent: -8, ease: "none" }, 0)
        .to(polaroid2Ref.current, { yPercent: 10, ease: "none" }, 0);
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-kc-black overflow-hidden"
      aria-label="Contact closing CTA"
      data-section="contact-cta"
    >
      <Container className="py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: headline + CTA */}
          <div>
            <Reveal direction="up">
              <h2
                className="font-display text-kc-yellow uppercase leading-none"
                style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
              >
                <span className="block">{CONTACT_CTA.headline1}</span>
                <span className="block">{CONTACT_CTA.headline2}</span>
                <span className="block">{CONTACT_CTA.headline3}</span>
                <span className="block">{CONTACT_CTA.headline4}</span>
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="font-body text-kc-muted text-sm leading-relaxed mt-6 max-w-sm">
                {CONTACT_CTA.body}
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              <Link
                href={CONTACT_CTA.cta.href}
                className="inline-flex items-center gap-3 border border-kc-white text-kc-white font-body text-xs uppercase tracking-widest px-6 py-3 mt-8 hover:bg-kc-white hover:text-kc-black transition-all duration-300 focus-visible:outline-kc-yellow group"
              >
                {CONTACT_CTA.cta.label}
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>

          {/* Right: polaroids + sticker — no extra top offset (that's
              what pushed this column visibly lower than the headline,
              reading as a disconnected block); items-center on the grid
              above now keeps both columns on the same vertical center. */}
          <div className="relative flex items-center justify-center md:justify-end gap-6">
            <PolaroidSlot
              parallaxRef={polaroid1Ref}
              src={CONTACT_CTA.polaroid1}
              note={CONTACT_CTA.polaroidNote1}
              rotation={-3}
              label="KCATCH studio"
            />
            <PolaroidSlot
              parallaxRef={polaroid2Ref}
              src={CONTACT_CTA.polaroid2}
              note={CONTACT_CTA.polaroidNote2}
              rotation={4}
              label="KCATCH team"
            />
            <Sticker
              src="/Images/PNGs/Banana man Left.png"
              alt="KCATCH character sticker"
              width={110}
              height={110}
              rotation={-8}
              className="absolute -bottom-6 -right-2 md:-right-8"
            />
          </div>
        </div>

        {/* Social links */}
        <div className="mt-14 flex flex-col gap-3">
          <p className="font-body text-kc-muted text-xs uppercase tracking-widest">
            FIND US ON
          </p>
          <SocialLinks size={22} />
        </div>
      </Container>
    </section>
  );
}
