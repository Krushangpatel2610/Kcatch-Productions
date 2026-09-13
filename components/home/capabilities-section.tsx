"use client";
// components/home/capabilities-section.tsx
// "WHAT WE KCATCH" section.
// Paper/torn section with editorial capabilities grid.

import { useRef } from "react";
import Link from "next/link";
import { Lightbulb, Video, BarChart3, Users } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { CAPABILITIES, CAPABILITIES_SECTION } from "@/content/site";
import { PaperSection } from "@/components/graphics/paper-section";
import { Sticker } from "@/components/graphics/sticker";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const ICON_MAP = {
  Lightbulb,
  Video,
  BarChart3,
  Users,
};

export function CapabilitiesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

  // The mascot is the section's visual anchor, not an incidental sticker
  // sitting in a grid cell: it enters from slightly below/scaled down and
  // settles into place, then keeps a small continuous parallax drift as
  // the user scrolls past — its own dedicated node/timeline so it never
  // competes with the headline's Reveal or the paper edge's own scroll
  // animation for the same transform.
  useGSAP(
    () => {
      if (prefersReducedMotion() || !mascotRef.current) return;

      gsap.fromTo(
        mascotRef.current,
        { yPercent: 18, scale: 0.92, opacity: 0 },
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: mascotRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.to(mascotRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <PaperSection
      aria-label="What We KCATCH"
      data-section="capabilities"
      parallax
    >
      <div ref={sectionRef}>
        <Container className="pt-16 md:pt-20 pb-20 md:pb-28">
          {/* Header area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-center mb-16">
            {/* Headline + sticker */}
            <div className="md:col-span-1 relative">
              <Reveal direction="up">
                <p className="font-body text-xs uppercase tracking-widest text-kc-blue mb-3">
                  {CAPABILITIES_SECTION.sectionLabel}
                </p>
                <h2
                  className="font-display text-kc-black uppercase leading-none"
                  style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
                >
                  {CAPABILITIES_SECTION.headline.split("\n").map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                {/* Yellow underline accent */}
                <div
                  className="h-1 bg-kc-yellow mt-4"
                  style={{ width: "clamp(4rem, 8vw, 8rem)" }}
                  aria-hidden="true"
                />
              </Reveal>
            </div>

            {/* Sticker column — the section's visual anchor, sized to
                actually compete with the headline rather than sit as a
                small decorative aside. */}
            <div className="md:col-span-1 flex justify-center items-center">
              <div ref={mascotRef}>
                <Sticker
                  src="/Images/PNGs/Banana man Left.png"
                  alt="KCATCH mascot character"
                  width={280}
                  height={280}
                  rotation={-3}
                />
              </div>
            </div>

            {/* Annotation + CTA */}
            <div className="md:col-span-1 flex flex-col justify-center gap-6">
              <Reveal direction="up" delay={0.2}>
                <p className="font-body text-kc-black/70 text-sm md:text-base leading-relaxed">
                  {CAPABILITIES_SECTION.annotation}
                </p>
                <Link
                  href={CAPABILITIES_SECTION.cta.href}
                  className="inline-flex items-center gap-2 mt-6 border border-kc-black text-kc-black font-body text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-kc-black hover:text-kc-white transition-all duration-300 focus-visible:outline-kc-yellow group"
                >
                  {CAPABILITIES_SECTION.cta.label}
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </div>
          </div>

          {/* Capabilities grid — small hover reaction (icon lift + underline
              + faint tint) so the row reads as an interactive system rather
              than static feature copy, kept subtle per the "don't animate
              everything" rule. */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-kc-black/20"
            role="list"
          >
            {CAPABILITIES.map((cap, i) => {
              const Icon = ICON_MAP[cap.icon as keyof typeof ICON_MAP] ?? Lightbulb;
              return (
                <Reveal key={cap.id} direction="up" delay={i * 0.1}>
                  <div
                    className={cn(
                      "group relative flex flex-col items-center text-center gap-4 py-10 px-6 transition-colors duration-300 hover:bg-kc-black/[0.03]",
                      "border-b lg:border-b-0 border-r-0 lg:border-r border-kc-black/20",
                      i === CAPABILITIES.length - 1 && "border-r-0"
                    )}
                    role="listitem"
                  >
                    <span className="font-body text-[10px] text-kc-black/30 tracking-widest absolute top-4 left-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="text-kc-blue transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon size={28} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-kc-black uppercase text-xl tracking-wide relative">
                      {cap.title}
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-kc-yellow transition-all duration-300 group-hover:w-full" aria-hidden="true" />
                    </h3>
                    {cap.description && (
                      <p className="font-body text-kc-black/60 text-sm">
                        {cap.description}
                      </p>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </div>
    </PaperSection>
  );
}
