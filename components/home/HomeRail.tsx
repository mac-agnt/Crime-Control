"use client";

import { motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import { Card } from "../ui/Card";
import { PushNotificationRow } from "../notifications/PushNotificationRow";
import { notifications } from "@/lib/notifications";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const schedule = [
  {
    start: "09:30",
    end: "10:00",
    title: "Growth team standup",
    subtitle: "Daily sync",
    tone: "accent" as const,
    current: true,
  },
  {
    start: "11:00",
    end: "12:00",
    title: "Client sync — Northwind",
    subtitle: "Project review",
    tone: "warning" as const,
    current: false,
  },
  {
    start: "14:00",
    end: "15:00",
    title: "Product review",
    subtitle: "Roadmap & priorities",
    tone: "success" as const,
    current: false,
  },
];

const projects = [
  { name: "Northwind Redesign", progress: 68, tone: "accent" as const },
  { name: "Dashboard Revamp", progress: 42, tone: "warning" as const },
  { name: "Q3 Growth Campaign", progress: 75, tone: "success" as const },
];

const toneBar: Record<"accent" | "warning" | "success", string> = {
  accent: "bg-accent",
  warning: "bg-warning",
  success: "bg-success",
};

const toneDot: Record<"accent" | "warning" | "success", string> = {
  accent: "bg-accent",
  warning: "bg-warning",
  success: "bg-success",
};

export function HomeRail() {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4"
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.3, ease }}>
        <Card className="p-0">
          <div className="flex items-center justify-between px-5 pt-4 pb-1">
            <h2 className="text-[14.5px] font-semibold text-ink">Today</h2>
            <button className="flex items-center gap-1 text-[12px] font-medium text-ink-faint hover:text-ink">
              Wed 15 Jul
              <CaretRight size={11} weight="bold" />
            </button>
          </div>

          <div className="mt-1.5 flex flex-col">
            {schedule.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 px-5 py-2.5"
              >
                <div className={cn("h-9 w-[3px] shrink-0 rounded-full", toneBar[item.tone])} />
                <div className="w-11 shrink-0 text-[11px] leading-tight text-ink-faint">
                  <p>{item.start}</p>
                  <p>{item.end}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{item.title}</p>
                  <p className="truncate text-[11.5px] text-ink-faint">{item.subtitle}</p>
                </div>
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    item.current ? toneDot[item.tone] : "border border-ink-faint/40"
                  )}
                />
              </div>
            ))}
          </div>

          <button className="flex w-full items-center justify-between px-5 py-3 text-[12px] font-medium text-ink-faint hover:text-ink">
            View full calendar
            <CaretRight size={11} weight="bold" />
          </button>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.3, ease }}>
        <Card className="p-0">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h2 className="text-[14.5px] font-semibold text-ink">Projects</h2>
            <button className="text-[12px] font-medium text-accent-strong hover:text-accent">
              View all
            </button>
          </div>

          <div className="flex flex-col gap-3.5 px-5 pb-4">
            {projects.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
                  {p.name}
                </p>
                <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-border-soft">
                  <div
                    className={cn("h-full rounded-full", toneBar[p.tone])}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[11.5px] text-ink-faint">
                  {p.progress}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.3, ease }}>
        <Card className="p-0">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h2 className="text-[14.5px] font-semibold text-ink">Recent activity</h2>
            <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-faint">
              <span className="size-1.5 rounded-full bg-success animate-pulse-dot" />
              Live
            </span>
          </div>

          <div className="flex flex-col gap-1.5 px-3 pb-3.5">
            {notifications.slice(0, 3).map((n) => (
              <PushNotificationRow key={n.id} notification={n} dense />
            ))}
          </div>

          <button className="flex w-full items-center justify-between px-5 py-3 text-[12px] font-medium text-ink-faint hover:text-ink">
            Open inbox
            <CaretRight size={11} weight="bold" />
          </button>
        </Card>
      </motion.div>
    </motion.div>
  );
}
