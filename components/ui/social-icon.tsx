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

  if (normalizedPlatform === "youtube") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.42z"/>
        <polygon fill="currentColor" stroke="none" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
      </svg>
    );
  }

  if (normalizedPlatform === "x" || normalizedPlatform === "twitter") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }

  if (normalizedPlatform === "behance") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M7.799 5.698c.589 0 1.12.051 1.606.156.482.103.895.273 1.241.507.344.235.612.543.802.918.19.377.284.843.284 1.399 0 .6-.139 1.1-.418 1.502-.276.399-.686.734-1.221.995.73.214 1.275.59 1.635 1.127.362.537.544 1.183.544 1.938 0 .63-.116 1.174-.349 1.635-.236.46-.56.84-.972 1.14-.413.3-.893.521-1.437.661-.544.14-1.105.211-1.682.211H1V5.698h6.799zm-.421 4.833c.484 0 .877-.114 1.178-.342.302-.228.453-.578.453-1.048 0-.27-.051-.491-.151-.664-.099-.173-.236-.308-.41-.407-.174-.099-.376-.168-.604-.206-.228-.038-.47-.057-.727-.057H3.71v2.724h3.668zm.186 5.036c.289 0 .562-.028.818-.084.258-.056.483-.149.676-.277.194-.128.348-.301.462-.516.114-.215.17-.483.17-.802 0-.644-.178-1.099-.537-1.364-.358-.265-.834-.397-1.428-.397H3.71v3.44h3.854zM15.999 16.918c.48.467 1.171.7 2.074.7.645 0 1.203-.162 1.672-.484.468-.323.755-.666.862-1.029h2.498c-.398 1.235-1.012 2.117-1.842 2.65-.829.533-1.833.8-3.01.8-.817 0-1.555-.13-2.214-.392-.659-.26-1.219-.634-1.681-1.12-.461-.487-.816-1.065-1.066-1.735-.249-.671-.374-1.401-.374-2.194 0-.769.128-1.485.384-2.148.256-.663.617-1.236 1.083-1.72.466-.483 1.026-.862 1.681-1.134.656-.271 1.381-.407 2.177-.407.887 0 1.668.172 2.341.516.671.344 1.225.81 1.659 1.399.434.589.748 1.266.942 2.029.195.762.26 1.567.196 2.413h-7.46c.042.934.302 1.589.782 2.055zm3.616-5.476c-.385-.424-.973-.636-1.763-.636-.502 0-.92.088-1.254.263-.334.175-.602.392-.804.65-.203.257-.346.532-.43.825-.083.293-.132.566-.146.817h5.12c-.118-.83-.339-1.496-.723-1.919zm-5.58-4.41h5.584V5.698h-5.583v1.334z"/>
      </svg>
    );
  }

  // Fallback to generic external link
  return <ExternalLink width={size} height={size} className={className} aria-hidden="true" />;
}
