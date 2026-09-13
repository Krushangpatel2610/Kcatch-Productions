// app/page.tsx
// KCATCH Home Page
// Route: /

import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedWorkSection } from "@/components/home/featured-work-section";
import { CapabilitiesSection } from "@/components/home/capabilities-section";
import { AboutSection } from "@/components/home/about-section";
import { FamilySection } from "@/components/home/family-section";
import { FinalCTASection } from "@/components/home/final-cta-section";

export const metadata: Metadata = {
  title: "KCATCH Media | KCATCH THE DAMN EYE",
  description:
    "KCATCH Media — We make content, campaigns and cultural moments that make people pause, look twice, and remember.",
};

export default function HomePage() {
  return (
    <SiteShell>
      {/*
        Section order per PRD.md:
        1. Hero
        2. Featured Work (IMMEDIATELY after hero)
        3. Capabilities / What We KCATCH
        4. About / Visibility
        5. Our Family
        6. Final CTA

        Hero → Featured Work uses a sticky/overlap technique so Featured
        Work visually slides up and over the Hero instead of the two
        sections simply stacking — the Hero stays pinned in place (native
        CSS sticky, no extra ScrollTrigger) while Featured Work's own
        (already-pinned) section scrolls up to cover it. z-index keeps
        Featured Work above the Hero once it arrives.
      */}
      <div className="relative">
        <div className="sticky top-0 z-0">
          <HeroSection />
        </div>
        <div className="relative z-10">
          <FeaturedWorkSection />
        </div>
      </div>
      <CapabilitiesSection />
      <AboutSection />
      <FamilySection />
      <FinalCTASection />
    </SiteShell>
  );
}
