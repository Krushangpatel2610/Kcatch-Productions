// components/home/capabilities-section.tsx
// "WHAT WE KCATCH" section.
// Paper/torn section with editorial capabilities grid.

import Link from "next/link";
import { Lightbulb, Video, BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { CAPABILITIES, CAPABILITIES_SECTION } from "@/content/site";
import { TornSection } from "@/components/graphics/torn-section";
import { Sticker } from "@/components/graphics/sticker";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";

const ICON_MAP = {
  Lightbulb,
  Video,
  BarChart3,
  Users,
};

export function CapabilitiesSection() {
  return (
    <>
      {/* Top torn edge: dark → paper */}
      <TornSection variant="dark-to-paper" position="top" />

      <section
        className="bg-kc-paper"
        aria-label="What We KCATCH"
        data-section="capabilities"
      >
        <Container className="pt-16 md:pt-20 pb-20 md:pb-28">
          {/* Header area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start mb-16">
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

            {/* Sticker column */}
            <div className="md:col-span-1 flex justify-center items-center">
              {/* TODO: replace with approved KCATCH character sticker PNG */}
              <Sticker
                alt="KCATCH mascot character"
                placeholder="CHARACTER\nSTICKER"
                width={200}
                height={200}
                rotation={-3}
              />
            </div>

            {/* Annotation + CTA */}
            <div className="md:col-span-1 flex flex-col justify-end gap-6">
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

          {/* Capabilities grid */}
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
                      "flex flex-col items-center text-center gap-4 py-10 px-6",
                      "border-b lg:border-b-0 border-r-0 lg:border-r border-kc-black/20",
                      i === CAPABILITIES.length - 1 && "border-r-0"
                    )}
                    role="listitem"
                  >
                    <div className="text-kc-blue">
                      <Icon size={28} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-kc-black uppercase text-xl tracking-wide">
                      {cap.title}
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
      </section>

      {/* Bottom torn edge: paper → dark */}
      <TornSection variant="paper-to-dark" position="bottom" />
    </>
  );
}
