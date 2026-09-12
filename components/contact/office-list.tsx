// components/contact/office-list.tsx
// KCATCH office contact information.
// Data from approved brochure content in contact.ts.

import { MapPin } from "lucide-react";
import { OFFICES } from "@/content/contact";
import { Reveal } from "@/components/motion/reveal";
import { KcatchImage } from "@/components/ui/kcatch-image";

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
              <KcatchImage
                src={`/contact/${office.city.toLowerCase()}.jpg`}
                alt={`${office.city} office`}
                placeholderLabel={office.city}
                className="w-full h-28 mb-4"
              />

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
