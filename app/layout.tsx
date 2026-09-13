import type { Metadata } from "next";
import { Bebas_Neue, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { Preloader } from "@/components/motion/preloader";
import { CustomCursor } from "@/components/motion/custom-cursor";

// ---------------------------------------------------------------------------
// Font loading — tokenized so they can be swapped for official KCATCH fonts
// ---------------------------------------------------------------------------
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
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
      className={`${bebasNeue.variable} ${inter.variable} ${caveat.variable} h-full`}
    >
      <body suppressHydrationWarning className="bg-kc-black text-kc-white antialiased overflow-x-hidden">
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
