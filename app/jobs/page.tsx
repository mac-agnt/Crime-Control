"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  Broom,
  MagnifyingGlass,
  Key,
  Package,
  Clock,
  EnvelopeSimple,
  CheckCircle,
  Receipt,
} from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { Tabs } from "@/components/ui/Tabs";
import { getClient, type Job, type JobStatus, type JobType } from "@/lib/data";
import { useDemoStore } from "@/lib/demoStore";
import { fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const typeIcon: Record<JobType, typeof Wrench> = {
  Repair: Wrench,
  Clean: Broom,
  "Void inspection": MagnifyingGlass,
  "Key handover": Key,
  "Equipment delivery": Package,
};

const COLUMNS: { key: JobStatus; label: string; extra?: JobStatus[] }[] = [
  { key: "Requested", label: "Requested" },
  { key: "Assigned", label: "Assigned" },
  { key: "In progress", label: "In progress" },
  { key: "Complete", label: "Complete", extra: ["Invoiced"] },
];

export default function JobsPage() {
  const { jobs, lastRaisedId } = useDemoStore();
  const [view, setView] = useState("board");
  const [openId, setOpenId] = useState<string | null>(null);
  const job = openId ? jobs.find((j) => j.id === openId) ?? null : null;

  return (
    <div>
      <PageHeader
        title="Property Jobs"
        subtitle="Every estate-agent email becomes a tracked job with an SLA clock and a photo of the finished work. Calmer than the paper it replaces."
        actions={<Tabs id="jobs" options={[{ value: "board", label: "Board" }, { value: "table", label: "Table" }]} value={view} onChange={setView} />}
      />

      {view === "board" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const colJobs = jobs.filter((j) => j.status === col.key || col.extra?.includes(j.status));
            return (
              <div key={col.key} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-[13px] font-semibold text-ink">{col.label}</h2>
                  <span className="rounded-full bg-border-soft px-2 py-0.5 text-[11px] font-semibold text-ink-faint">
                    {colJobs.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {colJobs.map((j) => (
                    <JobCard key={j.id} job={j} onClick={() => setOpenId(j.id)} isNew={j.id === lastRaisedId} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <JobTable jobs={jobs} onOpen={setOpenId} lastRaisedId={lastRaisedId} />
      )}

      <Drawer
        open={!!job}
        onClose={() => setOpenId(null)}
        title={job ? `${job.ref} · ${job.type}` : ""}
        subtitle={job ? `${getClient(job.clientId)?.name} · ${job.address}` : ""}
      >
        {job && <JobDetail job={job} />}
      </Drawer>
    </div>
  );
}

function slaLabel(hours: number) {
  if (hours < 0) return { text: `SLA overdue ${Math.abs(hours)}h`, tone: "danger" as const };
  if (hours <= 8) return { text: `${hours}h left`, tone: "warning" as const };
  return { text: `${hours}h left`, tone: "neutral" as const };
}

function JobCard({ job, onClick, isNew }: { job: Job; onClick: () => void; isNew: boolean }) {
  const client = getClient(job.clientId);
  const IconCmp = typeIcon[job.type];
  const sla = slaLabel(job.slaHours);
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.28, ease }}>
      <Card
        interactive
        onClick={onClick}
        className={cn("p-3.5", isNew && "border-accent ring-2 ring-accent/30")}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-ink-faint">{job.ref}</span>
          {isNew && <Badge tone="accent" dot>New</Badge>}
        </div>
        <p className="mt-1.5 text-[13px] font-semibold leading-snug text-ink">{job.address}</p>
        <p className="text-[11.5px] text-ink-faint">{client?.name}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-border-soft px-2 py-0.5 text-[11px] font-medium text-ink-muted">
            <IconCmp size={12} weight="fill" />
            {job.type}
          </span>
          {job.status === "Invoiced" ? (
            <Badge tone="success" dot>Invoiced</Badge>
          ) : (
            <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium", sla.tone === "danger" ? "text-danger" : sla.tone === "warning" ? "text-warning" : "text-ink-faint")}>
              <Clock size={12} weight="fill" />
              {sla.text}
            </span>
          )}
        </div>
        {job.contractor && <p className="mt-2 text-[11px] text-ink-muted">{job.contractor}</p>}
      </Card>
    </motion.div>
  );
}

function JobTable({ jobs, onOpen, lastRaisedId }: { jobs: Job[]; onOpen: (id: string) => void; lastRaisedId: string | null }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            {["Ref", "Address", "Client", "Type", "Contractor", "SLA", "Status"].map((h) => (
              <th key={h} className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => {
            const sla = slaLabel(j.slaHours);
            return (
              <tr
                key={j.id}
                onClick={() => onOpen(j.id)}
                className={cn("cursor-pointer border-b border-border-soft last:border-0 hover:bg-border-soft/50", j.id === lastRaisedId && "bg-accent-soft/40")}
              >
                <td className="px-4 py-3 font-mono text-[12px] text-ink">{j.ref}</td>
                <td className="px-4 py-3 text-[13px] font-medium text-ink">{j.address}</td>
                <td className="px-4 py-3 text-[13px] text-ink-muted">{getClient(j.clientId)?.name}</td>
                <td className="px-4 py-3 text-[13px] text-ink">{j.type}</td>
                <td className="px-4 py-3 text-[13px] text-ink-muted">{j.contractor ?? "—"}</td>
                <td className={cn("px-4 py-3 text-[13px]", sla.tone === "danger" ? "font-semibold text-danger" : "text-ink-muted")}>
                  {j.status === "Complete" || j.status === "Invoiced" ? "—" : sla.text}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={j.status === "Invoiced" ? "success" : j.status === "Requested" ? "warning" : "neutral"} dot>
                    {j.status}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function JobDetail({ job }: { job: Job }) {
  const { advanceJob } = useDemoStore();
  const client = getClient(job.clientId);
  const [invoiced, setInvoiced] = useState(job.status === "Invoiced");

  return (
    <div className="flex flex-col gap-6">
      {/* email quote block — the entire current system */}
      <section>
        <h3 className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
          <EnvelopeSimple size={14} /> Original request
        </h3>
        <div className="rounded-[10px] border border-border bg-bg p-4">
          <p className="text-[12px] font-medium text-ink-muted">{job.emailSubject}</p>
          <div className="mt-2 whitespace-pre-line border-l-2 border-border pl-3 text-[12.5px] leading-relaxed text-ink">
            {job.emailBody}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 text-[12.5px]">
        <Field label="Client" value={client?.name ?? "—"} />
        <Field label="Raised" value={job.raised} />
        <Field label="Contractor" value={job.contractor ?? "Unassigned"} />
        <Field label="Type" value={job.type} />
      </section>

      {job.notes.length > 0 && (
        <section>
          <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">Contractor notes</h3>
          <ol className="flex flex-col gap-2">
            {job.notes.map((n, i) => (
              <li key={i} className="flex gap-2 text-[12.5px] text-ink">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {n}
              </li>
            ))}
          </ol>
        </section>
      )}

      {job.proof && (
        <section>
          <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">Proof of completion</h3>
          <PhotoTile caption="Work signed off" seed={0} className="w-48" />
        </section>
      )}

      <section>
        {invoiced ? (
          <div className="rounded-[10px] border border-success/30 bg-success/[0.06] p-3 text-[13px] font-medium text-success">
            <CheckCircle size={15} weight="fill" className="mr-1.5 inline" />
            Invoiced. Line added to {client?.name}&apos;s account.
          </div>
        ) : (
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              advanceJob(job.id, "Invoiced");
              setInvoiced(true);
            }}
          >
            <Receipt size={15} />
            Raise invoice
          </Button>
        )}
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-border bg-bg px-3 py-2">
      <p className="text-[11px] text-ink-faint">{label}</p>
      <p className="mt-0.5 text-[13px] font-medium text-ink">{value}</p>
    </div>
  );
}
