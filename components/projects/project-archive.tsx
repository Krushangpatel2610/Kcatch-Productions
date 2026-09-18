"use client";
// components/projects/project-archive.tsx
// Full project list — editorial hover-preview + click-lock interaction.
//
// Activation is a PLAIN STATE MODEL (hoverId / lockedId), never derived
// from scroll position: no IntersectionObserver, no ScrollTrigger, no
// pinning, no spacer heights. The earlier scroll-driven version
// (project-scroll-item.tsx) glitched under rapid movement and has been
// removed — confirmed unused anywhere else before deletion.
//
// activeId = lockedId ?? hoverId
//   - Desktop: hovering a row previews it (only when nothing is locked).
//     Clicking a row locks it open regardless of where the mouse moves
//     afterward; clicking the same locked row again unlocks it.
//   - Touch: hover never fires, so tap (which fires the same onClick)
//     drives the exact same lock toggle — one interaction model, not two.
//
// Presentation adapted from kcatch-media's components/services.tsx (What
// We Do): numbered rows, checkerboard side strip, kc-display type, a
// circular "+" toggle. Not its content, and not its hover-only
// mechanism — this page also needs click-lock (so touch works, and so a
// project can be inspected without holding the mouse still).

import { useEffect, useState } from "react";
import { featuredProjects } from "@/content/projects";
import { ProjectRow } from "./project-row";
import { Container } from "@/components/layout/container";

export function ProjectArchive() {
  // Same data source/order as Home's Featured Work and Orbit — no second
  // project dataset for this page.
  const projects = featuredProjects;

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [lockedId, setLockedId] = useState<string | null>(null);

  const activeId = lockedId ?? hoverId;

  // Deep-link support: /projects#<id> (e.g. from Home's Featured Work
  // "VIEW PROJECT" links, which already point to /projects#${project.id})
  // locks that project open on arrival. This reads window.location.hash
  // directly on mount, so it works identically on a client-side Link
  // navigation AND on a hard refresh straight to /projects#zee5 — it does
  // NOT use IntersectionObserver/ScrollTrigger/scroll position; it's a
  // one-shot effect that runs once.
  //
  // The actual positioning does NOT rely on the browser's native #hash
  // jump (or Next's own hash-scroll on route change) to determine the
  // final scroll position — both of those fire independently of this
  // effect and land the row flush with the viewport top, clipping the
  // heading under the fixed nav. Every row carries scroll-mt-* (see
  // project-row.tsx) so that native/Next jump ALSO respects the same
  // offset as a first line of defense, but this effect still explicitly
  // re-asserts the final position itself: double requestAnimationFrame
  // (not an arbitrary setTimeout) waits for the setLockedId re-render to
  // actually commit a layout/paint — the expanded panel's height needs
  // to exist before scrollIntoView is asked to account for it — then
  // scrollIntoView({block:"start"}) reads that same scroll-margin-top.
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id || !projects.some((p) => p.id === id)) return;

    // Reading a real external API (location.hash) to seed state — the
    // same "subscribe to an external system, then setState" case allowed
    // elsewhere in this codebase (see custom-cursor.tsx, preloader.tsx).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLockedId(id);

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // Intentionally run once on mount only — this seeds the initial
    // locked project from the URL; it must not re-run and re-lock the
    // project every time lockedId/hoverId change from normal hover/click.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHoverStart = (id: string) => {
    if (!lockedId) setHoverId(id);
  };

  const handleHoverEnd = (id: string) => {
    // Only clear if this row is still the current hover target — guards
    // against a stray mouseleave (from the row you're moving away from)
    // clobbering the mouseenter that already landed on the next row,
    // regardless of the exact order those two events fire in.
    setHoverId((prev) => (prev === id ? null : prev));
  };

  const handleToggleLock = (id: string) => {
    setLockedId((prev) => {
      const next = prev === id ? null : id;
      // Closing (toggling off): if the URL still carries this project's
      // hash (e.g. arrived via /projects#zee5), strip it via shallow
      // history so refreshing afterward doesn't reopen it — replaceState
      // only, never a real navigation/reload, and it doesn't touch the
      // Home->Projects history entry Back/Forward relies on.
      if (next === null && window.location.hash === `#${id}`) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      return next;
    });
    // The mouse is still resting on the toggle button at the moment of
    // this click, so hoverId is still set to this same project. Without
    // clearing it here, unlocking (activeId = lockedId ?? hoverId) would
    // fall straight through to the lingering hoverId and the row would
    // never visually close — this was the actual bug: the "close" click
    // WAS clearing lockedId, but hoverId kept the row open regardless.
    // Clearing it also means the project only reopens on an intentional
    // fresh hover (a real mouseenter), not merely because the pointer
    // never left.
    setHoverId((prev) => (prev === id ? null : prev));
  };

  return (
    <section
      className="relative bg-kc-black overflow-hidden"
      aria-label="Project archive"
      data-section="project-archive"
    >
      {/* Checkerboard side strip — B's full-height right-edge checker
          column, via the existing .kc-checker utility. */}
      <div
        className="kc-checker pointer-events-none absolute right-0 top-0 hidden h-full w-16 opacity-100 md:block lg:w-24"
        aria-hidden="true"
      />

      <Container className="relative py-12 md:py-16">
        <div
          role="list"
          aria-label={`${projects.length} projects`}
          className="border-t border-kc-line"
        >
          {projects.map((project, i) => (
            <div role="listitem" key={project.id}>
              <ProjectRow
                project={project}
                index={i}
                isActive={project.id === activeId}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                onToggleLock={handleToggleLock}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
