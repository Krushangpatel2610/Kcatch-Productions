import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Sticker } from "@/components/graphics/sticker";
import { Reveal } from "@/components/motion/reveal";
import { Checkerboard } from "@/components/graphics/checkerboard";
import { Container } from "@/components/layout/container";

export function ProjectsCTA() {
  return (
    <section
      className="relative bg-kc-yellow overflow-hidden"
      aria-label="Start a project CTA"
      data-section="projects-cta"
    >
      {/* Checkerboard top */}
      <Checkerboard height="sm" density="tight" colorA="var(--kc-yellow)" colorB="var(--kc-black)" />

      <Container className="py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
          <div>
            <Reveal direction="up">
              <h2
                className="font-display text-kc-black uppercase leading-none"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
              >
                <span className="block">GOT A PROJECT</span>
                <span className="block">WORTH KCATCHING?</span>
              </h2>
            </Reveal>
          </div>

          {/* Mascot overlaps the CTA button's corner (relative + negative
              margin, not just sitting beside it in a flex gap) so it
              reads as attached to the call-to-action rather than a
              decorative aside floating next to it. */}
          <div className="relative flex items-center">
            <Sticker
              src="/Images/PNGs/Banana man Right.png"
              alt="KCATCH character"
              width={150}
              height={150}
              rotation={-5}
              className="relative z-10 -mr-6 md:-mr-10"
            />
            <Reveal direction="up" delay={0.15}>
              <Link
                href="/contact"
                className="relative inline-flex items-center gap-3 bg-kc-black text-kc-white font-body text-sm uppercase tracking-widest px-8 py-4 hover:bg-transparent hover:text-kc-black hover:border-kc-black border border-kc-black transition-all duration-300 focus-visible:outline-kc-black group"
              >
                LET&apos;S TALK
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
