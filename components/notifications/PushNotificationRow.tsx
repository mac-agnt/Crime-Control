"use client";

import { motion } from "framer-motion";
import { AppLogo } from "@/components/icons/AppLogo";
import type { PushNotification } from "@/lib/notifications";
import { fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function PushNotificationRow({
  notification,
  dense = false,
}: {
  notification: PushNotification;
  dense?: boolean;
}) {
  return (
    <motion.button
      variants={fadeUp}
      transition={{ duration: 0.22, ease }}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border px-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors",
        dense ? "py-2.5" : "py-3",
        notification.unread
          ? "border-border bg-bg hover:border-ink-faint/30"
          : "border-transparent hover:bg-border-soft/70"
      )}
    >
      <span className="relative mt-0.5 shrink-0">
        <AppLogo app={notification.app} size={dense ? 34 : 38} />
        {notification.unread && (
          <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-accent ring-2 ring-surface" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            {notification.appLabel}
          </span>
          <span className="shrink-0 text-[11px] text-ink-faint">{notification.time}</span>
        </span>
        <span className="mt-0.5 block truncate text-[13px] font-semibold text-ink">
          {notification.title}
        </span>
        <span className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-ink-muted">
          {notification.detail}
        </span>
      </span>
    </motion.button>
  );
}
