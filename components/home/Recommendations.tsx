"use client";

import { motion } from "framer-motion";
import { ArrowRight, Rocket, ChartBar, ShieldCheck } from "@phosphor-icons/react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";

const items = [
  {
    icon: Rocket,
    tag: "Great place to start",
    title: "Finish onboarding checklist",
    body: "Four quick steps left. Connect your calendar to unlock scheduling suggestions.",
    cta: "Start now",
    highlight: true,
  },
  {
    icon: ChartBar,
    tag: "Prioritised",
    title: "Review Q3 velocity report",
    body: "Your team's throughput dipped 3% last sprint. Worth a five-minute look.",
    cta: "Review report",
    highlight: false,
  },
  {
    icon: ShieldCheck,
    tag: "Security",
    title: "Rotate workspace API keys",
    body: "Two keys are older than 90 days. Rotating keeps automations running safely.",
    cta: "Rotate keys",
    highlight: false,
  },
];

export function Recommendations() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-ink">Recommendations</h2>
        <span className="text-[12.5px] font-medium text-ink-faint">Start here</span>
      </div>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} variants={fadeUp} transition={{ duration: 0.35, ease }}>
              <Card
                interactive
                className={
                  item.highlight
                    ? "flex h-full flex-col justify-between border-success/30 bg-success/[0.06]"
                    : "flex h-full flex-col justify-between"
                }
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-[10px] bg-surface-raised text-accent-strong">
                      <Icon size={17} weight="fill" />
                    </span>
                    <Badge tone={item.highlight ? "success" : "neutral"}>{item.tag}</Badge>
                  </div>
                  <h3 className="mt-4 text-[14.5px] font-semibold leading-snug text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>

                <button className="mt-5 flex items-center gap-1 text-[13px] font-semibold text-accent-strong">
                  {item.cta}
                  <ArrowRight size={14} />
                </button>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
