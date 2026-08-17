"use client";

import { cn } from "@/lib/cn";

export type ChipOption = { value: string; label: string; count?: number };

export function FilterChips({
  options,
  value,
  onChange,
}: {
  options: ChipOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              active
                ? "border-accent/40 bg-accent-soft text-accent-strong"
                : "border-border bg-surface text-ink-muted hover:text-ink hover:border-ink-faint/40"
            )}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-semibold",
                  active ? "bg-accent/15 text-accent-strong" : "bg-border-soft text-ink-faint"
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
