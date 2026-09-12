"use client";
// components/motion/masked-text.tsx
// Line-mask text reveal component.
// Each line is wrapped in a clip container.
// GSAP can later animate yPercent to reveal lines from below.

import { cn } from "@/lib/utils";

type MaskedTextProps = {
  text: string;
  className?: string;
  lineClassName?: string;
  /** Split on newlines if true, otherwise treat as single line */
  multiline?: boolean;
};

export function MaskedText({
  text,
  className,
  lineClassName,
  multiline = false,
}: MaskedTextProps) {
  const lines = multiline ? text.split("\n") : [text];

  return (
    <span className={cn("flex flex-col", className)} aria-label={text}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="overflow-hidden"
          aria-hidden="true"
        >
          <span
            className={cn(
              "block",
              // GSAP will animate translateY on this inner element
              "data-[masked='true']:translate-y-full",
              lineClassName
            )}
            data-masked="false"
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
