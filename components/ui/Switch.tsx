"use client";

import { motion } from "framer-motion";
import { springSnappy } from "@/lib/motion";
import clsx from "clsx";

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200",
        checked ? "bg-accent" : "bg-border"
      )}
    >
      <motion.span
        animate={{ left: checked ? 18 : 2 }}
        transition={springSnappy}
        className="absolute top-0.5 size-5 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}
