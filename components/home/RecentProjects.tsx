"use client";

import { motion } from "framer-motion";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import clsx from "clsx";

const projects = [
  {
    name: "Checkout redesign",
    owner: "Priya Nair",
    initials: "PN",
    progress: 78,
    status: "In progress" as const,
  },
  {
    name: "Onboarding flow v2",
    owner: "Conor Murphy",
    initials: "CM",
    progress: 42,
    status: "In progress" as const,
  },
  {
    name: "API rate limiting",
    owner: "Saoirse Kelly",
    initials: "SK",
    progress: 100,
    status: "Complete" as const,
  },
  {
    name: "Notification center",
    owner: "Emer McGrath",
    initials: "EM",
    progress: 12,
    status: "Blocked" as const,
  },
];

const statusTone = {
  "In progress": "accent",
  Complete: "success",
  Blocked: "danger",
} as const;

export function RecentProjects() {
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 className="text-[15px] font-semibold text-ink">Recent projects</h2>
        <button className="text-[12.5px] font-medium text-accent-strong">View all</button>
      </div>

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-3 divide-y divide-border-soft"
      >
        {projects.map((project) => (
          <motion.div
            key={project.name}
            variants={fadeUp}
            transition={{ duration: 0.3, ease }}
            className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-border-soft/60"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent-strong">
              {project.initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium text-ink">{project.name}</p>
              <p className="truncate text-[12px] text-ink-faint">{project.owner}</p>
            </div>

            <div className="hidden w-32 items-center gap-2 sm:flex">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border-soft">
                <div
                  className={clsx(
                    "h-full rounded-full",
                    project.progress === 100 ? "bg-success" : "bg-accent"
                  )}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-[11.5px] text-ink-faint">
                {project.progress}%
              </span>
            </div>

            <Badge tone={statusTone[project.status]} className="hidden sm:inline-flex">
              {project.status}
            </Badge>

            <button
              aria-label="Project actions"
              className="flex size-8 shrink-0 items-center justify-center rounded-[8px] text-ink-faint hover:bg-border-soft hover:text-ink"
            >
              <DotsThreeVertical size={16} weight="bold" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
}
