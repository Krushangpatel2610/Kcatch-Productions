// app/contact/page.tsx
// KCATCH Contact Page
// Route: /contact

import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { OfficeList } from "@/components/contact/office-list";
import { ContactCTA } from "@/components/contact/contact-cta";
import { CONTACT_FORM } from "@/content/contact";
import { PaperSection } from "@/components/graphics/paper-section";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { Sticker } from "@/components/graphics/sticker";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "KCATCH Media | Let's Make Them Look",
  description:
    "Start a project with KCATCH Media. Brand strategy, campaigns, content production and cultural influence.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      {/* 1. Hero */}
      <ContactHero />

      {/* 2. Form + offices (paper section) */}
      <PaperSection
        aria-label="Contact form and office details"
        data-section="contact-body"
        parallax
      >
        <Container className="py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* Left: form — the office column naturally runs taller (two
                full office cards), so the space below the form's own
                content carries real KCATCH material (handwritten note +
                mascot) instead of sitting empty; this is the same
                decorative language every other section on the site
                already uses to fill its own negative space. */}
            <div className="flex flex-col h-full">
              <Reveal direction="up">
                <h2 className="font-display text-kc-black uppercase text-3xl md:text-5xl mb-8">
                  {CONTACT_FORM.heading}
                </h2>
              </Reveal>
              <ContactForm />

              <div className="hidden lg:flex flex-1 items-end justify-between gap-6 mt-16 pt-8 border-t border-kc-black/10">
                <HandwrittenNote
                  text={"good ideas\ndon't wait."}
                  size="lg"
                  color="dark"
                  rotation={-2}
                />
                <Sticker
                  src="/Images/PNGs/Finger image tilt right.png"
                  alt="KCATCH hand gesture sticker"
                  width={90}
                  height={90}
                  rotation={-6}
                />
              </div>
            </div>

            {/* Right: offices — a distinct visual composition, not a form column */}
            <div>
              <OfficeList />
            </div>
          </div>
        </Container>
      </PaperSection>

      {/* 3. Closing CTA */}
      <ContactCTA />
    </SiteShell>
  );
}
