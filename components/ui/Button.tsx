"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";
import { springSnappy } from "@/lib/motion";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "invert"
  | "invert-ghost"
  | "danger-outline";
type Size = "sm" | "md";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

const variantClass: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-strong shadow-sm shadow-black/5",
  secondary:
    "bg-surface text-ink border border-border hover:bg-surface-raised hover:border-ink-faint/40",
  ghost: "text-ink-muted hover:text-ink hover:bg-border-soft",
  invert: "bg-white text-accent-ink hover:bg-white/90 shadow-sm shadow-black/10",
  "invert-ghost": "text-accent-ink/85 border border-accent-ink/25 hover:bg-accent-ink/10 hover:text-accent-ink",
  "danger-outline": "border border-danger/30 text-danger bg-transparent hover:bg-danger/10",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
      className={cn(
        "inline-flex items-center justify-center rounded-[10px] font-medium transition-colors duration-150 select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
