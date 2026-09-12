// components/graphics/torn-section.tsx
// Reusable torn paper / rough edge section transition.
// Uses an irregular SVG path (hand-torn look, not a clean wave) so that
// every dark <-> paper/yellow/white transition in the site shares one
// consistent "physical paper" edge language.

import { cn } from "@/lib/utils";

type TornVariant =
  | "dark-to-paper"
  | "paper-to-dark"
  | "yellow-to-dark"
  | "dark-to-yellow"
  | "white-to-dark"
  | "dark-to-white";

type TornPosition = "top" | "bottom" | "both";

type TornSectionProps = {
  variant?: TornVariant;
  position?: TornPosition;
  children?: React.ReactNode;
  className?: string;
};

const bgColors: Record<TornVariant, { from: string; to: string }> = {
  "dark-to-paper": { from: "#05070b", to: "#f4f1e8" },
  "paper-to-dark": { from: "#f4f1e8", to: "#05070b" },
  "yellow-to-dark": { from: "#fff000", to: "#05070b" },
  "dark-to-yellow": { from: "#05070b", to: "#fff000" },
  "white-to-dark": { from: "#ffffff", to: "#05070b" },
  "dark-to-white": { from: "#05070b", to: "#ffffff" },
};

// Irregular, hand-torn edge path — jagged amplitude variation rather than
// one smooth repeating wave, so it reads as "ripped paper" not "ribbon".
const TORN_PATH =
  "M0,6 L0,22 C22,14 38,30 58,20 C74,12 86,26 104,16 C122,6 140,24 162,14 " +
  "C178,7 190,20 208,10 C228,-1 246,18 268,9 C286,2 300,16 320,8 " +
  "C340,1 356,15 378,7 C398,0 416,14 438,6 C456,-1 470,12 490,5 " +
  "C512,-2 530,13 552,6 C572,0 588,13 610,5 C630,-2 648,12 670,6 " +
  "C690,0 706,13 728,6 C748,0 764,12 786,5 C806,-2 824,12 846,6 " +
  "C866,0 882,12 904,6 C924,0 940,12 962,6 C982,0 998,12 1020,6 " +
  "C1040,1 1056,12 1078,6 C1098,0 1114,11 1136,6 C1156,1 1172,11 1192,6 " +
  "L1200,6 L1200,0 L0,0 Z";

function TornEdge({
  flip = false,
  topColor,
  bottomColor,
}: {
  flip?: boolean;
  topColor: string;
  bottomColor: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(18px, 2.6vw, 32px)" }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        style={{ transform: flip ? "scaleY(-1)" : undefined }}
      >
        <rect width="1200" height="32" fill={topColor} />
        <path d={TORN_PATH} fill={bottomColor} transform="scale(1,1.5)" />
      </svg>
    </div>
  );
}

export function TornSection({
  variant = "dark-to-paper",
  position = "bottom",
  children,
  className,
}: TornSectionProps) {
  const { from, to } = bgColors[variant];

  return (
    <div className={cn("relative", className)}>
      {(position === "top" || position === "both") && (
        <TornEdge topColor={from} bottomColor={to} />
      )}
      {children}
      {(position === "bottom" || position === "both") && (
        <TornEdge topColor={to} bottomColor={from} flip />
      )}
    </div>
  );
}
