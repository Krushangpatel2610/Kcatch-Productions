// app/page.tsx
// KCATCH Home Page
// Route: /

import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedWorkSection } from "@/components/home/featured-work-section";
import { CapabilitiesSection } from "@/components/home/capabilities-section";
import { AboutSection } from "@/components/home/about-section";
import { OrbitSection } from "@/components/home/orbit-section";
import { FamilySection } from "@/components/home/family-section";
// FinalCTASection ("Ready When You Are" / "LET'S MAKE THEM LOOK.") is
// intentionally NOT rendered on the Home page right now — kept available
// for later use. The component/file itself is untouched; only its Home
// page usage below is commented out.
// import { FinalCTASection } from "@/components/home/final-cta-section";

export const metadata: Metadata = {
  title: "KCATCH Media | KCATCH THE DAMN EYE",
  description:
    "KCATCH Media — We make content, campaigns and cultural moments that make people pause, look twice, and remember.",
};

export default function HomePage() {
  return (
    <SiteShell>
      {/*
        Section order (per current instructions):
        1. Hero (kcatch-media design/behavior)
        2. Orbit (kcatch-media)
        3. Featured Work / Work Done (Project A — own pinned ScrollTrigger,
           self-contained, independent of what precedes it)
        4. What We Do / Capabilities (Project A)
        5. Visibility Isn't Luck / About (Project A)
        6. Our Family (Project A)
        7. Everything else (unchanged, kept below — not yet migrated/decided)

        The previous Hero+FeaturedWork sticky/overlap wrapper is intentionally
        removed here: it relied on Hero and FeaturedWork being immediately
        adjacent (Hero pinned via an outer sticky div while FeaturedWork slid
        over it). Orbit now sits between them, and HeroSection itself pins
        internally (h-[260vh] + its own sticky inner wrapper) per B's design,
        so the outer wrapper is no longer applicable — FeaturedWorkSection
        still pins itself via its own ScrollTrigger regardless of what's
        above it, so its sliding behavior is unaffected.
      */}
      <HeroSection />
      <OrbitSection />
      <FeaturedWorkSection />
      <CapabilitiesSection />
      <AboutSection />
      <FamilySection />
      {/* <FinalCTASection /> — removed from Home page rendering only; see import comment above */}
    </SiteShell>
  );
}
