// components/home/family-section.tsx
// "OUR FAMILY" client logo grid.
// Paper section with client logo placeholders.

import { CLIENTS, FAMILY_SECTION } from "@/content/site";
import { TornSection } from "@/components/graphics/torn-section";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Reveal } from "@/components/motion/reveal";
import { Checkerboard } from "@/components/graphics/checkerboard";
import { Container } from "@/components/layout/container";

export function FamilySection() {
  return (
    <>
      {/* Top torn edge: dark → paper */}
      <TornSection variant="dark-to-paper" position="top" />

      <section
        className="bg-kc-paper"
        aria-label="Our Family — Client Logos"
        data-section="family"
      >
        <Container className="pt-16 md:pt-20 pb-12 md:pb-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <Reveal direction="up">
              <h2
                className="font-display text-kc-black uppercase leading-none"
                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
              >
                {FAMILY_SECTION.headline}
              </h2>
            </Reveal>
            <HandwrittenNote
              text={FAMILY_SECTION.annotation}
              size="sm"
              color="dark"
              rotation={2}
              className="md:text-right"
            />
          </div>

          {/* Logo grid */}
          <div
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 items-center"
            role="list"
            aria-label="KCATCH clients"
          >
            {CLIENTS.map((client, i) => (
              <Reveal key={client.id} direction="up" delay={i * 0.05}>
                <div
                  className="relative flex items-center justify-center h-12 md:h-14 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                  role="listitem"
                  title={client.name}
                >
                  {/* TODO: replace with approved client logo — {client.name} */}
                  <div
                    className="font-display text-kc-black/60 text-sm md:text-base uppercase tracking-widest"
                    aria-label={client.alt}
                  >
                    {client.name}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* "and many more..." */}
          <p className="font-body text-kc-black/40 text-xs uppercase tracking-widest mt-8 text-center">
            AND MANY MORE...
          </p>
        </Container>
      </section>

      {/* Checkerboard + bottom torn edge: paper → dark */}
      <div className="bg-kc-paper">
        <Checkerboard height="sm" density="tight" colorA="#ffffff" colorB="#000000" />
      </div>
      <TornSection variant="paper-to-dark" position="bottom" />
    </>
  );
}
