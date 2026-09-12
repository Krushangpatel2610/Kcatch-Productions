"use client";
// components/contact/need-selector.tsx
// Need chip selector for contact form.
// Accessible multi-select chips.

import { cn } from "@/lib/utils";
import { NEED_OPTIONS } from "@/content/contact";

type NeedSelectorProps = {
  selected: string[];
  onChange: (id: string) => void;
};

export function NeedSelector({ selected, onChange }: NeedSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Select what you need">
      {NEED_OPTIONS.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "font-body text-xs px-4 py-2 border transition-all duration-200 focus-visible:outline-kc-yellow",
              isSelected
                ? "bg-kc-yellow text-kc-black border-kc-yellow"
                : "bg-transparent text-kc-black border-kc-black/30 hover:border-kc-black"
            )}
            aria-pressed={isSelected}
            aria-label={`${isSelected ? "Deselect" : "Select"} ${option.label}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
