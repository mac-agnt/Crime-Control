"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "../ui/Switch";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";

const initial = [
  { id: "activity", label: "Project activity", helper: "Card moves, comments, and mentions", value: true },
  { id: "team", label: "Team updates", helper: "New members and role changes", value: true },
  { id: "automations", label: "Automation runs", helper: "Digest emails and workflow results", value: false },
  { id: "security", label: "Security alerts", helper: "New sign-ins and key rotations", value: true },
];

export function NotificationsTab() {
  const [settings, setSettings] = useState(initial);

  return (
    <motion.div
      variants={staggerContainer(0.05)}
      initial="hidden"
      animate="show"
      className="flex flex-col divide-y divide-border-soft"
    >
      {settings.map((setting, index) => (
        <motion.div
          key={setting.id}
          variants={fadeUp}
          transition={{ duration: 0.22, ease }}
          className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
        >
          <div>
            <p className="text-[13.5px] font-medium text-ink">{setting.label}</p>
            <p className="mt-0.5 text-[12px] text-ink-faint">{setting.helper}</p>
          </div>
          <Switch
            checked={setting.value}
            label={setting.label}
            onChange={(next) =>
              setSettings((prev) =>
                prev.map((s, i) => (i === index ? { ...s, value: next } : s))
              )
            }
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
