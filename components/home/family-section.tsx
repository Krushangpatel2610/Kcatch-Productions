// components/home/family-section.tsx
// "OUR FAMILY" client logo grid.
// Paper section with client logo placeholders.

import { CLIENTS, FAMILY_SECTION } from "@/content/site";
import { PaperSection } from "@/components/graphics/paper-section";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";

export function FamilySection() {
  return (
    <PaperSection
      aria-label="Our Family — Client Logos"
      data-section="family"
    >
      <Container className="pt-16 md:pt-24 pb-20 md:pb-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 md:mb-20">
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

        {/* Logo grid — client names carry real editorial weight (display
            font, larger scale) rather than reading as tiny incidental
            text dwarfed by the headline above them. */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10 md:gap-x-12 md:gap-y-14"
          role="list"
          aria-label="KCATCH clients"
        >
          {CLIENTS.map((client, i) => (
            <Reveal key={client.id} direction="up" delay={i * 0.05}>
              <div
                className="relative flex items-center justify-center h-16 md:h-20 border-b border-kc-black/10 pb-4 opacity-80 hover:opacity-100 transition-opacity duration-300"
                role="listitem"
                title={client.name}
              >
                {/* TODO: replace with approved client logo — {client.name} */}
                <div
                  className="font-display text-kc-black uppercase tracking-wide text-center leading-none"
                  style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)" }}
                  aria-label={client.alt}
                >
                  {client.name}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* "and many more..." */}
        <p className="font-body text-kc-black/40 text-xs uppercase tracking-widest mt-12 text-center">
          AND MANY MORE...
        </p>
      </Container>
    </PaperSection>
  );
}
