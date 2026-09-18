"use client";
// components/projects/project-row.tsx
// Single project row for the Projects page — stable hover (desktop) +
// click-lock + tap (touch) interaction. Replaces the earlier
// IntersectionObserver/scroll-driven activation (project-scroll-item.tsx,
// removed — confirmed unused anywhere else) with a plain state-driven
// CSS-transition reveal: no scroll-position math, no ScrollTrigger, no
// pinning. Presentation adapted from kcatch-media's services.tsx (numbered
// rows, kc-display type, "+" toggle, grid-rows expand) — not its content,
// and not its hover-only mechanism (this also supports click-lock so a
// project can be inspected without holding the mouse in place, and so
// touch devices — which have no hover — still work via tap).

import { type Project } from "@/content/projects";
import { KcatchImage } from "@/components/ui/kcatch-image";

type ProjectRowProps = {
  project: Project;
  index: number;
  isActive: boolean;
  onHoverStart: (id: string) => void;
  onHoverEnd: (id: string) => void;
  onToggleLock: (id: string) => void;
};

export function ProjectRow({
  project,
  index,
  isActive,
  onHoverStart,
  onHoverEnd,
  onToggleLock,
}: ProjectRowProps) {
  const displayNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      id={project.id}
      data-project-id={project.id}
      // scroll-margin-top, not a JS-only offset: this is what the
      // BROWSER'S OWN native #hash fragment navigation (and
      // scrollIntoView()) read to leave breathing room above the fixed
      // nav — without it, both the native jump on page load AND our own
      // scrollIntoView() call land the row flush with the viewport top,
      // clipping the heading under the nav. Matches the nav's own
      // per-breakpoint height (h-16 / md:h-[80px] / lg:h-[96px]) plus
      // comfortable breathing room, so it's responsive by construction
      // rather than one hard-coded value.
      className="border-b border-kc-line scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32"
      onMouseEnter={() => onHoverStart(project.id)}
      onMouseLeave={() => onHoverEnd(project.id)}
    >
      {/* The whole row is the toggle target — click/tap locks/unlocks it.
          There's no separate "View Project" link on this page: the
          Project type has no distinct external URL, and a link back to
          /projects#id from the Projects page itself would be a no-op. */}
      <button
        type="button"
        onClick={() => onToggleLock(project.id)}
        className="flex w-full items-center gap-4 py-5 md:py-6 text-left focus-visible:outline-kc-yellow"
        aria-expanded={isActive}
        aria-label={
          isActive ? `Close ${project.client} project` : `Expand ${project.client} project`
        }
      >
        <span className="w-10 md:w-12 flex-shrink-0 font-display text-lg text-kc-muted md:text-xl">
          {displayNumber}
        </span>
        <span
          className={`kc-display flex-1 min-w-0 truncate text-3xl text-kc-white transition-all duration-300 sm:text-5xl md:text-7xl ${
            isActive ? "translate-x-2 text-kc-yellow" : ""
          }`}
        >
          {project.client}
        </span>
        <span
          className={`flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full border-2 border-kc-yellow text-xl transition-transform duration-300 ${
            isActive ? "rotate-45 bg-kc-yellow text-kc-black" : "text-kc-yellow"
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {/* Expand/collapse via grid-template-rows 0fr/1fr, wrapped in
          overflow-hidden — a plain CSS transition, no animation library. */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center pb-8 md:pb-10 pl-0 md:pl-[3.5rem]">
            {/* Info */}
            <div
              className="min-w-0 transition-opacity duration-300"
              style={{ opacity: isActive ? 1 : 0 }}
            >
              {project.subtitle && (
                <p className="font-hand text-kc-muted text-base mb-2">
                  {project.subtitle}
                </p>
              )}
              <p className="font-body text-kc-muted text-sm md:text-base leading-relaxed max-w-md mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-kc-yellow px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-kc-black"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Image — balanced 50/50 with info on desktop, never
                distorted (object-cover, fixed-height frame). Scale
                0.97->1 + opacity on reveal, per the animation spec,
                without ever touching object-fit. */}
            <div className="relative w-full h-[220px] md:h-[320px] min-w-0 overflow-hidden border border-kc-white/15">
              <div
                className="absolute inset-0 transition-[transform,opacity] duration-500 ease-out"
                style={{
                  transform: isActive ? "scale(1)" : "scale(0.97)",
                  opacity: isActive ? 1 : 0,
                }}
              >
                <KcatchImage
                  src={project.heroImage}
                  alt={`${project.client} campaign visual`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  placeholderLabel={project.number}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
