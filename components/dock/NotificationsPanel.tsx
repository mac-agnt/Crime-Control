"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle } from "@phosphor-icons/react";
import { ease, staggerContainer } from "@/lib/motion";
import { notifications } from "@/lib/notifications";
import { PushNotificationRow } from "@/components/notifications/PushNotificationRow";

export function NotificationsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.22, ease }}
          className="fixed bottom-24 right-4 z-[60] flex max-h-[70vh] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_28px_70px_-20px_rgba(15,23,42,0.4)] sm:right-6"
        >
          <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
            <p className="text-[13.5px] font-semibold text-ink">Notifications</p>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-strong">
              {unreadCount} new
            </span>
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="ml-auto flex size-8 items-center justify-center rounded-[8px] text-ink-faint hover:bg-border-soft hover:text-ink"
            >
              <X size={15} />
            </button>
          </div>

          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="show"
            className="flex-1 space-y-1.5 overflow-y-auto p-2"
          >
            {notifications.map((n) => (
              <PushNotificationRow key={n.id} notification={n} />
            ))}
          </motion.div>

          <div className="shrink-0 border-t border-border p-2">
            <button className="flex w-full items-center justify-center gap-1.5 rounded-[10px] py-2 text-[12.5px] font-medium text-ink-muted transition-colors hover:bg-border-soft hover:text-ink">
              <CheckCircle size={14} />
              Mark all as read
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
