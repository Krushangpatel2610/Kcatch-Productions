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
      >
        <Container className="py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* Left: form */}
            <div>
              <Reveal direction="up">
                <h2 className="font-display text-kc-black uppercase text-3xl md:text-5xl mb-8">
                  {CONTACT_FORM.heading}
                </h2>
              </Reveal>
              <ContactForm />
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
