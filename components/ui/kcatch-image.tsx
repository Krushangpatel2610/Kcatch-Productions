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
        sizes={sizes}
        quality={quality}
        style={objectPosition ? { objectPosition } : undefined}
      />
    );
  }

  // Fallback state — an intentional, visually-present placeholder (never
  // near-invisible). A flat 10%-opacity black used to read as blank empty
  // space on a dark section background (that's exactly what was showing
  // up as unexplained empty area in the Contact polaroids) — a light
  // textured surface with a visible icon reads clearly as "an image slot"
  // on both dark and light section backgrounds.
  return (
    <div
      className={cn(
        "bg-kc-paper/90 flex items-center justify-center overflow-hidden border border-kc-black/15",
        fill && "absolute inset-0 w-full h-full",
        className
      )}
      style={!fill ? { width, height } : undefined}
      aria-label={`Placeholder for: ${alt}`}
    >
      <Camera size={24} className="text-kc-black/30" aria-hidden="true" />
    </div>
  );
}
