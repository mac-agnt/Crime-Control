"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type CardProps = HTMLMotionProps<"div"> & {
  interactive?: boolean;
};

export function Card({ className, interactive, children, ...props }: CardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 transition-[border-color,box-shadow] duration-200",
        interactive &&
          "cursor-pointer hover:border-ink-faint/40 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
