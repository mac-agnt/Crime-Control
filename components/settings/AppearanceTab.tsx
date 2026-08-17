"use client";

import { motion } from "framer-motion";
import { Check, MoonStars, SunDim, DeviceMobile } from "@phosphor-icons/react";
import { fadeUp, ease } from "@/lib/motion";
import { useTheme } from "../ThemeProvider";
import clsx from "clsx";

const options = [
  { id: "light", label: "Light", icon: SunDim },
  { id: "dark", label: "Dark", icon: MoonStars },
  { id: "system", label: "System", icon: DeviceMobile },
] as const;

export function AppearanceTab() {
  const { theme, toggle } = useTheme();

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.25, ease }}
      className="flex flex-col gap-6"
    >
      <div>
        <p className="text-[13px] font-medium text-ink">Theme</p>
        <p className="mt-0.5 text-[12px] text-ink-faint">
          Choose how Northbeam looks on this device.
        </p>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isActive =
              opt.id === "system" ? false : opt.id === theme;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  if (opt.id === "system") return;
                  if (opt.id !== theme) toggle();
                }}
                className={clsx(
                  "relative flex flex-col items-center gap-2 rounded-[12px] border px-3 py-4 transition-colors",
                  isActive
                    ? "border-accent bg-accent-soft text-accent-strong"
                    : "border-border text-ink-muted hover:border-ink-faint/40 hover:text-ink"
                )}
              >
                {isActive && (
                  <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-accent text-accent-ink">
                    <Check size={10} weight="bold" />
                  </span>
                )}
                <Icon size={20} weight={isActive ? "fill" : "regular"} />
                <span className="text-[12.5px] font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[12px] border border-border-soft bg-bg p-4">
        <p className="text-[12.5px] font-medium text-ink">Accent preview</p>
        <div className="mt-3 flex items-center gap-2">
          {["bg-accent", "bg-success", "bg-warning", "bg-danger"].map((c) => (
            <span key={c} className={clsx("size-7 rounded-full", c)} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
