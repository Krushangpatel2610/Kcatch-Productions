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
      {/* fill + object-contain, not fixed width/height on the Image
          itself: these sticker PNGs are not square (e.g. the mascot is
          1157x1359, the loudspeaker 1536x1024), so declaring an
          identical width/height on the Image element itself claimed an
          aspect ratio the source file doesn't actually have — that's
          what triggered next/image's "width or height modified, but
          not the other" warning. The box (this wrapper) is the fixed
          width/height slot the composition wants; fill lets the image
          size itself to that box while object-contain preserves its
          own real proportions inside it. */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${width}px`}
        className="object-contain"
        loading="lazy"
      />
    </div>
  );
}
