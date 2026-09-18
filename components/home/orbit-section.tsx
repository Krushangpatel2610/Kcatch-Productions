"use client";
// components/home/orbit-section.tsx
// "Everything in orbit" — rotating rings of project/client nodes around a
// central focus image. Rebuilt from kcatch-media's orbital-work.tsx onto
// Project A's own data (content/projects.ts, content/site.ts) and reveal
// convention (components/motion/reveal.tsx) instead of B's lib/kcatch-data.ts
// and useReveal hook. Rotation is pure CSS (see the "MIGRATED FROM
// kcatch-media" block in app/globals.css) — no new animation library.

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredProjects } from "@/content/projects";
import { CLIENTS } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";
import { Checkerboard } from "@/components/graphics/checkerboard";

// Inner ring uses client names — mirrors B's `clients.slice(0, 8)`.
const orbitClients = CLIENTS.slice(0, 8);

export function OrbitSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = featuredProjects[activeIndex];

  return (
    <section
      id="orbit"
      className="relative overflow-hidden bg-kc-surface py-24 md:py-32"
      aria-label="Everything in orbit"
      data-section="orbit"
    >
      {/* h-16 matches B's checker strip proportions exactly */}
      <Checkerboard
        height="xs"
        density="tight"
        className="absolute left-0 top-0 h-16 opacity-10"
      />

      <Container>
        <Reveal direction="up" className="mb-12 text-center">
          <p className="mb-3 inline-flex items-center gap-3 font-body text-xs font-bold uppercase tracking-[0.3em] text-kc-yellow">
            <span className="inline-block h-2 w-2 bg-kc-yellow" />
            The KCATCH orbit
          </p>
          <h2 className="kc-display text-5xl text-kc-white md:text-8xl">
            EVERYTHING IN ORBIT
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-sm text-kc-muted">
            Every brand we touch pulls into the KCATCH gravity. Tap a node to
            bring it to the center.
          </p>
        </Reveal>

        <div className="relative mx-auto aspect-square w-full max-w-[680px]">
          {/* Static orbit rings — /50 opacity matches B's subtler border-white/10 look */}
          <div className="absolute inset-0 rounded-full border border-kc-line/50" />
          <div className="absolute inset-[16%] rounded-full border border-dashed border-kc-line/50" />
          <div className="absolute inset-[32%] rounded-full border border-kc-line/50" />

          {/* Rotating outer ring — project nodes */}
          <div
            className="absolute inset-0"
            data-kc-orbit-spin
            style={{ animation: "kc-orbit-spin 48s linear infinite" }}
          >
            {featuredProjects.map((project, i) => {
              const angle = (i / featuredProjects.length) * Math.PI * 2;
              const x = 50 + Math.cos(angle) * 50;
              const y = 50 + Math.sin(angle) * 50;
              const isActive = i === activeIndex;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  data-cursor="view"
                  data-kc-orbit-spin
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    animation: "kc-orbit-spin-reverse 48s linear infinite",
                  }}
                  aria-label={`Focus ${project.client}`}
                  aria-pressed={isActive}
                >
                  <span
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 font-display text-xs uppercase tracking-wider transition-colors ${
                      isActive
                        ? "border-kc-yellow bg-kc-yellow text-kc-black"
                        : "border-kc-line bg-kc-surface-2/80 text-kc-white/70 hover:border-kc-yellow hover:text-kc-yellow"
                    }`}
                  >
                    {/* Sequential position within the featured order
                        (01-07) — same numbering as Featured Work, not the
                        shared archive `number` field. */}
                    <span className="text-[10px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                    {project.client}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Rotating inner ring — client dots */}
          <div
            className="absolute inset-[16%]"
            data-kc-orbit-spin
            style={{ animation: "kc-orbit-spin-reverse 36s linear infinite" }}
          >
            {orbitClients.map((client, i) => {
              const angle = (i / orbitClients.length) * Math.PI * 2;
              const x = 50 + Math.cos(angle) * 50;
              const y = 50 + Math.sin(angle) * 50;
              return (
                <div
                  key={client.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  data-kc-orbit-spin
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    animation: "kc-orbit-spin 36s linear infinite",
                  }}
                >
                  <span
                    className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-kc-yellow/70"
                    title={client.name}
                  />
                </div>
              );
            })}
          </div>

          {/* Central dominant subject */}
          <div className="absolute inset-[34%] flex items-center justify-center">
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-kc-yellow">
              <Image
                src={active.heroImage}
                alt={active.client}
                fill
                sizes="(min-width: 768px) 240px, 160px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-kc-surface/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <p className="font-display text-lg uppercase leading-none text-kc-white md:text-2xl">
                  {active.client}
                </p>
                <p className="mt-1 font-body text-[9px] font-bold uppercase tracking-widest text-kc-yellow md:text-[10px]">
                  {String(activeIndex + 1).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active node detail. B's layout showed Client/Category/Service/Year;
            Project A's project data has no `year` field, so this uses the
            three fields that actually exist (client/category/tag) rather
            than inventing one. */}
        <div className="mx-auto mt-12 grid max-w-2xl gap-4 text-center sm:grid-cols-3">
          {[
            { k: "Client", v: active.client, href: `/projects#${active.id}` },
            { k: "Category", v: active.category },
            { k: "Service", v: active.tags[0] },
          ].map((row) => (
            <div key={row.k} className="border-t border-kc-line pt-4">
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-kc-yellow">
                {row.k}
              </p>
              {row.href ? (
                // Same project link Featured Work exposes via its "VIEW
                // PROJECT" CTA (/projects#<id>) — Orbit's compact layout
                // has no room for a separate CTA, so the Client value
                // itself carries the link instead of adding a new element.
                <Link
                  href={row.href}
                  className="mt-1 block font-display text-sm uppercase text-kc-white hover:text-kc-yellow transition-colors"
                  aria-label={`View ${row.v} project`}
                >
                  {row.v}
                </Link>
              ) : (
                <p className="mt-1 font-display text-sm uppercase text-kc-white">
                  {row.v}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
