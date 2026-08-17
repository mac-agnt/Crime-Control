"use client";

import { motion } from "framer-motion";
import { fadeUp, ease } from "@/lib/motion";
import { allNav } from "@/lib/nav";

export function TestPage({ slug, label }: { slug: string; label: string }) {
  const Icon = allNav.find((item) => item.slug === slug)?.icon;
  if (!Icon) return null;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.35, ease }}
      className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-20 text-center"
    >
      <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
        <Icon size={28} weight="fill" />
        <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-ink ring-4 ring-surface">
          {label.charAt(0)}
        </span>
      </div>
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-faint">
        {label}
      </p>
      <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">
        Test
      </h1>
      <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-ink-muted">
        This section is a placeholder. The {label.toLowerCase()} view will live here.
      </p>
    </motion.div>
  );
}
