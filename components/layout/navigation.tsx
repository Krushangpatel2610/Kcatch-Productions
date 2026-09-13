"use client";
// components/layout/navigation.tsx
// Global KCATCH navigation.
// Desktop: Logo + nav links + LET'S TALK CTA
// Mobile: Logo + hamburger → MobileMenu

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, NAV_CTA } from "@/content/site";
import { MobileMenu } from "./mobile-menu";

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 md:h-[80px] lg:h-[96px] transition-all duration-300"
        role="banner"
      >
        {/* Gradient overlay when at the top of a dark hero; solid once scrolled
            so nav text never collides with content underneath. */}
        <div
          className={cn(
            "absolute inset-0 -z-10 pointer-events-none transition-opacity duration-300",
            scrolled ? "bg-kc-black opacity-95" : "opacity-100"
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

        {/* Logo - Left */}
        <div className="flex-1 flex justify-start">
          <Link
            href="/"
            className="font-display text-kc-white text-2xl lg:text-3xl tracking-wider hover:text-kc-yellow transition-colors focus-visible:outline-kc-yellow"
            aria-label="KCATCH — Home"
          >
            KCATCH
          </Link>
        </div>

        {/* Desktop nav - Center */}
        <nav
          className="hidden md:flex flex-1 justify-center items-center gap-10"
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

        {/* Desktop CTA - Right */}
        <div className="hidden md:flex flex-1 justify-end">
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
