"use client";
// components/home/hero-video-background.tsx
// Deadwater-inspired hero treatment: a full-bleed background video whose
// playback position is driven by scroll progress (scrubbed), not a plain
// autoplay loop. Falls back to the existing static image when no video
// asset is configured — no video file exists in the repo yet, so this
// renders the fallback today; dropping a real file into public/ and
// setting HERO_VIDEO_SRC below is all that's needed to activate it.
//
// Scrub mechanism: rAF reads the hero section's ScrollTrigger progress
// each frame and sets video.currentTime = progress * video.duration.
// This is deliberately NOT driven by GSAP's own scrub tweening (which
// animates a proxy value over time) — video.currentTime has to be set
// directly and clamped to avoid seek thrashing, so a plain rAF loop
// reading live progress is the standard approach for scroll-scrubbed
// video and keeps this fully independent from the hero's other
// GSAP timelines (no shared transform, no fighting).

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollTrigger from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

// Set this once a real hero video is approved and added to /public.
// Leave null to keep the current static-image hero exactly as-is.
const HERO_VIDEO_SRC: string | null = null;
const FALLBACK_IMAGE_SRC = "/Images/BG Images/LandingPageBg.png";

type HeroVideoBackgroundProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
};

export function HeroVideoBackground({ sectionRef }: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!HERO_VIDEO_SRC || prefersReducedMotion() || !sectionRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    let duration = 0;

    const handleLoaded = () => {
      duration = video.duration || 0;
      setVideoReady(true);
    };
    video.addEventListener("loadedmetadata", handleLoaded);

    const tick = () => {
      const st = ScrollTrigger.getAll().find((t) => t.trigger === sectionRef.current);
      if (st && duration > 0) {
        // Clamp so a fast/overshoot scroll never seeks past the clip's ends.
        const time = Math.max(0, Math.min(duration, st.progress * duration));
        // Avoid redundant seeks — setting currentTime every frame to the
        // same value still costs a decode step in some browsers.
        if (Math.abs(video.currentTime - time) > 0.03) {
          video.currentTime = time;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [sectionRef]);

  if (!HERO_VIDEO_SRC) {
    // No approved video yet — the existing static image treatment,
    // unchanged, including its own GSAP scale-settle (data-reveal-bg is
    // wired up by HeroSection's own timeline).
    return (
      <Image
        src={FALLBACK_IMAGE_SRC}
        alt="KCATCH Hero Background"
        fill
        priority
        className="object-cover object-center"
        data-reveal-bg
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover object-center"
      style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.6s ease-out" }}
      muted
      playsInline
      preload="auto"
      poster={FALLBACK_IMAGE_SRC}
      data-reveal-bg
      aria-hidden="true"
    >
      <source src={HERO_VIDEO_SRC} type="video/mp4" />
    </video>
  );
}
