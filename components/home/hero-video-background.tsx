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
// .webp, not the original .png: the source PNG was 1.87MB for a
// 1672x941 photo — PNG is the wrong codec for a photograph (lossless,
// so it can't exploit the redundancy a photo actually has). Re-encoded
// at quality 82 the same image is 118KB, a ~16x reduction with no
// visible quality loss, and it's this exact asset that's `priority`
// (LCP-critical, decoded eagerly) at the same moment the preloader's
// own GSAP timeline is running its first frames — the 1.87MB version
// was very likely a real, direct contributor to the reported preloader
// lag/glitch, not just a general page-weight concern.
const FALLBACK_IMAGE_SRC = "/Images/BG Images/LandingPageBg.webp";

type HeroVideoBackgroundProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Called once the actual background image has decoded and painted. */
  onImageReady?: () => void;
};

export function HeroVideoBackground({ sectionRef, onImageReady }: HeroVideoBackgroundProps) {
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
    // unchanged. The scale-settle entrance animates the wrapper div
    // HeroSection renders around this component (bgRef, a direct ref —
    // see hero-section.tsx), not this Image itself, so no data-attribute
    // hook is needed here.
    return (
      <Image
        src={FALLBACK_IMAGE_SRC}
        alt="KCATCH Hero Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
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
