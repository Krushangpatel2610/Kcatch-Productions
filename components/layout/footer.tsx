// components/layout/footer.tsx
// Global KCATCH footer — server component.

import Link from "next/link";
import { NAV_LINKS, FOOTER, SOCIAL_LINKS } from "@/content/site";
import { SocialIcon } from "@/components/ui/social-icon";
import { Checkerboard } from "@/components/graphics/checkerboard";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="bg-kc-black border-t border-kc-line" role="contentinfo">
      {/* Checkerboard divider */}
      <Checkerboard
        height="xs"
        density="tight"
        colorA="#ffffff"
        colorB="#000000"
      />

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-display text-kc-white text-2xl tracking-wider hover:text-kc-yellow transition-colors block mb-2"
              aria-label="KCATCH — Home"
            >
              KCATCH
            </Link>
            <p className="font-body text-kc-muted text-xs uppercase tracking-widest">
              {FOOTER.locations.join(" | ")}
            </p>
          </div>

          {/* Nav column */}
          <nav className="md:col-span-1" aria-label="Footer navigation">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-xs uppercase tracking-widest text-kc-muted hover:text-kc-yellow transition-colors focus-visible:outline-kc-yellow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social column */}
          <div className="md:col-span-1">
            <p className="font-body text-xs uppercase tracking-widest text-kc-muted mb-4">
              Find us on
            </p>
            <div
              className="flex items-center gap-4"
              role="list"
              aria-label="Social media links"
            >
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
                  <SocialIcon platform={social.platform} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Brand tagline column */}
          <div className="md:col-span-1 md:text-right">
            <p className="font-display text-kc-white text-sm uppercase tracking-wider">
              {FOOTER.legalName}
            </p>
            <p className="font-body text-kc-muted text-xs uppercase tracking-widest mt-1">
              {FOOTER.tagline}
            </p>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-10 pt-6 border-t border-kc-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-body text-kc-muted text-xs">
            © {FOOTER.year} KCATCH. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="font-body text-kc-muted text-xs uppercase tracking-widest hover:text-kc-white transition-colors focus-visible:outline-kc-yellow"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
