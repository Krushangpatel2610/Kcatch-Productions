// lib/motion/preloader-gate.ts
// A tiny, dependency-free signal for "the preloader curtain has fully
// left / was skipped, real page entrance animations may now start."
//
// Preloader and HeroSection are siblings under app/layout.tsx (the
// preloader lives at the root, outside any page), not parent/child, so
// there's no natural prop to pass "I'm done" through. A global custom
// event avoids introducing React context (or a store) for a single
// one-shot boolean signal, and — critically — it's readable synchronously
// via a plain module-level flag, which handles the ordering race: if the
// preloader finishes (or is skipped under reduced motion) BEFORE
// HeroSection's own effect subscribes, a plain addEventListener would
// miss that event entirely and the Hero would wait forever. Callers
// should always check `isPreloaderDone()` first and only subscribe if
// it's still false.

const EVENT_NAME = "kcatch:preloader-done";

let done = false;

export function isPreloaderDone(): boolean {
  return done;
}

/** Called once by Preloader when its curtain has left or been skipped. */
export function markPreloaderDone(): void {
  if (done || typeof window === "undefined") return;
  done = true;
  window.dispatchEvent(new Event(EVENT_NAME));
}

/**
 * Runs `callback` once the preloader is done — immediately (synchronously)
 * if it already finished before this was called, otherwise on the event.
 * Returns an unsubscribe function safe to call even after the callback
 * already ran.
 */
export function onPreloaderDone(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (done) {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler, { once: true });
  return () => window.removeEventListener(EVENT_NAME, handler);
}
