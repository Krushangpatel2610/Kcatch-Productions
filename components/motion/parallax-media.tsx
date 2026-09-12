"use client";
// components/motion/parallax-media.tsx
// Image container with parallax depth data attributes.
// GSAP will later read data-parallax-depth to apply scroll translation.

import { KcatchImage } from "@/components/ui/kcatch-image";
import { cn } from "@/lib/utils";

type ParallaxMediaProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  depth?: number; // -1 (far) to 1 (near) — controls parallax amount
  objectPosition?: string;
  overlay?: boolean;
  overlayColor?: string;
  className?: string;
  wrapperClassName?: string;
};

export function ParallaxMedia({
  src,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  depth = 0,
  objectPosition = "center",
  overlay = false,
  overlayColor = "rgba(5,7,11,0.4)",
  className,
  wrapperClassName,
}: ParallaxMediaProps) {
  return (
    <div
      className={cn("relative overflow-hidden", wrapperClassName)}
      data-parallax
      data-parallax-depth={depth}
    >
      {fill ? (
        <KcatchImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={cn("object-cover", className)}
          sizes="100vw"
          objectPosition={objectPosition}
        />
      ) : (
        <KcatchImage
          src={src}
          alt={alt}
          width={width ?? 800}
          height={height ?? 600}
          priority={priority}
          className={cn("object-cover w-full h-full", className)}
          objectPosition={objectPosition}
        />
      )}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{ background: overlayColor }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
