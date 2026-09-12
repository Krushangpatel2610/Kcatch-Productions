// components/contact/social-links.tsx
// Reusable social links component.
// Data from content/site.ts.

import { SOCIAL_LINKS } from "@/content/site";
import { SocialIcon } from "@/components/ui/social-icon";

type SocialLinksProps = {
  size?: number;
  className?: string;
};

export function SocialLinks({ size = 22, className }: SocialLinksProps) {
  return (
    <nav
      className={className}
      aria-label="KCATCH social media links"
    >
      <div className="flex items-center gap-5" role="list">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.platform}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-kc-muted hover:text-kc-yellow transition-colors focus-visible:outline-kc-yellow"
            aria-label={social.platform}
            role="listitem"
          >
            <SocialIcon platform={social.platform} size={size} />
          </a>
        ))}
      </div>
    </nav>
  );
}
