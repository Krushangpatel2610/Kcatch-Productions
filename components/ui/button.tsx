"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding font-body text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // KCATCH Primary: yellow fill, dark text
        primary:
          "bg-kc-yellow text-kc-black border-kc-yellow hover:bg-transparent hover:text-kc-yellow hover:border-kc-yellow",
        // KCATCH Outline: transparent, white border
        outline:
          "bg-transparent text-kc-white border-kc-white hover:bg-kc-white hover:text-kc-black",
        // KCATCH Dark outline: for paper sections
        "outline-dark":
          "bg-transparent text-kc-black border-kc-black hover:bg-kc-black hover:text-kc-white",
        // Ghost
        ghost:
          "bg-transparent text-kc-white hover:bg-white/10",
        // Link style
        link: "text-kc-yellow underline-offset-4 hover:underline",
        // Shadcn default (for internal use)
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "h-10 gap-2 px-6",
        sm: "h-8 gap-1.5 px-4 text-xs",
        lg: "h-14 gap-3 px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
