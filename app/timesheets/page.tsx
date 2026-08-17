"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CurrencyEur, CheckCircle, DownloadSimple, CaretDown, Warning } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { timesheets, timesheetMonths, getGuard, getSite, type Timesheet } from "@/lib/data";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/cn";

function hm(hours: number): string {
  const sign = hours < 0 ? "-" : "+";
  const abs = Math.abs(hours);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  if (h === 0 && m === 0) return "0";
  return `${sign}${h ? `${h}h ` : ""}${m ? `${m}m` : ""}`.trim();
}
function dur(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h${m ? ` ${m}m` : ""}`;
}
const eur = (n: number) => "€" + n.toLocaleString("en-IE", { maximumFractionDigits: 0 });

export default function TimesheetsPage() {
  const [month, setMonth] = useState(timesheetMonths[1]);
  const [monthOpen, setMonthOpen] = useState(false);
  const [approved, setApproved] = useState<Set<string>>(
    () => new Set(timesheets.filter((t) => t.status === "Approved").map((t) => t.id))
  );
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const withVar = timesheets.map((t) => ({ ...t, variance: t.actual - t.rostered, cost: t.actual * t.rate }));
    const review = withVar.filter((t) => Math.abs(t.variance) > 0.5).sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
    const ok = withVar.filter((t) => Math.abs(t.variance) <= 0.5);
    return { review, ok, all: [...review, ...ok] };
  }, []);

  const totals = useMemo(() => {
    const hours = timesheets.reduce((s, t) => s + t.actual, 0);
    const cost = timesheets.reduce((s, t) => s + t.actual * t.rate, 0);
    const unapproved = timesheets.filter((t) => !approved.has(t.id)).length;
    return { hours: Math.round(hours), cost: Math.round(cost), unapproved };
  }, [approved]);

  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function approveChecked() {
    setApproved((prev) => new Set([...prev, ...checked]));
    setChecked(new Set());
  }

  function exportCsv() {
    const header = ["Guard", "Site", "Rostered (h)", "Actual (h)", "Variance (h)", "Rate", "Cost", "Status"];
    const lines = rows.all.map((t) => {
      const g = getGuard(t.guardId)?.name ?? "";
      const s = getSite(t.siteId)?.name ?? "";
      return [g, s, t.rostered, t.actual.toFixed(2), t.variance.toFixed(2), t.rate, (t.actual * t.rate).toFixed(2), approved.has(t.id) ? "Approved" : "Pending"]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(",");
    });
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crime-control-timesheets-${month.replace(/\s/g, "-").toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Timesheets"
        subtitle="Actual hours from check-in data against the roster. The variance column is the money Megan can't see today, worked out for her instead of by her."
        actions={
          <div className="relative">
            <Button variant="secondary" onClick={() => setMonthOpen((v) => !v)}>
              {month}
              <CaretDown size={14} />
            </Button>
            {monthOpen && (
              <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-[10px] border border-border bg-surface shadow-lg">
                {timesheetMonths.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMonth(m);
                      setMonthOpen(false);
                    }}
                    className={cn("block w-full px-3 py-2 text-left text-[13px] hover:bg-border-soft", m === month ? "font-semibold text-accent-strong" : "text-ink")}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />

      <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="show" className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile icon={Clock} label="Total hours (actual)" value={`${totals.hours}h`} tone="accent" />
        <StatTile icon={CurrencyEur} label="Total cost" value={eur(totals.cost)} tone="accent" />
        <StatTile icon={Warning} label="Unapproved" value={String(totals.unapproved)} tone={totals.unapproved ? "warning" : "success"} />
      </motion.div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-ink-muted">
          {checked.size > 0 ? `${checked.size} selected` : "Select rows to approve in bulk"}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={approveChecked} disabled={checked.size === 0}>
            <CheckCircle size={15} />
            Approve selected
          </Button>
          <Button variant="primary" onClick={exportCsv}>
            <DownloadSimple size={15} />
            Export for payroll
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="w-10 px-4 py-3" />
              <Th>Guard</Th>
              <Th>Site</Th>
              <Th className="text-right">Rostered</Th>
              <Th className="text-right">Actual</Th>
              <Th className="text-right">Variance</Th>
              <Th className="text-right">Rate</Th>
              <Th className="text-right">Cost</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={9} className="bg-danger/[0.06] px-4 py-2 text-[11.5px] font-semibold uppercase tracking-wide text-danger">
                Needs review · variance over 30 minutes
              </td>
            </tr>
            {rows.review.map((t) => (
              <Row key={t.id} t={t} approved={approved.has(t.id)} checked={checked.has(t.id)} onCheck={() => toggleCheck(t.id)} />
            ))}
            <tr>
              <td colSpan={9} className="bg-border-soft/50 px-4 py-2 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">
                Within tolerance
              </td>
            </tr>
            {rows.ok.map((t) => (
              <Row key={t.id} t={t} approved={approved.has(t.id)} checked={checked.has(t.id)} onCheck={() => toggleCheck(t.id)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint", className)}>{children}</th>;
}

function Row({
  t,
  approved,
  checked,
  onCheck,
}: {
  t: Timesheet & { variance: number; cost: number };
  approved: boolean;
  checked: boolean;
  onCheck: () => void;
}) {
  const guard = getGuard(t.guardId);
  const site = getSite(t.siteId);
  const big = Math.abs(t.variance) > 0.5;
  const varTone = t.variance <= -0.5 ? "text-danger" : t.variance >= 0.5 ? "text-warning" : "text-ink-muted";
  return (
    <tr className={cn("border-b border-border-soft last:border-0", approved && "opacity-55")}>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={checked}
          disabled={approved}
          onChange={onCheck}
          className="size-4 accent-[var(--color-accent)]"
          aria-label="Select row"
        />
      </td>
      <td className="px-4 py-3">
        <p className="text-[13px] font-medium text-ink">{guard?.name}</p>
        <p className="text-[11px] text-ink-faint">{guard?.subcontractor ? guard.firm : "Crime Control"}</p>
      </td>
      <td className="px-4 py-3 text-[13px] text-ink-muted">{site?.name}</td>
      <td className="px-4 py-3 text-right text-[13px] text-ink">{dur(t.rostered)}</td>
      <td className="px-4 py-3 text-right text-[13px] text-ink">{dur(t.actual)}</td>
      <td className={cn("px-4 py-3 text-right text-[13px] font-semibold", varTone)}>
        {hm(t.variance)}
        {big && t.variance < 0 && (
          <span className="ml-1 text-[11px] font-normal text-danger">({"−€" + Math.round(Math.abs(t.variance) * t.rate)})</span>
        )}
      </td>
      <td className="px-4 py-3 text-right text-[13px] text-ink-muted">€{t.rate}</td>
      <td className="px-4 py-3 text-right text-[13px] font-medium text-ink">€{Math.round(t.cost)}</td>
      <td className="px-4 py-3">
        <Badge tone={approved ? "success" : "neutral"} dot>
          {approved ? "Approved" : "Pending"}
        </Badge>
      </td>
    </tr>
  );
}
