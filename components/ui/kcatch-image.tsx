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
  // A subtle text label to display on the placeholder
  placeholderLabel?: string;
};

/**
 * Reusable image component that handles missing assets gracefully.
 * If the image exists in public/, it renders Next.js Image.
 * If not, it renders a deliberate KCATCH aesthetic placeholder.
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
        sizes={sizes}
        quality={quality}
        style={objectPosition ? { objectPosition } : undefined}
      />
    );
  }

  // Fallback state
  return (
    <div
      className={cn(
        "bg-kc-black/10 flex flex-col items-center justify-center overflow-hidden border border-kc-black/10",
        fill && "absolute inset-0 w-full h-full",
        className
      )}
      style={!fill ? { width, height } : undefined}
      aria-label={`Placeholder for: ${alt}`}
    >
      <div className="flex flex-col items-center gap-2 opacity-30">
        <Camera size={24} aria-hidden="true" />
        <span className="font-display text-xs uppercase tracking-widest text-center px-4">
          {placeholderLabel || alt || "Asset pending"}
        </span>
      </div>
    </div>
  );
}
