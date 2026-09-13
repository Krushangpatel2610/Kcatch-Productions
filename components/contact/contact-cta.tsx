// components/contact/contact-cta.tsx
// "CREATIVE PEOPLE ALWAYS FIND A WAY." closing section.
// With polaroid image slots and social links.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTACT_CTA } from "@/content/contact";
import { SocialLinks } from "./social-links";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Sticker } from "@/components/graphics/sticker";
import { Reveal } from "@/components/motion/reveal";
import { KcatchImage } from "@/components/ui/kcatch-image";
import { Container } from "@/components/layout/container";

// Polaroid slot component
function PolaroidSlot({
  src,
  note,
  rotation,
  label,
}: {
  src: string;
  note: string;
  rotation: number;
  label: string;
}) {
  return (
    <div
      className="relative bg-kc-white p-3 pb-10 shadow-2xl flex-shrink-0"
      style={{ transform: `rotate(${rotation}deg)`, width: 200, height: 240 }}
      aria-hidden="true"
    >
      <KcatchImage
        src={src}
        alt={label}
        className="w-full h-[170px]"
      />
      <HandwrittenNote
        text={note}
        size="sm"
        color="dark"
        rotation={-1}
        className="absolute bottom-3 left-3 right-3 text-center"
      />
    </div>
  );
}

export function ContactCTA() {
  return (
    <section
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
              src={CONTACT_CTA.polaroid1}
              note={CONTACT_CTA.polaroidNote1}
              rotation={-3}
              label="KCATCH studio"
            />
            <PolaroidSlot
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
