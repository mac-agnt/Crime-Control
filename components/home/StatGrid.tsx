"use client";

import { motion } from "framer-motion";
import {
  Kanban,
  CheckCircle,
  TrendUp,
  Lightning,
  ArrowUpRight,
  ArrowDownRight,
} from "@phosphor-icons/react";
import { Card } from "../ui/Card";
import { Sparkline } from "../ui/Sparkline";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import clsx from "clsx";

const stats = [
  {
    label: "Active projects",
    value: "24",
    delta: "+18%",
    positive: true,
    icon: Kanban,
    data: [4, 6, 5, 8, 7, 9, 8, 11, 10, 13],
  },
  {
    label: "Tasks completed",
    value: "312",
    delta: "+6.2%",
    positive: true,
    icon: CheckCircle,
    data: [40, 44, 41, 48, 52, 49, 58, 55, 61, 64],
  },
  {
    label: "Team velocity",
    value: "86pt",
    delta: "-3.1%",
    positive: false,
    icon: TrendUp,
    data: [70, 74, 80, 78, 82, 79, 76, 74, 71, 70],
  },
  {
    label: "Automations run",
    value: "1,204",
    delta: "+42%",
    positive: true,
    icon: Lightning,
    data: [12, 18, 22, 20, 30, 28, 38, 44, 50, 61],
  },
];

export function StatGrid() {
  return (
    <motion.div
      variants={staggerContainer(0.07)}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const DeltaIcon = stat.positive ? ArrowUpRight : ArrowDownRight;
        return (
          <motion.div key={stat.label} variants={fadeUp} transition={{ duration: 0.35, ease }}>
            <Card className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent-soft text-accent-strong">
                  <Icon size={17} weight="fill" />
                </span>
                <span
                  className={clsx(
                    "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold",
                    stat.positive
                      ? "bg-success/15 text-success"
                      : "bg-danger/15 text-danger"
                  )}
                >
                  <DeltaIcon size={12} weight="bold" />
                  {stat.delta}
                </span>
              </div>

              <div>
                <p className="text-2xl font-semibold tracking-tight text-ink">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[12.5px] text-ink-faint">{stat.label}</p>
              </div>

              <Sparkline
                data={stat.data}
                color={stat.positive ? "var(--color-success)" : "var(--color-danger)"}
                delay={index * 0.08}
              />
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
