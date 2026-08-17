"use client";

import { motion } from "framer-motion";
import { DeviceMobile, Desktop, ShieldWarning } from "@phosphor-icons/react";
import { Button } from "../ui/Button";
import { Field, TextInput } from "../ui/Field";
import { Badge } from "../ui/Badge";
import { fadeUp, ease } from "@/lib/motion";

const sessions = [
  { device: "MacBook Pro", location: "Wicklow, IE", icon: Desktop, current: true },
  { device: "iPhone 16", location: "Wicklow, IE", icon: DeviceMobile, current: false },
];

export function SecurityTab() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.25, ease }}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Current password">
          <TextInput type="password" placeholder="••••••••" />
        </Field>
        <Field label="New password" helper="At least 8 characters">
          <TextInput type="password" placeholder="••••••••" />
        </Field>
      </div>

      <div>
        <p className="text-[13px] font-medium text-ink">Active sessions</p>
        <div className="mt-3 flex flex-col divide-y divide-border-soft rounded-[12px] border border-border-soft">
          {sessions.map((session) => {
            const Icon = session.icon;
            return (
              <div key={session.device} className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-border-soft text-ink-muted">
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-ink">{session.device}</p>
                  <p className="text-[12px] text-ink-faint">{session.location}</p>
                </div>
                {session.current ? (
                  <Badge tone="success">This device</Badge>
                ) : (
                  <button className="text-[12.5px] font-medium text-danger">Revoke</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-[12px] border border-danger/25 bg-danger/[0.05] p-4">
        <ShieldWarning size={18} className="mt-0.5 shrink-0 text-danger" />
        <div className="flex-1">
          <p className="text-[13px] font-medium text-ink">Delete workspace</p>
          <p className="mt-0.5 text-[12px] text-ink-muted">
            Permanently remove this workspace and all of its data. This cannot be undone.
          </p>
        </div>
        <Button variant="danger-outline">Delete</Button>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-5">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Update password</Button>
      </div>
    </motion.div>
  );
}
