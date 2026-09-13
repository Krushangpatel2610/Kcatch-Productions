import Image from "next/image";
import { cn } from "@/lib/utils";
import { assetManifest } from "@/lib/asset-manifest";
import { Camera } from "lucide-react";

type KcatchImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  objectPosition?: string;
  /**
   * Optional large watermark shown behind the camera glyph on the missing-
   * asset placeholder (e.g. a project number). Turns a generic "no image"
   * box into a frame that looks like it belongs to a specific piece of
   * work awaiting its real photo, not an anonymous broken slot.
   */
  placeholderLabel?: string;
};

/**
 * Reusable image component that handles missing assets gracefully.
 * If the image exists in public/, it renders Next.js Image.
 * If not, it renders a silent KCATCH-styled placeholder — never a visible
 * development label (client name, "SUPPORTING", etc.) in the rendered UI.
 */
export function KcatchImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
  quality,
  objectPosition,
  placeholderLabel,
}: KcatchImageProps) {
  // Check if the asset actually exists in the public directory
  const imageExists = assetManifest.has(src);

  if (imageExists) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={className}
        priority={priority}
        // A fill image needs a sizes hint or Next.js assumes 100vw and
        // over-fetches on large screens; every current fill usage sits
        // in a constrained column/frame, not the full viewport, so this
        // default is a reasonable one and callers can still override it.
        sizes={sizes ?? (fill ? "(min-width: 1024px) 50vw, 100vw" : undefined)}
        quality={quality}
        style={objectPosition ? { objectPosition } : undefined}
      />
    );
  }

  // Fallback state — a deliberately "editorial frame awaiting the real
  // photo" rather than a generic gray/cream box: a fine diagonal hatch
  // (reads as a print/proof sheet, not a broken-image glyph), an optional
  // oversized number watermark for context, and the camera icon kept
  // small and secondary. Works on both dark and light section
  // backgrounds since the hatch/icon use currentColor-independent
  // opacity over the paper tone rather than relying on a border alone.
  return (
    <div
      className={cn(
        "relative bg-kc-paper/90 flex items-center justify-center overflow-hidden border border-kc-black/15",
        fill && "absolute inset-0 w-full h-full",
        className
      )}
      style={!fill ? { width, height } : undefined}
      aria-label={`Placeholder for: ${alt}`}
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #000 0, #000 1px, transparent 1px, transparent 10px)",
        }}
        aria-hidden="true"
      />
      {placeholderLabel && (
        <span
          className="absolute inset-0 flex items-center justify-center font-display text-kc-black/[0.07] uppercase leading-none select-none"
          style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
          aria-hidden="true"
        >
          {placeholderLabel}
        </span>
      )}
      <Camera size={22} className="relative text-kc-black/25" aria-hidden="true" />
    </div>
  );
}
