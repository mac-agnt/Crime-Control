"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightning,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  PaperPlaneTilt,
  Repeat,
  Warning,
} from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  openShifts,
  getSite,
  getClient,
  candidatesFor,
  type OpenShift,
  type Candidate,
} from "@/lib/data";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const reasonTone = { Sick: "warning", "No show": "danger", Unfilled: "neutral" } as const;

export default function CoverPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink-faint">Loading cover desk…</div>}>
      <CoverDesk />
    </Suspense>
  );
}

type SendStatus = "idle" | "sent" | "accepted";

function CoverDesk() {
  const params = useSearchParams();
  const initial = params.get("shift");
  const [selectedId, setSelectedId] = useState<string>(
    initial && openShifts.some((o) => o.id === initial) ? initial : openShifts[0].id
  );
  const [sendState, setSendState] = useState<Record<string, SendStatus>>({});
  const [broadcasting, setBroadcasting] = useState(false);
  const timers = useRef<number[]>([]);

  const shift = openShifts.find((o) => o.id === selectedId)!;
  const candidates = useMemo(() => candidatesFor(shift), [shift]);
  const top5 = candidates.slice(0, 5);

  useEffect(() => {
    // reset broadcast when switching gap
    setSendState({});
    setBroadcasting(false);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, [selectedId]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function broadcast() {
    const next: Record<string, SendStatus> = {};
    top5.forEach((c) => (next[c.guard.id] = "sent"));
    setSendState(next);
    setBroadcasting(true);
    // two accept, deterministically (2nd and 4th ranked)
    const accept = [top5[1]?.guard.id, top5[3]?.guard.id].filter(Boolean) as string[];
    accept.forEach((id, i) => {
      const t = window.setTimeout(
        () => setSendState((prev) => ({ ...prev, [id]: "accepted" })),
        1200 + i * 900
      );
      timers.current.push(t);
    });
  }

  const acceptedCount = Object.values(sendState).filter((s) => s === "accepted").length;

  return (
    <div>
      <PageHeader
        title="Cover Desk"
        subtitle="A sick call or a no show, and the best-placed guards ranked in seconds. No more scrolling WhatsApp trying to remember who's worked the site."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
        {/* open shifts */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">
            Open shifts · {openShifts.length}
          </h2>
          <motion.div variants={staggerContainer(0.04)} initial="hidden" animate="show" className="flex flex-col gap-2.5">
            {openShifts.map((o) => (
              <ShiftRow key={o.id} shift={o} active={o.id === selectedId} onSelect={() => setSelectedId(o.id)} />
            ))}
          </motion.div>
        </div>

        {/* candidates */}
        <div>
          <Card className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-bg">
            <div>
              <p className="text-[13px] text-ink-faint">Covering</p>
              <p className="text-[15px] font-semibold text-ink">
                {getSite(shift.siteId)?.name} · {shift.time}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {acceptedCount > 0 && (
                <Badge tone="success" dot>
                  {acceptedCount} accepted
                </Badge>
              )}
              <Button variant="primary" onClick={broadcast} disabled={broadcasting}>
                {broadcasting ? <Repeat size={15} /> : <Lightning size={15} weight="fill" />}
                {broadcasting ? "Broadcast sent" : "Broadcast to top 5"}
              </Button>
            </div>
          </Card>

          <motion.div variants={staggerContainer(0.05)} initial="hidden" animate="show" className="flex flex-col gap-2.5">
            {candidates.slice(0, 8).map((c, i) => (
              <CandidateRow
                key={c.guard.id}
                candidate={c}
                rank={i + 1}
                inTop5={i < 5}
                status={sendState[c.guard.id] ?? "idle"}
                siteId={shift.siteId}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ShiftRow({ shift, active, onSelect }: { shift: OpenShift; active: boolean; onSelect: () => void }) {
  const site = getSite(shift.siteId);
  const client = getClient(site?.clientId ?? null);
  return (
    <motion.button
      variants={fadeUp}
      transition={{ duration: 0.3, ease }}
      onClick={onSelect}
      className={cn(
        "w-full rounded-2xl border bg-surface p-4 text-left transition-colors",
        active ? "border-accent/50 bg-accent-soft/40" : "border-border hover:border-ink-faint/40"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[13.5px] font-semibold text-ink">{site?.name}</p>
        <Badge tone={reasonTone[shift.reason]} dot>
          {shift.reason}
        </Badge>
      </div>
      <p className="mt-1 truncate text-[12px] text-ink-faint">{client?.name}</p>
      <p className="mt-2 text-[12px] font-medium text-ink-muted">
        {shift.date} · {shift.time}
      </p>
    </motion.button>
  );
}

function CandidateRow({
  candidate,
  rank,
  inTop5,
  status,
  siteId,
}: {
  candidate: Candidate;
  rank: number;
  inTop5: boolean;
  status: SendStatus;
  siteId: string;
}) {
  const { guard, worked, distance, overtime } = candidate;
  return (
    <motion.div variants={fadeUp} transition={{ duration: 0.3, ease }}>
      <Card
        className={cn(
          "flex flex-wrap items-center gap-3 p-3.5",
          status === "accepted" && "border-success/50 bg-success/[0.06]",
          status === "sent" && "border-accent/40"
        )}
      >
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
            inTop5 ? "bg-accent text-accent-ink" : "bg-border-soft text-ink-faint"
          )}
        >
          {rank}
        </span>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent-strong">
          {guard.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-ink">
            {guard.name}
            {guard.subcontractor && <span className="ml-1.5 text-[11px] font-normal text-ink-faint">({guard.firm})</span>}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Chip tone={worked > 0 ? "success" : "neutral"} icon={ShieldCheck}>
              {worked > 0 ? `Worked here ${worked}×` : "New to site"}
            </Chip>
            <Chip tone="neutral" icon={MapPin}>{distance} km</Chip>
            <Chip tone={overtime ? "danger" : "neutral"} icon={Clock}>
              {guard.hoursThisWeek}h wk{overtime ? " · OT" : ""}
            </Chip>
            <Chip tone="success" icon={ShieldCheck}>Licence valid</Chip>
            <Chip tone={guard.available ? "success" : "warning"}>
              {guard.available ? "Available" : "On another site"}
            </Chip>
          </div>
        </div>

        <div className="ml-auto w-24 text-right">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[12px] text-ink-faint">
                Ready
              </motion.span>
            )}
            {status === "sent" && (
              <motion.span key="sent" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1 text-[12px] font-medium text-accent-strong">
                <PaperPlaneTilt size={13} weight="fill" /> Sent
              </motion.span>
            )}
            {status === "accepted" && (
              <motion.span key="acc" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1 text-[12px] font-semibold text-success">
                <CheckCircle size={14} weight="fill" /> Accepted
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}

function Chip({
  children,
  tone,
  icon: IconCmp,
}: {
  children: React.ReactNode;
  tone: "success" | "warning" | "danger" | "neutral";
  icon?: typeof Warning;
}) {
  const toneClass = {
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-danger/15 text-danger",
    neutral: "bg-border-soft text-ink-muted",
  }[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", toneClass)}>
      {IconCmp && <IconCmp size={11} weight="fill" />}
      {children}
    </span>
  );
}
