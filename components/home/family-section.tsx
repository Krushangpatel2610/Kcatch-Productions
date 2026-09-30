// components/home/family-section.tsx
// "OUR FAMILY" client logo grid.
// Paper section with client logo placeholders.

import { FAMILY_SECTION } from "@/content/site";
import { LOGOS } from "@/content/logos";
import { PaperSection } from "@/components/graphics/paper-section";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";
import { DriftWall, type DriftWallItem } from "@/components/graphics/drift-wall";

const familyLogoItems: DriftWallItem[] = LOGOS.map((logo) => ({
  image: logo.src,
  title: logo.alt,
}));

export function FamilySection() {
  return (
    <PaperSection
      aria-label="Our Family — Client Logos"
      data-section="family"
      parallax
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

        {/* Logo wall — drifting multi-column display of every client logo
            in public/Logos (see content/logos.ts). Replaces the previous
            text-name grid entirely; no brand names are rendered here. */}
        <Reveal direction="up">
          <DriftWall
            items={familyLogoItems}
            columns={5}
            tileWidth={200}
            tileHeight={132}
            gap={18}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={42}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={48}
            fade={0.6}
            dim={0.9}
            aria-label="KCATCH clients"
          />
        </Reveal>
      </Container>
    </PaperSection>
  );
}
