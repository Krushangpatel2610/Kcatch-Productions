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
  return (
    <Comp className={cn("max-w-screen-xl mx-auto px-6 md:px-10", className)}>
      {children}
    </Comp>
  );
}
