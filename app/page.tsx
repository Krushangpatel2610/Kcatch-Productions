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
      */}
      <HeroSection />
      <FeaturedWorkSection />
      <CapabilitiesSection />
      <AboutSection />
      <FamilySection />
      <FinalCTASection />
    </SiteShell>
  );
}
