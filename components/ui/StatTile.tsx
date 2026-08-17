"use client";

import { motion } from "framer-motion";
import type { Icon } from "@phosphor-icons/react";
import { Card } from "./Card";
import { fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Tone = "accent" | "success" | "warning" | "danger" | "neutral";

const iconTone: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent-strong",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  neutral: "bg-border-soft text-ink-muted",
};

const valueTone: Record<Tone, string> = {
  accent: "text-ink",
  success: "text-ink",
  warning: "text-ink",
  danger: "text-danger",
  neutral: "text-ink",
};

export function StatTile({
  icon: IconCmp,
  label,
  value,
  hint,
  tone = "accent",
  index = 0,
}: {
  icon: Icon;
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
  index?: number;
}) {
  return (
    <motion.div variants={fadeUp} transition={{ duration: 0.35, ease }}>
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className={cn("flex size-9 items-center justify-center rounded-[10px]", iconTone[tone])}>
            <IconCmp size={17} weight="fill" />
          </span>
        </div>
        <div>
          <p className={cn("text-2xl font-semibold tracking-tight", valueTone[tone])}>{value}</p>
          <p className="mt-0.5 text-[12.5px] text-ink-faint">{label}</p>
          {hint && <p className="mt-1 text-[12px] font-medium text-ink-muted">{hint}</p>}
        </div>
      </Card>
    </motion.div>
  );
}
