// components/home/family-section.tsx
// "OUR FAMILY" client logo grid.
// Paper section with client logo placeholders.

import Image from "next/image";
import { FAMILY_BRANDS, FAMILY_SECTION } from "@/content/site";
import { PaperSection } from "@/components/graphics/paper-section";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";

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

        {/* Logo grid — client names carry real editorial weight (display
            font, larger scale) rather than reading as tiny incidental
            text dwarfed by the headline above them. */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10 md:gap-x-12 md:gap-y-14"
          role="list"
          aria-label="KCATCH clients"
        >
          {FAMILY_BRANDS.map((brand, i) => (
            // Capped, not i * 0.05 uncapped: with 35 brands that was up to
            // 1.7s of extra delay before the LAST tile even started its
            // 0.7s reveal (~2.4s total) — the section's own grid/heading
            // structure was already visible immediately, but individual
            // tiles kept trickling in long after, reading as "still empty"
            // well after the section had actually loaded. The stagger
            // "wave" feel is preserved for the first ~10 tiles; it just
            // doesn't keep growing for all 35.
            <Reveal key={brand.id} direction="up" delay={Math.min(i * 0.03, 0.3)}>
              <div
                className="relative flex items-center justify-center h-16 md:h-20 border-b border-kc-black/10 pb-4 opacity-80 hover:opacity-100 transition-opacity duration-300"
                role="listitem"
                title={brand.name}
              >
                {brand.logo ? (
                  // Real logo asset — natural aspect ratio, never stretched/cropped.
                  <Image
                    src={brand.logo}
                    alt={brand.alt}
                    width={160}
                    height={64}
                    className="max-h-12 md:max-h-16 w-auto h-auto object-contain"
                  />
                ) : (
                  // No approved logo asset yet for this brand — same
                  // placeholder-name treatment the section already used
                  // before this brand list was expanded.
                  <div
                    className="font-display text-kc-black uppercase tracking-wide text-center leading-none"
                    style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)" }}
                    aria-label={brand.alt}
                  >
                    {brand.name}
                  </div>
                )}
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
