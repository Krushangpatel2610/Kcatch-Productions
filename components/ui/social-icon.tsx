// components/ui/social-icon.tsx
// Simple SVG social icons since lucide-react v1.45 lacks branded icons.
// Keep these clean and minimal.

import { ExternalLink } from "lucide-react";

type SocialIconProps = {
  platform: string;
  size?: number;
  className?: string;
};

export function SocialIcon({ platform, size = 20, className }: SocialIconProps) {
  // Use text labels for platforms without SVG icons available
  const normalizedPlatform = platform.toLowerCase();

  if (normalizedPlatform === "instagram") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    );
  }

  if (normalizedPlatform === "linkedin") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    );
  }

  if (normalizedPlatform === "whatsapp") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12.004 2C6.478 2 2 6.477 2 12c0 1.987.577 3.84 1.573 5.396L2.06 22l4.72-1.484A9.94 9.94 0 0 0 12.004 22C17.53 22 22 17.523 22 12S17.53 2 12.004 2zm0 18.062a8.03 8.03 0 0 1-4.334-1.27l-.311-.185-3.037.955.99-2.98-.203-.32a8.03 8.03 0 0 1-1.245-4.262c0-4.44 3.62-8.06 8.14-8.06 4.52 0 8.14 3.62 8.14 8.06 0 4.44-3.62 8.062-8.14 8.062z"/>
      </svg>
    );
  }

  if (normalizedPlatform === "email") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 6-10 7L2 6"/>
      </svg>
    );
  }

  // Fallback to generic external link
  return <ExternalLink width={size} height={size} className={className} aria-hidden="true" />;
}
