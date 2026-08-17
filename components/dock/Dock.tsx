"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell } from "@phosphor-icons/react";
import { springSnappy } from "@/lib/motion";
import { NotificationsPanel } from "./NotificationsPanel";
import clsx from "clsx";

export function Dock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NotificationsPanel open={open} onClose={() => setOpen(false)} />

      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <motion.button
          whileTap={{ scale: 0.94 }}
          whileHover={{ y: -2 }}
          transition={springSnappy}
          onClick={() => setOpen((v) => !v)}
          aria-label="Notifications"
          className={clsx(
            "relative flex h-11 items-center gap-2 rounded-full border pl-3 pr-3.5 text-[13px] font-medium shadow-[0_10px_30px_-12px_rgba(15,23,42,0.35)] backdrop-blur-md transition-colors",
            open
              ? "border-accent/40 bg-accent-soft text-accent-strong"
              : "border-border bg-surface/95 text-ink-muted hover:text-ink"
          )}
        >
          <span className="relative flex">
            <Bell size={17} weight={open ? "fill" : "regular"} />
            <span className="absolute -right-1 -top-1 flex size-2.5 items-center justify-center rounded-full bg-danger ring-2 ring-surface" />
          </span>
          <span className="hidden sm:inline">Updates</span>
        </motion.button>
      </div>
    </>
  );
}
