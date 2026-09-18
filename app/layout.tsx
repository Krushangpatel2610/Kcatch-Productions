import type { Metadata } from "next";
import { Anton, Archivo, Caveat } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { Preloader } from "@/components/motion/preloader";
import { CustomCursor } from "@/components/motion/custom-cursor";

// ---------------------------------------------------------------------------
// Font loading — matches kcatch-media's global visual language (Anton +
// Archivo). Caveat is kept as-is for the handwritten accent (Preloader's
// "the damn eye." line) since kcatch-media has no equivalent hand font.
// ---------------------------------------------------------------------------
const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

// ---------------------------------------------------------------------------
// Root metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: {
    default: "KCATCH Media | KCATCH THE DAMN EYE",
    template: "%s | KCATCH Media",
  },
  description:
    "KCATCH Media is a precision-driven attention studio combining brand strategy, content production, campaigns and cultural influence to make brands unmissable.",
  keywords: ["KCATCH", "creative agency", "brand strategy", "content production", "campaigns", "India"],
  openGraph: {
    siteName: "KCATCH Media",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${archivo.variable} ${caveat.variable} h-full`}
    >
      {/* overflow-x-clip, not overflow-x-hidden: setting only one overflow
          axis makes the browser auto-compute the other axis to `auto`,
          silently turning <body> into its own scroll container. That then
          becomes the "nearest scrolling ancestor" for any position:sticky
          descendant (e.g. HeroSection's inner sticky wrapper), which can
          make its stick/release point diverge from the true viewport and
          show up as an extra gap before the next section. `clip` blocks
          horizontal overflow the same way without establishing a scroll
          container. */}
      <body suppressHydrationWarning className="bg-kc-black text-kc-white antialiased overflow-x-clip">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] bg-kc-yellow text-kc-black px-4 py-2 text-sm font-bold uppercase tracking-widest"
        >
          Skip to main content
        </a>
        <Preloader />
        <CustomCursor />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
