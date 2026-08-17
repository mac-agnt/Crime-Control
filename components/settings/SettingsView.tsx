"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCircle,
  PaintBrush,
  BellSimple,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Card } from "../ui/Card";
import { springSoft, fadeUp, ease } from "@/lib/motion";
import clsx from "clsx";
import { ProfileTab } from "./ProfileTab";
import { AppearanceTab } from "./AppearanceTab";
import { NotificationsTab } from "./NotificationsTab";
import { SecurityTab } from "./SecurityTab";

const tabs = [
  { id: "profile", label: "Profile", icon: UserCircle },
  { id: "appearance", label: "Appearance", icon: PaintBrush },
  { id: "notifications", label: "Notifications", icon: BellSimple },
  { id: "security", label: "Security", icon: ShieldCheck },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function SettingsView() {
  const [active, setActive] = useState<TabId>("profile");

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.3, ease }}
      className="mx-auto max-w-4xl"
    >
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-[13.5px] text-ink-muted">
          Manage your profile, appearance, and workspace preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[184px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={clsx(
                  "relative flex h-10 shrink-0 items-center gap-2.5 rounded-[10px] px-3 text-left text-[13.5px] font-medium transition-colors md:w-full",
                  isActive ? "text-accent-strong" : "text-ink-muted hover:text-ink"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="settings-tab"
                    className="absolute inset-0 rounded-[10px] bg-accent-soft"
                    transition={springSoft}
                  />
                )}
                <Icon size={17} weight={isActive ? "fill" : "regular"} className="relative z-10 shrink-0" />
                <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <Card className="min-h-[420px]">
          {active === "profile" && <ProfileTab />}
          {active === "appearance" && <AppearanceTab />}
          {active === "notifications" && <NotificationsTab />}
          {active === "security" && <SecurityTab />}
        </Card>
      </div>
    </motion.div>
  );
}
