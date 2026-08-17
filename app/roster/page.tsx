"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarBlank, Warning, Clock, UserPlus } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { StatTile } from "@/components/ui/StatTile";
import {
  rosterDays,
  rosterDates,
  rosterSites,
  rosterCell,
  getSite,
  getGuard,
  guards,
  licenceDaysLeft,
} from "@/lib/data";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Cell = { guardId: string | null; hours: number };

export default function RosterPage() {
  const [view, setView] = useState("site");
  const initial = useMemo(() => {
    const map: Record<string, Cell> = {};
    rosterSites.forEach((sid, i) => {
      rosterDays.forEach((d) => {
        map[`${sid}-${d}`] = rosterCell(sid, d, i);
      });
    });
    return map;
  }, []);
  const [cells, setCells] = useState<Record<string, Cell>>(initial);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const stats = useMemo(() => {
    let scheduled = 0;
    let unfilled = 0;
    let hours = 0;
    Object.values(cells).forEach((c) => {
      if (c.guardId) {
        scheduled++;
        hours += c.hours;
      } else unfilled++;
    });
    return { scheduled, unfilled, hours: Math.round(hours) };
  }, [cells]);

  // bench of available, licence-valid guards to drag in
  const bench = useMemo(
    () =>
      guards
        .filter((g) => g.available && licenceDaysLeft(g.licenceExpiry) > 0 && g.hoursThisWeek < 44)
        .slice(0, 6),
    []
  );

  function assign(key: string, guardId: string) {
    setCells((prev) => ({ ...prev, [key]: { guardId, hours: prev[key].hours || 12 } }));
    setDropTarget(null);
  }

  return (
    <div>
      <PageHeader
        title="Roster"
        subtitle="This is the Word document, replaced. Drag a guard onto an open cell and the unfilled count drops in front of you."
        actions={<Tabs id="roster" options={[{ value: "site", label: "By site" }, { value: "guard", label: "By guard" }]} value={view} onChange={setView} />}
      />

      <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="show" className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile icon={CalendarBlank} label="Shifts scheduled" value={String(stats.scheduled)} tone="accent" />
        <StatTile icon={Warning} label="Shifts unfilled" value={String(stats.unfilled)} tone={stats.unfilled > 0 ? "warning" : "success"} hint={stats.unfilled > 0 ? "Needs cover this week" : "Fully covered"} />
        <StatTile icon={Clock} label="Hours committed" value={`${stats.hours}h`} tone="accent" />
      </motion.div>

      {/* bench */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-bg p-3">
        <span className="mr-1 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">Available guards</span>
        {bench.map((g) => (
          <div
            key={g.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/guard", g.id)}
            className="flex cursor-grab items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1.5 text-[12px] font-medium text-ink shadow-sm active:cursor-grabbing"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent-strong">
              {g.initials}
            </span>
            {g.name}
          </div>
        ))}
      </div>

      {view === "site" ? (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="sticky left-0 z-10 bg-surface px-4 py-3 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">
                  Site
                </th>
                {rosterDays.map((d, i) => (
                  <th key={d} className="px-2 py-3 text-center text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">
                    {d}
                    <span className="block text-[10px] font-normal text-ink-faint/70">{rosterDates[i]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rosterSites.map((sid) => {
                const site = getSite(sid);
                return (
                  <tr key={sid} className="border-b border-border-soft last:border-0">
                    <td className="sticky left-0 z-10 bg-surface px-4 py-2 align-top">
                      <p className="text-[12.5px] font-medium text-ink">{site?.name}</p>
                      <p className="text-[11px] text-ink-faint">{site?.area}</p>
                    </td>
                    {rosterDays.map((d) => {
                      const key = `${sid}-${d}`;
                      const cell = cells[key];
                      const guard = getGuard(cell.guardId);
                      const isTarget = dropTarget === key;
                      return (
                        <td key={key} className="p-1.5">
                          {guard ? (
                            <div
                              draggable
                              onDragStart={(e) => e.dataTransfer.setData("text/guard", guard.id)}
                              className="flex h-14 cursor-grab flex-col justify-center rounded-[10px] border border-accent/30 bg-accent-soft/50 px-2 py-1 text-center"
                            >
                              <p className="truncate text-[11.5px] font-semibold text-accent-strong">{guard.name.split(" ")[0]} {guard.name.split(" ")[1]?.[0]}.</p>
                              <p className="text-[10px] text-ink-faint">{cell.hours}h</p>
                            </div>
                          ) : (
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDropTarget(key);
                              }}
                              onDragLeave={() => setDropTarget((t) => (t === key ? null : t))}
                              onDrop={(e) => {
                                const gid = e.dataTransfer.getData("text/guard");
                                if (gid) assign(key, gid);
                              }}
                              className={cn(
                                "flex h-14 flex-col items-center justify-center rounded-[10px] border border-dashed text-center transition-colors",
                                isTarget
                                  ? "border-accent bg-accent-soft"
                                  : "border-warning/40 bg-warning/[0.06]"
                              )}
                            >
                              <UserPlus size={15} className="text-warning" />
                              <span className="text-[10.5px] font-medium text-warning">Assign</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      ) : (
        <GuardView cells={cells} />
      )}
    </div>
  );
}

function GuardView({ cells }: { cells: Record<string, { guardId: string | null; hours: number }> }) {
  // aggregate hours per guard from current grid
  const perGuard = useMemo(() => {
    const map: Record<string, { hours: number; days: number }> = {};
    Object.values(cells).forEach((c) => {
      if (!c.guardId) return;
      map[c.guardId] = map[c.guardId] || { hours: 0, days: 0 };
      map[c.guardId].hours += c.hours;
      map[c.guardId].days += 1;
    });
    return Object.entries(map)
      .map(([id, v]) => ({ guard: getGuard(id)!, ...v }))
      .sort((a, b) => b.hours - a.hours);
  }, [cells]);

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">Guard</th>
            <th className="px-4 py-3 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">Shifts</th>
            <th className="px-4 py-3 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">Hours</th>
            <th className="px-4 py-3 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">Load</th>
          </tr>
        </thead>
        <tbody>
          {perGuard.map(({ guard, hours, days }) => (
            <tr key={guard.id} className="border-b border-border-soft last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-strong">
                    {guard.initials}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-ink">{guard.name}</p>
                    <p className="text-[11px] text-ink-faint">{guard.subcontractor ? guard.firm : "Crime Control"}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-[13px] text-ink">{days}</td>
              <td className="px-4 py-3 text-[13px] font-semibold text-ink">{Math.round(hours)}h</td>
              <td className="px-4 py-3">
                <div className="flex h-1.5 w-32 overflow-hidden rounded-full bg-border-soft">
                  <div
                    className={cn("h-full rounded-full", hours > 48 ? "bg-danger" : "bg-accent")}
                    style={{ width: `${Math.min(100, (hours / 60) * 100)}%` }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
