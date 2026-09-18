"use client";
// components/layout/navigation.tsx
// Global KCATCH navigation.
// Desktop: Logo + nav links + LET'S TALK CTA
// Mobile: Logo + hamburger → MobileMenu

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { NAV_LINKS, NAV_CTA } from "@/content/site";
import { MobileMenu } from "./mobile-menu";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { onPreloaderDone } from "@/lib/motion/preloader-gate";

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // The nav is fixed for the whole page, but its "over a dark hero" gradient
  // fades to transparent at the bottom — once the user scrolls past the
  // hero, content underneath (e.g. office cards, light paper sections)
  // would otherwise bleed through the nav text. Solidify the nav once
  // scrolled so it always stays legible.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Nav entrance is part of the same opening moment as the Hero's own
  // content — hidden immediately (so it isn't sitting fully visible on
  // top of the preloader curtain, which the nav's own z-50 would
  // otherwise be able to do since the preloader is z-100 but visually
  // the nav has nothing to hide behind), then dropped/faded in once the
  // preloader signals it's exiting (see lib/motion/preloader-gate.ts),
  // in step with the Hero's entrance rather than as a separate moment.
  // Nav entrance: the header is pre-hidden via inline style on the JSX
  // element (see below) — invisible from the server's first byte of HTML.
  // This effect only handles the REVEAL once the preloader is done.
  // The old approach used gsap.set() here to hide it, which raced against
  // the browser's first paint and caused a visible flash.
  useEffect(() => {
    if (prefersReducedMotion() || !headerRef.current) return;
    return onPreloaderDone(() => {
      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.2,
      });
    });
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 md:h-[80px] lg:h-[96px] transition-all duration-300"
        role="banner"
        style={{ opacity: 0, transform: "translateY(-16px)" }}
      >
        {/* Gradient overlay when at the top of a dark hero; solid once scrolled
            so nav text never collides with content underneath. */}
        <div
          className={cn(
            "absolute inset-0 -z-10 pointer-events-none transition-colors duration-300",
            // Fully opaque once scrolled — a 95%-opaque backdrop was
            // letting a faint ghost of the sticky Hero content (its own
            // giant headline, dimmed to a near-black silhouette) bleed
            // through behind the nav at some scroll positions.
            scrolled && "bg-kc-black"
          )}
          style={
            scrolled
              ? undefined
              : {
                  background:
                    "linear-gradient(to bottom, rgba(5,7,11,0.9) 0%, rgba(5,7,11,0.4) 50%, transparent 100%)",
                }
          }
          aria-hidden="true"
        />

        {/* Logo - Left — the real KCATCH lockup asset (public/Images/logo/
            Kcatch-logo.png), not a text substitute; it already carries
            its own black badge background so it reads cleanly against
            both the transparent-gradient and solid-black nav states.
            Sized to actually read as the brand mark (roughly matching
            the nav bar's own height at each breakpoint, not a small
            corner icon), and vertically centered via the header's own
            items-center rather than a fixed top offset, so it stays
            correctly positioned as the nav's height itself changes
            across breakpoints (h-16 / md:h-[80px] / lg:h-[96px]). */}
        <div className="flex-1 flex justify-start">
          <Link
            href="/"
            className="relative block h-10 w-[130px] md:h-14 md:w-[182px] lg:h-16 lg:w-[208px] transition-opacity hover:opacity-80 focus-visible:outline-kc-yellow"
            aria-label="KCATCH — Home"
          >
            <Image
              src="/Images/logo/Kcatch-logo.png"
              alt="KCATCH"
              fill
              priority
              sizes="(min-width: 1024px) 208px, (min-width: 768px) 182px, 130px"
              className="object-contain object-left"
            />
          </Link>
        </div>

        {/* Desktop Nav + CTA - Right */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-10">
          <nav
            className="flex items-center gap-10"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-body text-xs uppercase tracking-widest transition-all duration-300 relative group py-2 focus-visible:outline-kc-yellow",
                    isActive
                      ? "text-kc-yellow"
                      : "text-kc-white hover:text-kc-yellow"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-kc-yellow transition-all duration-300",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              );
            })}
          </nav>

          <Link
            href={NAV_CTA.href}
            className="inline-flex items-center gap-2 border border-kc-yellow bg-kc-black text-kc-yellow font-body text-[10px] md:text-xs uppercase tracking-widest px-5 py-2 hover:bg-kc-yellow hover:text-kc-black transition-all duration-300 focus-visible:outline-kc-yellow group rounded-none"
          >
            {NAV_CTA.label}
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-1 font-sans"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex-1 flex justify-end">
          <button
            className="text-kc-white hover:text-kc-yellow transition-colors focus-visible:outline-kc-yellow p-2 -mr-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currentPath={pathname}
      />
    </>
  );
}
