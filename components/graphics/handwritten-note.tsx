// components/graphics/handwritten-note.tsx
// Reusable handwritten annotation component.
// Uses the hand font token for editorial annotations.

import { cn } from "@/lib/utils";

type HandwrittenNoteProps = {
  text: string;
  rotation?: number;
  size?: "sm" | "md" | "lg";
  color?: "white" | "yellow" | "dark";
  className?: string;
};

const sizeMap = {
  sm: "text-base md:text-lg",
  md: "text-xl md:text-2xl",
  lg: "text-2xl md:text-4xl",
};

const colorMap = {
  white: "text-kc-white",
  yellow: "text-kc-yellow",
  dark: "text-kc-black",
};

export function HandwrittenNote({
  text,
  rotation = 0,
  size = "md",
  color = "white",
  className,
}: HandwrittenNoteProps) {
  return (
    <p
      className={cn(
        "font-hand leading-tight whitespace-pre-line",
        sizeMap[size],
        colorMap[color],
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {text}
    </p>
  );
}
