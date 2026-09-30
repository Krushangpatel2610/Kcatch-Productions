"use client";
// components/graphics/drift-wall.tsx
// DriftWall — a multi-column, continuously drifting image wall with
// perspective, 3D tilt, depth, pointer parallax, hover lift, edge fade and
// dim/overlay. Pure CSS 3D transforms + CSS keyframe animations for the
// drift itself; hover lift/dim is pure CSS too (see the module's `:has()`
// rule) — React never re-renders on hover. React only measures the
// container (ResizeObserver, bucket-gated + debounced) for responsive
// column/tile sizing, and drives a short-lived pointer-parallax tick
// (requestAnimationFrame) that starts on interaction and stops once
// settled, rather than running for the component's entire lifetime.

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./drift-wall.module.css";

export type DriftWallItem = {
  image: string;
  title?: string;
  href?: string;
};

type DriftWallProps = {
  items: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  tilt?: number;
  turn?: number;
  perspective?: number;
  depth?: number;
  /** Drift speed in pixels/second. */
  speed?: number;
  direction?: "up" | "down";
  /** 0-1, randomizes per-column speed so columns don't move in lockstep. */
  variance?: number;
  /** 0-1, strength of the pointer-driven 3D parallax tilt. */
  parallax?: number;
  /** px translateZ applied to a hovered tile. */
  lift?: number;
  /** 0-1, how much of the top/bottom edge fades to transparent. */
  fade?: number;
  /** 0-1, opacity applied to non-hovered tiles while another tile is hovered (1 = no dim). */
  dim?: number;
  className?: string;
  "aria-label"?: string;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

type Bucket = "mobileSmall" | "mobile" | "tablet" | "desktop" | "wide";

function getBucket(width: number): Bucket {
  if (width < 400) return "mobileSmall";
  if (width < 480) return "mobile";
  if (width < 900) return "tablet";
  if (width < 1400) return "desktop";
  return "wide";
}

// Column count and tile scale per breakpoint. Columns are spread across the
// FULL measured container width by the CSS itself (`.wall`'s
// justify-content: space-between — see drift-wall.module.css), so growing
// the column count here is what actually fills wider viewports rather than
// leaving fixed-width columns clumped in the center.
function sizingForBucket(bucket: Bucket, columns: number, tileWidth: number, tileHeight: number) {
  switch (bucket) {
    case "mobileSmall":
      return {
        columns: 2,
        tileWidth: Math.round(tileWidth * 0.55),
        tileHeight: Math.round(tileHeight * 0.55),
      };
    case "mobile":
      return {
        columns: 3,
        tileWidth: Math.round(tileWidth * 0.5),
        tileHeight: Math.round(tileHeight * 0.5),
      };
    case "tablet":
      return {
        columns: Math.min(columns, 4),
        tileWidth: Math.round(tileWidth * 0.7),
        tileHeight: Math.round(tileHeight * 0.7),
      };
    case "wide":
      return {
        columns: columns + 1,
        tileWidth,
        tileHeight,
      };
    case "desktop":
    default:
      return { columns, tileWidth, tileHeight };
  }
}

const RESIZE_DEBOUNCE_MS = 120;

export function DriftWall({
  items,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  tilt = 16,
  turn = -14,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  lift = 64,
  fade = 0.6,
  dim = 0.9,
  className,
  ...aria
}: DriftWallProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const bucketRef = useRef<Bucket | null>(null);
  const [sizing, setSizing] = useState(() => sizingForBucket("desktop", columns, tileWidth, tileHeight));

  // Responsive column/tile sizing — fewer, smaller tiles on narrower
  // containers so the wall never overflows horizontally.
  //
  // Only calls setState when the size actually crosses a breakpoint
  // BUCKET (mobile/tablet/desktop), never on sub-pixel width noise within
  // the same bucket — that's what was causing the wall to occasionally
  // re-layout (and restart column animations) for no visible reason.
  // Bursts of ResizeObserver callbacks (window drag-resize, orientation
  // change, dynamic mobile viewport bars) are debounced into one update.
  // The first measurement runs synchronously in useLayoutEffect, before
  // paint, so there's no flash from a wrong initial guess.
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let debounceId: number | undefined;

    const applyWidth = (width: number) => {
      const bucket = getBucket(width);
      if (bucket === bucketRef.current) return;
      bucketRef.current = bucket;
      setSizing(sizingForBucket(bucket, columns, tileWidth, tileHeight));
    };

    applyWidth(el.getBoundingClientRect().width);

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? el.clientWidth;
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(() => applyWidth(width), RESIZE_DEBOUNCE_MS);
    });
    ro.observe(el);

    return () => {
      window.clearTimeout(debounceId);
      ro.disconnect();
    };
  }, [columns, tileWidth, tileHeight]);

  // Pointer-driven parallax tilt. The rAF loop only runs while actively
  // easing toward a target — it starts on pointermove/pointerleave and
  // stops itself once the tilt has settled back to (0, 0), instead of
  // running unconditionally for the component's entire mounted lifetime
  // (which would otherwise burn a frame of work forever, including while
  // the section is scrolled off-screen).
  useEffect(() => {
    const viewport = viewportRef.current;
    const wall = wallRef.current;
    if (!viewport || !wall || parallax <= 0) return;

    let raf = 0;
    let running = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const settled =
        targetX === 0 && targetY === 0 && Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01;
      if (settled) {
        currentX = 0;
        currentY = 0;
        wall.style.setProperty("--dw-parallax-x", "0deg");
        wall.style.setProperty("--dw-parallax-y", "0deg");
        running = false;
        return;
      }

      wall.style.setProperty("--dw-parallax-x", `${currentX.toFixed(3)}deg`);
      wall.style.setProperty("--dw-parallax-y", `${currentY.toFixed(3)}deg`);
      raf = requestAnimationFrame(tick);
    };

    const ensureRunning = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = viewport.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = -ny * parallax * 10;
      targetY = nx * parallax * 10;
      ensureRunning();
    };
    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      ensureRunning();
    };

    viewport.addEventListener("pointermove", handlePointerMove, { passive: true });
    viewport.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [parallax]);

  const columnItems = useMemo(() => {
    const cols: DriftWallItem[][] = Array.from({ length: sizing.columns }, () => []);
    items.forEach((item, i) => {
      cols[i % sizing.columns].push(item);
    });
    return cols;
  }, [items, sizing.columns]);

  const fadePct = Math.min(45, Math.max(0, fade * 50));

  const viewportStyle = {
    "--dw-perspective": `${perspective}px`,
    "--dw-fade-pct": `${fadePct}%`,
  } as React.CSSProperties;

  const wallStyle = {
    "--dw-tilt": `${tilt}deg`,
    "--dw-turn": `${turn}deg`,
    "--dw-dim": `${dim}`,
    "--dw-lift": `${lift}px`,
    gap: `${gap}px`,
  } as React.CSSProperties;

  return (
    <div
      ref={viewportRef}
      className={`${styles.viewport} ${className ?? ""}`}
      style={viewportStyle}
      {...aria}
    >
      <div ref={wallRef} className={styles.wall} style={wallStyle}>
        {columnItems.map((colItems, colIndex) => {
          if (colItems.length === 0) return null;

          const seed = seededRandom(colIndex + 1);
          const contentHeight = colItems.length * (sizing.tileHeight + gap);
          const durationBase = Math.max(8, contentHeight / speed);
          const duration = durationBase * (1 + (seed - 0.5) * variance);
          const columnDepth = depth * (colIndex % 2 === 0 ? 0.5 : -0.5);
          const doubled = [...colItems, ...colItems];

          const columnStyle = {
            width: `${sizing.tileWidth}px`,
            "--dw-depth": `${columnDepth}px`,
          } as React.CSSProperties;

          return (
            <div key={colIndex} className={styles.column} style={columnStyle}>
              <div
                className={`${styles.track} ${direction === "down" ? styles.trackDown : styles.trackUp}`}
                style={{ animationDuration: `${duration}s`, gap: `${gap}px` }}
              >
                {doubled.map((item, i) => {
                  const key = `${colIndex}-${i}`;
                  const tile = (
                    <div
                      className={styles.tile}
                      style={{ width: `${sizing.tileWidth}px`, height: `${sizing.tileHeight}px` }}
                    >
                      <div className={styles.tileInner}>
                        <Image
                          src={item.image}
                          alt={item.title || ""}
                          fill
                          sizes={`${sizing.tileWidth}px`}
                          className={styles.tileImage}
                        />
                      </div>
                    </div>
                  );
                  return item.href ? (
                    <a
                      key={key}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.title}
                    >
                      {tile}
                    </a>
                  ) : (
                    <div key={key}>{tile}</div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
