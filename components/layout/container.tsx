// components/layout/container.tsx
// Shared page/section container.
// Centralizes max-width + gutter so no section invents its own spacing system.

import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  const Comp = Tag as React.ElementType;
  // Max-width/gutters match kcatch-media's container convention
  // (mx-auto max-w-[1600px] px-5 md:px-10).
  return (
    <Comp className={cn("max-w-[1600px] mx-auto px-5 md:px-10", className)}>
      {children}
    </Comp>
  );
}
