// components/graphics/sticker.tsx
// Reusable decorative sticker / character PNG slot.
// Creates a proper visual placeholder when the final PNG is not yet available.

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
  /** Label shown when asset is missing (dev only) */
  placeholder?: string;
};

export function Sticker({
  src,
  alt,
  width = 200,
  height = 200,
  rotation = 0,
  scale = 1,
  className,
  placeholder,
}: StickerProps) {
  const transform = `rotate(${rotation}deg) scale(${scale})`;

  if (!src) {
    // Placeholder slot — shows label in dev, transparent in prod
    return (
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full border-2 border-dashed border-kc-yellow/40 bg-kc-yellow/5 text-kc-muted text-xs font-mono",
          className
        )}
        style={{ width, height, transform }}
        aria-hidden="true"
        title={`Asset slot: ${alt}`}
      >
        <span className="p-2 text-center leading-tight opacity-60">
          {placeholder ?? alt}
        </span>
      </div>
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
