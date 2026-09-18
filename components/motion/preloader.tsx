"use client";
// components/motion/preloader.tsx
// Premium KCATCH launch sequence — Caractère Bois-inspired: a short,
// intentional identity moment, not a generic progress bar.
//
// CRITICAL: this component's covering panel markup is rendered
// UNCONDITIONALLY — identical on the server, on the client's hydration
// render, and after — specifically so the preloader is present in the
// very first byte of HTML the browser paints, before React has even
// hydrated. An earlier version gated the panel's existence itself on
// client-only state ("if (!ready) return null"), which fixed the
// hydration-mismatch warning but reopened a worse problem: the SERVER
// HTML then contained no preloader at all, so the real page underneath
// (already present in that same server HTML, since Next.js SSRs
// `children` too) painted first and was visible for a beat before
// hydration ran and the preloader's effect had a chance to appear. The
// fix is to never let the panel's presence depend on client state —
// only the ANIMATION (via GSAP, imperative, invisible to React's
// hydration diff) and the eventual removal depend on `phase`. The
// panel's own JSX/className stays byte-identical across server and
// client, so this produces zero hydration mismatch while still covering
// the screen from true first paint.
//
// Behavior:
//   - Shows on every real document load — first visit, and any full
//     page refresh — since that's the moment a visitor actually
//     perceives as "opening the site." It intentionally does NOT gate
//     on sessionStorage/once-per-visit: that made the branded intro
//     disappear on a refresh, which read as inconsistent rather than
//     premium. A client-side route change (Home -> Projects -> Contact
//     via next/link) never remounts this component at all — it lives in
//     the root layout — so it naturally never replays on in-app
//     navigation; only an actual new document load does.
//   - Skipped (animation never plays, panel removed immediately) under
//     prefers-reduced-motion.
//   - Capped at a firm ~1.8s animated sequence regardless of how fast
//     assets load, so it always registers as one deliberate beat rather
//     than either flashing invisibly or stalling the page. (Verify this
//     number by computing the timeline's actual total duration — GSAP's
//     "-=X" position offsets subtract from the END of the timeline SO
//     FAR, not from the step's own duration, so several stacked
//     overlaps drift much further than they look; an earlier version of
//     this comment claimed ~1.4s while the real total had crept to
//     ~2.4s, which is exactly what read as "a long hold" before
//     anything visible happened.)
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { HOME_HERO, FOOTER } from "@/content/site";
import { markPreloaderDone } from "@/lib/motion/preloader-gate";

// A single state machine: "pending" is the ONLY value ever used during
// SSR and the client's hydration render (see the file header) — it
// resolves, after mount, into "playing" (the branded intro runs) or
// "skipped" (reduced motion, panel removed with no animation), then
// eventually "done" once the exit finishes.
type Phase = "pending" | "playing" | "skipped" | "done";

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("pending");
  const rootRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLDivElement>(null);
  const tapeRef = useRef<HTMLDivElement>(null);
  const checkerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Resolve the real reduced-motion preference strictly after hydration
  // (see the file header) — server and the client's first paint both
  // render "pending" (see the render guard below), then this single
  // update moves to "playing" or "skipped".
  useEffect(() => {
    // Reading matchMedia to decide the render outcome is exactly the
    // "subscribe to an external system, then setState" case the lint
    // rule's own rationale endorses; the alternative (deciding this in
    // a lazy useState initializer) reads that same API during the
    // hydration render itself and causes a real client/server mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase(prefersReducedMotion() ? "skipped" : "playing");
  }, []);

  useGSAP(
    () => {
      if (!rootRef.current) return;

      // Reduced motion: remove the covering panel immediately, no
      // animation — this is imperative (gsap.set), not a React
      // re-render, so it never touches the server/hydration markup.
      // Page content (Hero entrance etc.) is gated on this same signal
      // (see lib/motion/preloader-gate.ts), so it must fire here too —
      // otherwise a reduced-motion visitor's page content would never
      // animate in at all.
      if (phase === "skipped") {
        gsap.set(rootRef.current, { display: "none" });
        markPreloaderDone();
        return;
      }

      if (phase !== "playing") return;

      document.body.style.overflow = "hidden";

      // FAILSAFE: the only thing that clears the lock above was
      // previously the timeline's own onComplete — if the timeline is
      // ever interrupted, reverted (useGSAP calls context.revert() on
      // any dependency change or unmount, which does NOT know about
      // this plain document.body write since it's not a GSAP-tracked
      // property), or throws before finishing, native scrolling stayed
      // permanently disabled with no recovery path. This timer
      // guarantees the lock clears within a bounded time regardless of
      // whether the animation itself ever completes; it's a no-op in
      // the normal case since onComplete already clears the lock (and
      // calls this same idempotent unlock) well before it fires.
      const unlock = () => {
        document.body.style.overflow = "";
      };
      const failsafeTimer = window.setTimeout(() => {
        unlock();
        markPreloaderDone();
      }, 3000); // comfortably longer than the ~1.3s real timeline

      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(failsafeTimer);
          unlock();
          setPhase("done");
        },
      });

      // Identity moment, built entirely from KCATCH's own existing
      // material language — no invented slogans or stock loading UI.
      // Retimed after the original sequence's stacked negative-offset
      // overlaps compounded into a real ~2.4s runtime (each "-=X"
      // subtracts from the END of the timeline so far, not from that
      // step's own duration — five stacked overlaps drift a LOT further
      // than they look) even though the file's own comment claimed
      // ~1.4s; that mismatch between documented and actual duration is
      // exactly what read as "a long hold" before anything visible
      // happened. Tightened durations/overlaps below to land at the
      // documented ~1.3s for real, verified by computing the timeline's
      // total duration by hand rather than eyeballing the overlaps.
      tl.fromTo(
        cornersRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power1.out" }
      )
        // Logo: simple, robust opacity + scale entrance — deliberately
        // not a masked line-reveal (which requires the overflow-hidden
        // wrapper + matching transform-origin/property choreography a
        // text wordmark needed and which broke twice in a row here).
        // opacity/scale on a single Image element has nothing to
        // reconcile against a pre-set inline transform string, so
        // there's no equivalent failure mode.
        .fromTo(
          wordmarkRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" },
          "-=0.05"
        )
        .fromTo(
          phraseRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          "-=0.1"
        )
        .fromTo(
          checkerRef.current,
          { scale: 0, rotate: -8 },
          { scale: 1, rotate: 0, duration: 0.25, ease: "back.out(2)" },
          "-=0.1"
        )
        .fromTo(
          tapeRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.3, ease: "power3.inOut", transformOrigin: "left center" },
          "-=0.05"
        )
        .to({}, { duration: 0.1 }) // brief hold — the identity moment settles
        // Physical shutter exit: the whole panel translates bodily off
        // the TOP of the screen (yPercent -100, not a clip-path collapse
        // toward a point) — the Hero underneath is revealed by the
        // curtain actually leaving, not by the curtain shrinking away in
        // place.
        .to(panelRef.current, {
          yPercent: -100,
          duration: 0.5,
          ease: "power3.inOut",
        }, "exit")
        .set(rootRef.current, { display: "none" })
        // Signal AFTER the preloader has fully exited and the covering panel
        // is removed. This ensures the Hero section's entrance animations
        // don't compete with the heavy preloader transform on the main thread,
        // resolving the stuttering/lagging issue.
        .call(markPreloaderDone);

      // Cleanup: fires on unmount AND on any dependency change (i.e.
      // every time this callback re-runs, useGSAP reverts the PREVIOUS
      // invocation first) — guarantees the lock/timer from THIS
      // invocation can never outlive it, independent of whether the
      // timeline itself ever reached onComplete.
      return () => {
        window.clearTimeout(failsafeTimer);
        unlock();
      };
    },
    { dependencies: [phase], scope: rootRef }
  );

  // No conditional return here — see the file header. This markup is
  // ALWAYS rendered, identically, on server and client, so it covers
  // the screen from true first paint. `phase` only ever drives GSAP
  // (imperative, via refs) and the final `display: none` removal.
  //
  // Every animated child's inline style below matches its GSAP
  // timeline's own `fromTo` starting state exactly, so the un-hydrated,
  // pre-JS first paint already shows the "not yet revealed" look
  // instead of flashing fully visible before the timeline takes over.
  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100]"
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        className="absolute inset-0 bg-kc-black flex flex-col items-center justify-center gap-5"
      >
        {/* Small editorial metadata corners — real content only (the
            site's own eyebrow line and office locations), tiny and
            secondary so the wordmark stays the dominant element. */}
        <div
          ref={cornersRef}
          className="absolute inset-6 md:inset-10 flex items-start justify-between font-body text-[10px] md:text-xs uppercase tracking-widest text-kc-white/40 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <span>{HOME_HERO.eyebrow}</span>
          <span>{FOOTER.locations.join(" / ")}</span>
        </div>

        {/* The real KCATCH logo lockup (public/Images/logo/Kcatch-logo.png),
            not a text substitute — this is the site's actual brand mark,
            sized as the hero of the whole sequence. Starting
            opacity/scale is set inline so the un-hydrated first paint
            already shows it "not yet revealed" instead of flashing in
            fully formed before the GSAP timeline runs. */}
        <div
          ref={wordmarkRef}
          className="relative w-[220px] h-[73px] md:w-[300px] md:h-[100px]"
          style={{ opacity: 0, transform: "scale(0.85)" }}
        >
          <Image
            src="/Images/logo/Kcatch-logo.png"
            alt="KCATCH"
            fill
            priority
            sizes="(min-width: 768px) 300px, 220px"
            className="object-contain"
          />
        </div>
        <div className="flex items-center gap-3">
          <div
            ref={checkerRef}
            className="w-4 h-4 flex-shrink-0"
            style={{
              // Upright checker squares — same verified formula as
              // components/graphics/checkerboard.tsx, not the diagonal
              // diamond pattern this used before.
              backgroundImage: "repeating-conic-gradient(#ffe600 0% 25%, #000 0% 50%)",
              backgroundSize: "4px 4px",
              transform: "scale(0) rotate(-8deg)",
            }}
          />
          <div
            ref={phraseRef}
            className="font-hand text-kc-white text-lg md:text-2xl"
            style={{ opacity: 0, transform: "translateY(10px)" }}
          >
            the damn eye.
          </div>
        </div>
        <div
          ref={tapeRef}
          className="h-2 w-40 md:w-56 bg-kc-yellow"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent 0 8px, rgba(0,0,0,0.15) 8px 16px)",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </div>
    </div>
  );
}
