"use client";

import { motion } from "framer-motion";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type TabOption = { value: string; label: string };

export function Tabs({
  options,
  value,
  onChange,
  id = "tabs",
}: {
  options: TabOption[];
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-[12px] border border-border bg-bg p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative rounded-[9px] px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              active ? "text-accent-strong" : "text-ink-muted hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId={`${id}-active`}
                className="absolute inset-0 rounded-[9px] bg-surface shadow-[0_1px_0_rgba(15,23,42,0.04)]"
                transition={springSoft}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
