"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Lightning, ArrowRight, ClipboardText, WarningCircle } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { sites, getGuard, getClient, openShifts, type Site, type SiteStatus } from "@/lib/data";
import {
  SEA_POLY,
  COAST_LINE,
  LIFFEY,
  POOLBEG,
  M50,
  GRAND_CANAL,
  ROYAL_CANAL,
  PHOENIX_PARK,
  MAP_LABELS,
  project,
} from "@/lib/dublin";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const statusPin: Record<SiteStatus, string> = {
  "On site": "bg-success",
  "Checked out": "bg-ink-faint",
  Late: "bg-warning",
  "No show": "bg-danger",
};
const statusTone: Record<SiteStatus, "success" | "neutral" | "warning" | "danger"> = {
  "On site": "success",
  "Checked out": "neutral",
  Late: "warning",
  "No show": "danger",
};

const rank: Record<SiteStatus, number> = { "No show": 0, Late: 1, "On site": 2, "Checked out": 3 };

export default function SitesPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const ordered = useMemo(
    () => [...sites].sort((a, b) => rank[a.status] - rank[b.status]),
    []
  );
  const drawerSite = drawerId ? sites.find((s) => s.id === drawerId) ?? null : null;
  const shiftForSite = (siteId: string) => openShifts.find((o) => o.siteId === siteId);

  const counts = useMemo(() => {
    const c = { "On site": 0, "Checked out": 0, Late: 0, "No show": 0 } as Record<SiteStatus, number>;
    sites.forEach((s) => (c[s.status] += 1));
    return c;
  }, []);

  return (
    <div>
      <PageHeader
        title="Live Site Board"
        subtitle="Every site on tonight's book, with check-in status the second it happens. No more hearing about a no show from the estate agent the next morning."
        actions={
          <div className="flex items-center gap-3 text-[12.5px]">
            {(["On site", "Late", "No show", "Checked out"] as SiteStatus[]).map((s) => (
              <span key={s} className="flex items-center gap-1.5 text-ink-muted">
                <span className={cn("size-2 rounded-full", statusPin[s])} />
                {s} {counts[s]}
              </span>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_400px]">
        {/* Map */}
        <Card className="relative min-h-[320px] overflow-hidden p-0 lg:min-h-[640px]">
          <MapBoard
            sites={ordered}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setDrawerId(id);
            }}
          />
        </Card>

        {/* List */}
        <div className="flex flex-col gap-3 lg:max-h-[640px] lg:overflow-y-auto lg:pr-1">
          <motion.div variants={staggerContainer(0.04)} initial="hidden" animate="show" className="flex flex-col gap-3">
            {ordered.map((site) => {
              const guard = getGuard(site.guardId);
              const client = getClient(site.clientId);
              const alert = site.status === "No show";
              return (
                <motion.div key={site.id} variants={fadeUp} transition={{ duration: 0.3, ease }}>
                  <Card
                    interactive
                    onMouseEnter={() => setSelectedId(site.id)}
                    onClick={() => setDrawerId(site.id)}
                    className={cn(
                      "p-4",
                      alert && "border-danger/40 bg-danger/[0.05]",
                      selectedId === site.id && !alert && "border-accent/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold text-ink">{site.name}</p>
                        <p className="truncate text-[12px] text-ink-faint">{client?.name}</p>
                      </div>
                      <Badge tone={statusTone[site.status]} dot>
                        {site.status}
                        {site.status === "No show" ? " · 14 min" : site.lateBy ? ` · ${site.lateBy} min` : ""}
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px]">
                      <Info label="Shift" value={site.window} />
                      <Info label="Guard" value={guard ? guard.name : "— unassigned"} />
                      <Info label="Last patrol" value={site.lastPatrol} />
                      <Info label="Type" value={site.type} />
                    </div>

                    {alert && (
                      <div className="mt-3 flex items-center justify-between rounded-[10px] border border-danger/30 bg-surface px-3 py-2">
                        <span className="flex items-center gap-1.5 text-[12px] font-medium text-danger">
                          <WarningCircle size={15} weight="fill" />
                          Guard has not checked in
                        </span>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            const shift = shiftForSite(site.id);
                            router.push(`/cover${shift ? `?shift=${shift.id}` : ""}`);
                          }}
                        >
                          <Lightning size={14} weight="fill" />
                          Find cover
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <Drawer
        open={!!drawerSite}
        onClose={() => setDrawerId(null)}
        title={drawerSite?.name ?? ""}
        subtitle={drawerSite ? `${getClient(drawerSite.clientId)?.name} · ${drawerSite.type}` : ""}
        footer={
          drawerSite?.status === "No show" ? (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                const shift = shiftForSite(drawerSite.id);
                router.push(`/cover${shift ? `?shift=${shift.id}` : ""}`);
              }}
            >
              <Lightning size={15} weight="fill" />
              Find cover for this shift
              <ArrowRight size={15} />
            </Button>
          ) : undefined
        }
      >
        {drawerSite && <SiteDetail site={drawerSite} />}
      </Drawer>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <span className="text-ink-faint">{label}: </span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

function MapBoard({
  sites: list,
  selectedId,
  onSelect,
}: {
  sites: Site[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="absolute inset-0">
      {/* geographically projected Dublin */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <rect width="100" height="100" className="fill-bg" />
        {/* Dublin Bay / Irish Sea */}
        <polygon points={SEA_POLY} className="fill-accent-soft/50" />
        <polyline points={COAST_LINE} className="stroke-accent/40" strokeWidth="0.5" fill="none" strokeLinejoin="round" />
        {/* Phoenix Park */}
        <polygon points={PHOENIX_PARK} className="fill-success/10 stroke-success/25" strokeWidth="0.3" />
        {/* M50 orbital */}
        <polyline points={M50} className="stroke-warning/40" strokeWidth="0.8" fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.1 1.6" />
        {/* Liffey + Poolbeg wall */}
        <polyline points={LIFFEY} className="stroke-accent/45" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={POOLBEG} className="stroke-accent/30" strokeWidth="0.5" fill="none" strokeLinecap="round" />
        {/* canals */}
        <polyline points={GRAND_CANAL} className="stroke-accent/20" strokeWidth="0.4" fill="none" strokeLinecap="round" />
        <polyline points={ROYAL_CANAL} className="stroke-accent/20" strokeWidth="0.4" fill="none" strokeLinecap="round" />
      </svg>

      {/* place labels */}
      {MAP_LABELS.map((l) => {
        const p = project(l.lng, l.lat);
        return (
          <span
            key={l.text}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[9px] font-medium uppercase tracking-wide text-ink-faint/60"
          >
            {l.text}
          </span>
        );
      })}

      {list.map((site) => {
        const active = selectedId === site.id;
        const alert = site.status === "No show";
        return (
          <button
            key={site.id}
            onClick={() => onSelect(site.id)}
            style={{ left: `${site.map.x}%`, top: `${site.map.y}%` }}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            aria-label={site.name}
          >
            <span className="relative flex items-center justify-center">
              {alert && (
                <span className="absolute size-6 rounded-full bg-danger/30 animate-pulse-dot" />
              )}
              <span
                className={cn(
                  "relative flex size-3.5 items-center justify-center rounded-full ring-2 ring-surface transition-transform group-hover:scale-125",
                  statusPin[site.status],
                  active && "scale-150"
                )}
              />
            </span>
            {active && (
              <span className="absolute left-1/2 top-5 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-medium text-ink shadow-sm">
                {site.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function SiteDetail({ site }: { site: Site }) {
  const guard = getGuard(site.guardId);
  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3">
        <TimeCell label="Rostered in" value={site.rosteredIn} />
        <TimeCell
          label="Checked in"
          value={site.actualIn ?? "No check-in"}
          tone={site.actualIn ? (site.lateBy ? "warning" : "success") : "danger"}
        />
        <TimeCell label="Rostered out" value={site.rosteredOut} />
        <TimeCell label="Checked out" value={site.actualOut ?? "On site"} tone={site.actualOut ? "neutral" : "success"} />
      </section>

      <section>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
          Guard
        </h3>
        {guard ? (
          <div className="flex items-center gap-3 rounded-[10px] border border-border bg-bg px-3 py-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent-strong">
              {guard.initials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-ink">{guard.name}</p>
              <p className="text-[11.5px] text-ink-faint">
                {guard.subcontractor ? guard.firm : "Crime Control"} · {guard.phone}
              </p>
            </div>
          </div>
        ) : (
          <p className="rounded-[10px] border border-danger/30 bg-danger/[0.05] px-3 py-2.5 text-[13px] font-medium text-danger">
            No guard checked in for this shift.
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
          <ClipboardText size={14} /> Patrol log
        </h3>
        {site.patrolLog.length ? (
          <ol className="relative flex flex-col gap-3 pl-1">
            <span className="absolute bottom-2 left-[5px] top-2 w-px bg-border-soft" aria-hidden />
            {site.patrolLog.map((p, i) => (
              <li key={i} className="relative flex gap-3">
                <span className="z-10 mt-1 size-2.5 shrink-0 rounded-full bg-accent ring-4 ring-surface" />
                <div>
                  <p className="text-[12.5px] text-ink">{p.note}</p>
                  <p className="text-[11px] text-ink-faint">{p.time}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-[13px] text-ink-muted">No patrol entries — nobody on site.</p>
        )}
      </section>

      {site.incidents.length > 0 && (
        <section>
          <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
            Incident reports
          </h3>
          {site.incidents.map((inc, i) => (
            <div key={i} className="flex gap-3 rounded-[10px] border border-warning/30 bg-warning/[0.05] p-3">
              <PhotoTile caption={inc.time} seed={2} className="w-28 shrink-0" ratio="aspect-square" />
              <p className="text-[12.5px] leading-relaxed text-ink">{inc.note}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function TimeCell({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    neutral: "text-ink",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  }[tone];
  return (
    <div className="rounded-[10px] border border-border bg-bg px-3 py-2.5">
      <p className="text-[11px] text-ink-faint">{label}</p>
      <p className={cn("mt-0.5 text-[15px] font-semibold tracking-tight", toneClass)}>{value}</p>
    </div>
  );
}
