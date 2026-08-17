"use client";

import { motion } from "framer-motion";
import { Kanban, Users, Lightning, FileText } from "@phosphor-icons/react";
import { Card } from "../ui/Card";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import clsx from "clsx";

const events = [
  {
    icon: Kanban,
    tone: "accent",
    title: "Priya moved “API rate limits” to In Review",
    time: "2 minutes ago",
  },
  {
    icon: Users,
    tone: "success",
    title: "Conor Murphy joined the Growth team",
    time: "38 minutes ago",
  },
  {
    icon: FileText,
    tone: "warning",
    title: "Q3 velocity report was published",
    time: "1 hour ago",
  },
  {
    icon: Lightning,
    tone: "accent",
    title: "Weekly digest automation ran for 12 members",
    time: "3 hours ago",
  },
] as const;

export function ActivityFeed() {
  return (
    <Card className="flex h-full flex-col">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-ink">Live activity</h2>
        <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-faint">
          <span className="size-1.5 rounded-full bg-success animate-pulse-dot" />
          Live
        </span>
      </div>

      <motion.ol
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mt-3 flex flex-col gap-4 pl-1"
      >
        <span className="absolute bottom-4 left-[15px] top-1 w-px bg-border-soft" aria-hidden />
        {events.map((event) => {
          const Icon = event.icon;
          return (
            <motion.li
              key={event.title}
              variants={fadeUp}
              transition={{ duration: 0.3, ease }}
              className="relative flex gap-3"
            >
              <span
                className={clsx(
                  "z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-surface",
                  event.tone === "accent" && "bg-accent-soft text-accent-strong",
                  event.tone === "success" && "bg-success/15 text-success",
                  event.tone === "warning" && "bg-warning/15 text-warning"
                )}
              >
                <Icon size={14} weight="fill" />
              </span>
              <div className="min-w-0 pt-1">
                <p className="text-[13px] leading-snug text-ink">{event.title}</p>
                <p className="mt-0.5 text-[11.5px] text-ink-faint">{event.time}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ol>

      <button className="mt-4 w-full rounded-[10px] border border-dashed border-border py-2.5 text-[12.5px] font-medium text-ink-faint transition-colors hover:border-ink-faint/40 hover:text-ink-muted">
        View all activity
      </button>
    </Card>
  );
}
