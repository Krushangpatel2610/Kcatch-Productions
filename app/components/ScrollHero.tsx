"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// Must equal the actual file count in public/frames/.
const FRAME_COUNT = 240;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);
    let currentFrame = -1;
    let wantedFrame = 0;
    let rafId = 0;

    function resizeCanvas() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawFrame(index: number): boolean {
      if (!ctx || !canvas) return false;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const img = images[index];
      const isLoaded = loaded[index];

      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, cw, ch);

      if (!img || !isLoaded || !img.naturalWidth) return false;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      return true;
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const idx = i;
      img.onload = () => {
        loaded[idx] = true;
        if (idx === wantedFrame) {
          const didDraw = drawFrame(idx);
          if (didDraw) currentFrame = idx;
        }
      };
      img.src = `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;
      images[i] = img;
    }

    function tick() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0;
      progress.set(p);

      const target = Math.round(p * (FRAME_COUNT - 1));
      wantedFrame = target;

      if (target !== currentFrame) {
        const didDraw = drawFrame(target);
        if (didDraw) currentFrame = target;
      }

      rafId = requestAnimationFrame(tick);
    }

    resizeCanvas();
    drawFrame(0);
    rafId = requestAnimationFrame(tick);

    function onResize() {
      resizeCanvas();
      drawFrame(currentFrame >= 0 ? currentFrame : 0);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [progress]);

  const identityOpacity = useTransform(progress, [0, 0.14], [1, 0]);
  const identityY = useTransform(progress, [0, 0.14], [0, -40]);

  const rightOpacity = useTransform(progress, [0.18, 0.24, 0.5, 0.56], [0, 1, 1, 0]);
  const rightX = useTransform(progress, [0.18, 0.24, 0.5, 0.56], [40, 0, 0, 20]);

  const leftOpacity = useTransform(progress, [0.54, 0.6, 0.82, 0.88], [0, 1, 1, 0]);
  const leftX = useTransform(progress, [0.54, 0.6, 0.82, 0.88], [-40, 0, 0, -20]);

  const closingOpacity = useTransform(progress, [0.88, 0.96], [0, 1]);
  const closingY = useTransform(progress, [0.88, 0.96], [36, 0]);
  const backdropOpacity = useTransform(progress, [0.86, 0.96], [0, 1]);

  return (
    <div ref={containerRef} style={{ height: "500vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#0A0A0A",
        }}
      >
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* Identity block */}
          <motion.div
            style={{
              opacity: identityOpacity,
              y: identityY,
              position: "absolute",
              left: "6%",
              bottom: "12%",
              maxWidth: 620,
              padding: "3rem 2rem 2rem",
              background:
                "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.40) 45%, transparent 100%)",
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.05, ease: EASE_OUT }}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#FFD700",
                marginBottom: "1.25rem",
              }}
            >
              Kcatch Media — Precision-Driven Attention Studio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 56 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.2, ease: EASE_OUT }}
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 400,
                fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
                color: "#FFFFFF",
                lineHeight: 1.05,
                marginBottom: "1.25rem",
              }}
            >
              Catch the Eye.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease: EASE_OUT }}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                color: "#E0E0E0",
                maxWidth: 460,
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              We live in a world where attention is currency. We engineer moments that make
              people pause, look twice, and remember.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.55, ease: EASE_OUT }}
              style={{
                pointerEvents: "auto",
                background: "#FFD700",
                color: "#000000",
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "0.9rem 2.6rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Explore Our Work
            </motion.button>
          </motion.div>

          {/* Right-side paragraph */}
          <motion.div
            style={{
              opacity: rightOpacity,
              x: rightX,
              position: "absolute",
              right: "6%",
              top: "50%",
              transform: "translateY(-50%)",
              maxWidth: 420,
              textAlign: "right",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
                color: "#E0E0E0",
                lineHeight: 1.6,
              }}
            >
              Visibility isn&apos;t luck, it&apos;s design. We blend strategy with instinct and
              aesthetic with precision.
            </p>
          </motion.div>

          {/* Left-side paragraph */}
          <motion.div
            style={{
              opacity: leftOpacity,
              x: leftX,
              position: "absolute",
              left: "6%",
              top: "50%",
              transform: "translateY(-50%)",
              maxWidth: 460,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
                color: "#E0E0E0",
                lineHeight: 1.6,
              }}
            >
              From high-impact campaigns for ZEE5 and RummyCircle to large-scale cultural IPs
              like Rakshak &amp; The Entertainers.
            </p>
          </motion.div>

          {/* Closing center title + CTA */}
          <motion.div
            style={{
              opacity: backdropOpacity,
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.4) 50%, transparent 78%)",
            }}
          />
          <motion.div
            style={{
              opacity: closingOpacity,
              y: closingY,
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 1.5rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#FFD700",
                marginBottom: "1.5rem",
              }}
            >
              Kcatch Us If You Can
            </p>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 400,
                fontSize: "clamp(2.4rem, 6vw, 5.2rem)",
                color: "#FFFFFF",
                maxWidth: "18ch",
                lineHeight: 1.1,
                marginBottom: "2rem",
              }}
            >
              Ready to make your brand unmissable?
            </h2>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              style={{
                pointerEvents: "auto",
                background: "#FFD700",
                color: "#000000",
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "1rem 3rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Start a Project
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
