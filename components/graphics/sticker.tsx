// components/graphics/sticker.tsx
// Reusable decorative sticker / character PNG slot.
// Renders a clean, silent visual placeholder when the final PNG is not
// yet available — never exposes implementation labels like
// "CHARACTER STICKER" in the rendered UI.

import Image from "next/image";
import { cn } from "@/lib/utils";

type StickerProps = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  rotation?: number;
  scale?: number;
  className?: string;
};

export function Sticker({
  src,
  alt,
  width = 200,
  height = 200,
  rotation = 0,
  scale = 1,
  className,
}: StickerProps) {
  const transform = `rotate(${rotation}deg) scale(${scale})`;

  if (!src) {
    // Silent placeholder slot — a plain dashed mark, no visible text.
    // Keeps the composition's spacing/rotation intact without exposing
    // a development label in the rendered page.
    return (
      <div
        className={cn(
          "relative rounded-full border-2 border-dashed border-kc-yellow/30",
          className
        )}
        style={{ width, height, transform }}
        aria-hidden="true"
        title={`Asset slot: ${alt}`}
      />
    );
  }

  return (
    <div
      className={cn("relative", className)}
      style={{ width, height, transform }}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain"
        loading="lazy"
      />
    </div>
  );
}
