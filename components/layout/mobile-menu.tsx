"use client";
// components/layout/mobile-menu.tsx
// Full-overlay mobile navigation menu.
// Accessible: traps focus, closes on Escape, uses role="dialog".

import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_LINKS, NAV_CTA } from "@/content/site";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  currentPath: string;
};

export function MobileMenu({ open, onClose, currentPath }: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="top"
        showCloseButton={true}
        className="fixed inset-0 h-[100dvh] w-full z-[60] flex flex-col bg-kc-black border-none px-0 py-0 overflow-y-auto sm:max-w-none data-[side=top]:sm:max-w-none"
        aria-label="Navigation menu"
      >
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
        
        {/* Header row */}
        <div className="flex items-center justify-between px-6 py-4 absolute top-0 left-0 right-0 z-10">
          <Link
            href="/"
            className="font-display text-kc-white text-xl tracking-wider hover:text-kc-yellow transition-colors focus-visible:outline-kc-yellow"
            onClick={onClose}
            aria-label="KCATCH — Home"
          >
            KCATCH
          </Link>
        </div>

        {/* Nav links */}
        <nav
          className="flex flex-col gap-0 mt-20 px-6"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link, i) => {
            const isActive =
              link.href === "/"
                ? currentPath === "/"
                : currentPath.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "font-display text-5xl uppercase py-4 border-b border-kc-line transition-[color,opacity,transform] duration-500 ease-out hover:text-kc-yellow focus-visible:outline-kc-yellow",
                  isActive ? "text-kc-yellow" : "text-kc-white",
                  open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                aria-current={isActive ? "page" : undefined}
                style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile CTA */}
        <div
          className={cn(
            "mt-10 px-6 transition-[opacity,transform] duration-500 ease-out",
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: open ? `${120 + NAV_LINKS.length * 70}ms` : "0ms" }}
        >
          <Link
            href={NAV_CTA.href}
            onClick={onClose}
            className="inline-flex items-center gap-3 bg-kc-yellow text-kc-black font-body text-sm uppercase tracking-widest px-8 py-4 hover:bg-transparent hover:text-kc-yellow hover:border-kc-yellow border border-kc-yellow transition-all duration-300 focus-visible:outline-kc-yellow"
          >
            {NAV_CTA.label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Decorative sticker slot */}
        <div className="absolute bottom-10 right-6 opacity-20" aria-hidden="true">
          <div className="font-display text-kc-yellow text-6xl select-none">★</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
