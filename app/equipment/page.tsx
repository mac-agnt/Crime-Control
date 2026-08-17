"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Package, TrendUp, Warning, CurrencyEur, ArrowsClockwise } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { FilterChips } from "@/components/ui/FilterChips";
import { assets, equipmentStats, getClient, type Asset, type EquipmentStatus } from "@/lib/data";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/cn";

const statusTone: Record<EquipmentStatus, "success" | "accent" | "danger" | "neutral"> = {
  "In store": "neutral",
  "Out on hire": "accent",
  Overdue: "danger",
  "Written off": "neutral",
};
const eur = (n: number) => "€" + n.toLocaleString("en-IE");

export default function EquipmentPage() {
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      assets.filter(
        (a) => (status === "all" || a.status === status) && (type === "all" || a.type === type)
      ),
    [status, type]
  );
  const asset = openId ? assets.find((a) => a.id === openId) ?? null : null;

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: assets.length };
    assets.forEach((a) => (c[a.status] = (c[a.status] || 0) + 1));
    return c;
  }, []);

  return (
    <div>
      <PageHeader
        title="Equipment Register"
        subtitle="Every heater, fridge and cooker out on hire, and the ones that never came back. The number Christy has never seen is top-left."
      />

      <motion.div variants={staggerContainer(0.06)} initial="hidden" animate="show" className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile icon={Package} label="Units owned" value={String(equipmentStats.owned)} tone="neutral" />
        <StatTile icon={ArrowsClockwise} label="Out on hire" value={String(equipmentStats.out)} tone="accent" />
        <StatTile icon={Warning} label="Overdue" value={String(equipmentStats.overdue)} tone="warning" />
        <StatTile icon={TrendUp} label="Loss rate" value={`${equipmentStats.lossRate}%`} tone="danger" hint="of stock unrecovered" />
        <StatTile icon={CurrencyEur} label="Value unrecovered" value={eur(equipmentStats.unrecovered)} tone="danger" />
      </motion.div>

      <div className="mb-3 flex flex-col gap-2.5">
        <FilterChips
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All", count: statusCounts.all },
            { value: "In store", label: "In store", count: statusCounts["In store"] },
            { value: "Out on hire", label: "Out on hire", count: statusCounts["Out on hire"] },
            { value: "Overdue", label: "Overdue", count: statusCounts["Overdue"] },
            { value: "Written off", label: "Written off", count: statusCounts["Written off"] },
          ]}
        />
        <FilterChips
          value={type}
          onChange={setType}
          options={[
            { value: "all", label: "All types" },
            { value: "Heater", label: "Heater" },
            { value: "Fridge", label: "Fridge" },
            { value: "Cooker", label: "Cooker" },
            { value: "Dehumidifier", label: "Dehumidifier" },
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              {["Asset ID", "Type", "Condition", "Status", "Unit / tenant", "Out", "Due back", "Deposit"].map((h) => (
                <th key={h} className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr
                key={a.id}
                onClick={() => setOpenId(a.id)}
                className={cn(
                  "cursor-pointer border-b border-border-soft last:border-0 transition-colors hover:bg-border-soft/50",
                  a.status === "Overdue" && "bg-danger/[0.05] hover:bg-danger/[0.08]"
                )}
              >
                <td className="px-4 py-3 font-mono text-[12.5px] text-ink">{a.id}</td>
                <td className="px-4 py-3 text-[13px] text-ink">{a.type}</td>
                <td className="px-4 py-3 text-[13px] text-ink-muted">{a.condition}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[a.status]} dot>
                    {a.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-[13px] text-ink">
                  {a.unit ? (
                    <>
                      <span className="font-medium">{a.unit}</span>
                      <span className="text-ink-faint"> · {a.tenant}</span>
                    </>
                  ) : (
                    <span className="text-ink-faint">In store</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[13px] text-ink-muted">{a.dateOut ?? "—"}</td>
                <td className={cn("px-4 py-3 text-[13px]", a.status === "Overdue" ? "font-semibold text-danger" : "text-ink-muted")}>
                  {a.dateDue ?? "—"}
                </td>
                <td className="px-4 py-3 text-[13px] text-ink">{a.deposit ? `€${a.deposit}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer
        open={!!asset}
        onClose={() => setOpenId(null)}
        title={asset ? `${asset.type} · ${asset.id}` : ""}
        subtitle={asset ? `${asset.condition} condition · ${asset.status}` : ""}
      >
        {asset && <AssetDetail asset={asset} />}
      </Drawer>
    </div>
  );
}

function AssetDetail({ asset }: { asset: Asset }) {
  const client = getClient(asset.clientId);
  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 text-[12.5px]">
        <Field label="Status" value={asset.status} />
        <Field label="Value" value={`€${asset.value}`} />
        <Field label="Unit" value={asset.unit ?? "In store"} />
        <Field label="Tenant" value={asset.tenant ?? "—"} />
        <Field label="Managed for" value={client?.name ?? "—"} />
        <Field label="Deposit held" value={asset.deposit ? `€${asset.deposit}` : "Forfeited"} />
      </section>

      <section>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">Condition photos</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <PhotoTile caption="At issue" seed={1} />
            <p className="mt-1 text-center text-[11px] text-ink-faint">{asset.dateOut ?? "—"}</p>
          </div>
          <div>
            <PhotoTile caption={asset.status === "Overdue" || asset.status === "Written off" ? "Not returned" : "At return"} seed={asset.status === "Overdue" ? 2 : 0} />
            <p className="mt-1 text-center text-[11px] text-ink-faint">
              {asset.status === "Out on hire" ? "On hire" : asset.status === "In store" ? "Back in store" : "—"}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">Movement history</h3>
        <ol className="relative flex flex-col gap-3 pl-1">
          <span className="absolute bottom-2 left-[5px] top-2 w-px bg-border-soft" aria-hidden />
          {asset.history.map((h, i) => (
            <li key={i} className="relative flex gap-3">
              <span className="z-10 mt-1 size-2.5 shrink-0 rounded-full bg-accent ring-4 ring-surface" />
              <div>
                <p className="text-[12.5px] text-ink">{h.note}</p>
                <p className="text-[11px] text-ink-faint">{h.date}</p>
              </div>
            </li>
          ))}
        </ol>
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
