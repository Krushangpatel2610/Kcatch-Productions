// lib/constants.ts
// KCATCH Motion tokens and site-wide constants

export const MOTION = {
  fast: 0.2,
  normal: 0.45,
  slow: 0.8,
  reveal: 1.0,
  ease: "power3.out",
  scrub: 0.8,
} as const;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
  wide: 1536,
} as const;

export const SITE = {
  name: "KCATCH",
  tagline: "KCATCH THE DAMN EYE",
  url: "https://kcatch.media",
} as const;
