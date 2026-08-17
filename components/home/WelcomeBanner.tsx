"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass } from "@phosphor-icons/react";
import { Button } from "../ui/Button";
import { fadeUp } from "@/lib/motion";

export function WelcomeBanner() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent to-accent-strong px-6 py-8 text-accent-ink sm:px-9 sm:py-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-accent-ink/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-24 size-56 rounded-full bg-accent-ink/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-6 hidden size-24 items-center justify-center rounded-3xl border border-accent-ink/15 bg-accent-ink/10 backdrop-blur-sm sm:flex"
      >
        <Compass size={40} weight="duotone" className="text-accent-ink/85" />
      </div>

      <div className="relative max-w-xl">
        <p className="text-[13px] font-medium text-accent-ink/70">
          Tuesday, 14 July
        </p>
        <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight sm:text-[30px]">
          Good afternoon, Mac
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-accent-ink/80">
          Your workspace, tasks, and next steps in one place. Three items need
          attention before Friday.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="invert">New project</Button>
          <Button variant="invert-ghost">
            View activity
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
