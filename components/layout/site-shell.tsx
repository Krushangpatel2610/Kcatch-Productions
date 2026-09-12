// components/layout/site-shell.tsx
// Global site shell wrapping all pages.
// Includes navigation and footer.
// SmoothScrollProvider is loaded separately in layout.tsx.

import { Navigation } from "./navigation";
import { Footer } from "./footer";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-kc-black">
      <Navigation />
      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
