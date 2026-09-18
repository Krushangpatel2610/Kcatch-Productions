"use client";
// components/contact/office-list.tsx
// KCATCH office contact information.
// Data from approved brochure content in contact.ts.

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { OFFICES } from "@/content/contact";
import { Reveal } from "@/components/motion/reveal";
import { KcatchImage } from "@/components/ui/kcatch-image";
import { Checkerboard } from "@/components/graphics/checkerboard";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";

// Real photos for the two offices, replacing the generic KcatchImage
// camera-placeholder. Shared LocationImage system below — only the src/
// alt/note differ per city; any other future office keeps the original
// compact placeholder path in the map below, untouched.
const AHMEDABAD_IMAGE_SRC = "/Images/BG Images/photo-1638006524490-492fdf36ee04.avif";
const PUNE_IMAGE_SRC = "/Images/BG Images/af8b2656-baa6-491b-8a69-f71482f29feb.png";

type LocationImageProps = {
  src: string;
  alt: string;
  /** Optional handwritten editorial accent over the image — omit rather
      than inventing copy when no approved tagline exists for a city. */
  note?: string;
};

function LocationImage({ src, alt, note }: LocationImageProps) {
  // Simple mount-triggered reveal (opacity + scale) — no scroll/animation
  // library needed for a one-shot 500ms transition.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative mb-4">
      {/* Wide panoramic window — 4:3 on mobile (keeps the important
          content readable on a narrow crop) widening to a true panorama
          at md+. object-cover + object-center, never stretched. */}
      <div
        className="relative w-full aspect-[4/3] md:aspect-[16/7] overflow-hidden border border-kc-black/20 transition-[opacity,transform] duration-500 ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "scale(1)" : "scale(0.98)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Yellow tape accent — overlaps the image's top-left corner
          slightly without breaking outside the card. */}
      <div
        className="absolute -top-2 left-6 w-16 h-6 bg-kc-yellow/90 shadow-md z-10"
        style={{ transform: "rotate(-3deg)" }}
        aria-hidden="true"
      />

      {/* Small checkerboard detail — extends slightly past the image's
          bottom-right corner, echoing the same motif used elsewhere on
          the site rather than inventing a new one. */}
      <Checkerboard
        height="xs"
        density="tight"
        className="absolute -bottom-2 -right-2 w-12 z-10"
      />

      {/* Subtle editorial note over the image — one line, corner-placed,
          not competing with the city label/contact info below. Only
          rendered when an approved tagline was actually supplied. */}
      {note && (
        <div className="absolute bottom-3 left-3 z-10">
          <HandwrittenNote text={note} size="sm" color="white" rotation={-2} />
        </div>
      )}
    </div>
  );
}

export function OfficeList() {
  return (
    <div>
      <Reveal direction="up">
        <h2 className="font-display text-kc-black uppercase text-2xl md:text-3xl mb-2">
          TWO CITIES.
        </h2>
        <p className="font-display text-kc-black uppercase text-2xl md:text-3xl mb-8">
          ONE CREATIVE MADNESS.
        </p>
        <p className="font-hand text-kc-black/50 text-base mb-8 -mt-4">
          Rooted in ideas.
        </p>
      </Reveal>

      <div className="flex flex-col gap-6">
        {OFFICES.map((office, i) => (
          <Reveal key={office.city} direction="up" delay={i * 0.1}>
            <article
              className="border border-kc-black/20 p-5 md:p-6"
              aria-label={office.label}
            >
              {office.city === "Ahmedabad" ? (
                <LocationImage
                  src={AHMEDABAD_IMAGE_SRC}
                  alt="Sabarmati Riverfront, Ahmedabad, at night"
                  note="AHMEDABAD BUILDS DIFFERENT."
                />
              ) : office.city === "Pune" ? (
                <LocationImage
                  src={PUNE_IMAGE_SRC}
                  alt="Shaniwar Wada, Pune"
                />
              ) : (
                <KcatchImage
                  src={`/contact/${office.city.toLowerCase()}.jpg`}
                  alt={`${office.city} office`}
                  className="w-full h-28 mb-4"
                />
              )}

              {/* Label */}
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="bg-kc-yellow px-3 py-1 font-display text-kc-black text-sm uppercase tracking-wider">
                  {office.city.toUpperCase()}
                </div>
              </div>

              <h3 className="font-display text-kc-black text-lg uppercase mb-3 flex items-center gap-2">
                <MapPin size={14} aria-hidden="true" />
                {office.label}
              </h3>

              {/* Contact people */}
              <ul className="flex flex-col gap-3">
                {office.people.map((person) => (
                  <li key={person.phone}>
                    <p className="font-body text-kc-black text-sm font-semibold">
                      {person.name}
                    </p>
                    <a
                      href={`tel:${person.phone.replace(/\s/g, "")}`}
                      className="font-body text-kc-black/60 text-sm hover:text-kc-blue transition-colors focus-visible:outline-kc-yellow"
                    >
                      {person.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal direction="up" delay={0.2}>
        <p className="font-hand text-kc-black/50 text-base mt-8">
          Always building more.
        </p>
      </Reveal>
    </div>
  );
}
