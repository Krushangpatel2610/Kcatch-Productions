"use client";
// components/projects/project-filters.tsx
// Category filter chips for Projects page.
// Data-driven, fully accessible.

import { cn } from "@/lib/utils";
import { type ProjectCategory, PROJECT_CATEGORIES } from "@/content/projects";
import { Button } from "@/components/ui/button";

type ProjectFiltersProps = {
  active: ProjectCategory;
  onChange: (category: ProjectCategory) => void;
};

export function ProjectFilters({ active, onChange }: ProjectFiltersProps) {
  return (
    <nav
      className="flex flex-wrap items-center gap-2 md:gap-3"
      aria-label="Filter projects by category"
      role="group"
    >
      {PROJECT_CATEGORIES.map((category) => {
        const isActive = category === active;
        return (
          <Button
            key={category}
            onClick={() => onChange(category)}
            variant={isActive ? "primary" : "outline"}
            className={cn(
              "px-4 py-2 h-auto text-xs",
              !isActive && "border-kc-white/30 hover:bg-transparent hover:border-kc-white hover:text-kc-yellow"
            )}
            aria-pressed={isActive}
            aria-label={`Filter by ${category}`}
          >
            {category}
          </Button>
        );
      })}
    </nav>
  );
}
