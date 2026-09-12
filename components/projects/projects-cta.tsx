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
      <Checkerboard height="sm" density="tight" colorA="#fff000" colorB="#000000" />

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

          <div className="flex items-center gap-6">
            {/* TODO: sticker slot — KCATCH character */}
            <Sticker
              alt="KCATCH character"
              placeholder="STICKER"
              width={100}
              height={100}
              rotation={-5}
            />
            <Reveal direction="up" delay={0.15}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-kc-black text-kc-white font-body text-sm uppercase tracking-widest px-8 py-4 hover:bg-transparent hover:text-kc-black hover:border-kc-black border border-kc-black transition-all duration-300 focus-visible:outline-kc-black group"
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
