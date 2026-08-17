"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, House, EnvelopeSimple, ArrowUpRight } from "@phosphor-icons/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Sparkline } from "@/components/ui/Sparkline";
import { FilterChips } from "@/components/ui/FilterChips";
import {
  clients,
  clientShare,
  topTwoShare,
  REVENUE_TARGET,
  singleServiceClients,
  crossSell,
  getSite,
  sites,
  type Client,
} from "@/lib/data";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const eur = (n: number) => "€" + n.toLocaleString("en-IE");

export default function ClientsPage() {
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = useMemo(() => [...clients].sort((a, b) => b.monthlyValue - a.monthlyValue), []);
  const rows = filter === "single" ? sorted.filter((c) => c.services.length === 1) : sorted;
  const client = openId ? clients.find((c) => c.id === openId) ?? null : null;

  return (
    <div>
      <PageHeader
        title="Client Book"
        subtitle="Who you bill, who leans on you too heavily, and who only takes half of what you do. The 40% problem, answered from your own list."
      />

      {/* revenue concentration */}
      <Card className="mb-5">
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">
          Your top 2 clients are {topTwoShare}% of revenue. Target is {REVENUE_TARGET}%.
        </h2>
        <p className="mt-1 text-[13px] text-ink-muted">Monthly revenue by client, largest first.</p>
        <ConcentrationBar />
      </Card>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All clients", count: clients.length },
            { value: "single", label: "Single service only", count: singleServiceClients.length },
          ]}
        />
        {filter === "single" && (
          <p className="text-[12.5px] font-medium text-accent-strong">
            {rows.length} loyal clients holding only one of your two services.
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              {["Client", "Services", "Sites", "Monthly", "Share", "Renewal", "Last contact"].map((h) => (
                <th key={h} className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const share = clientShare(c);
              const siteCount = sites.filter((s) => s.clientId === c.id).length;
              return (
                <tr
                  key={c.id}
                  onClick={() => setOpenId(c.id)}
                  className="cursor-pointer border-b border-border-soft last:border-0 transition-colors hover:bg-border-soft/50"
                >
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-ink">{c.name}</p>
                    <p className="text-[11px] text-ink-faint">{c.loyaltyYears} years</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <ServiceBadge held={c.services.includes("guarding")} icon={ShieldCheck} label="Guarding" />
                      <ServiceBadge held={c.services.includes("property")} icon={House} label="Property" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ink">{siteCount || "—"}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-ink">{eur(c.monthlyValue)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-[13px] font-semibold", share >= 15 ? "text-danger" : "text-ink")}>
                      {share.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ink-muted">{c.renewal}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-muted">
                    {c.lastContact} <span className="text-ink-faint">· {c.lastContactDays}d ago</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Drawer
        open={!!client}
        onClose={() => setOpenId(null)}
        title={client?.name ?? ""}
        subtitle={client ? `${client.loyaltyYears} years · ${eur(client.monthlyValue)}/mo` : ""}
      >
        {client && <ClientDetail client={client} />}
      </Drawer>
    </div>
  );
}

function ServiceBadge({ held, icon: IconCmp, label }: { held: boolean; icon: typeof House; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        held ? "bg-accent-soft text-accent-strong" : "border border-dashed border-border text-ink-faint"
      )}
    >
      <IconCmp size={11} weight={held ? "fill" : "regular"} />
      {label}
    </span>
  );
}

function ConcentrationBar() {
  const sorted = [...clients].sort((a, b) => b.monthlyValue - a.monthlyValue);
  return (
    <div className="mt-5">
      <div className="relative">
        <div className="flex h-9 w-full overflow-hidden rounded-[8px]">
          {sorted.map((c, i) => {
            const share = clientShare(c);
            return (
              <div
                key={c.id}
                style={{ width: `${share}%` }}
                title={`${c.name} · ${share.toFixed(1)}%`}
                className={cn(
                  "h-full border-r border-surface transition-opacity hover:opacity-90",
                  i === 0 ? "bg-danger" : i === 1 ? "bg-warning" : "bg-accent"
                )}
              />
            );
          })}
        </div>
        {/* target line */}
        <div
          className="absolute -top-1 bottom-[-1.4rem] w-px border-l-2 border-dashed border-ink"
          style={{ left: `${REVENUE_TARGET}%` }}
        >
          <span className="absolute -left-1 -top-5 whitespace-nowrap text-[10.5px] font-semibold text-ink">
            {REVENUE_TARGET}% target
          </span>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4 text-[11.5px] text-ink-muted">
        <Legend cls="bg-danger" label={`${sorted[0].name} · ${clientShare(sorted[0]).toFixed(1)}%`} />
        <Legend cls="bg-warning" label={`${sorted[1].name} · ${clientShare(sorted[1]).toFixed(1)}%`} />
        <Legend cls="bg-accent" label="All other clients" />
      </div>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-sm", cls)} />
      {label}
    </span>
  );
}

function ClientDetail({ client }: { client: Client }) {
  const clientSites = sites.filter((s) => s.clientId === client.id);
  const cross = crossSell(client);
  const trend = [8, 9, 8, 10, 11, 10, 12, 11].map((n) => n + client.loyaltyYears / 8);
  const activity = [
    { dir: "in", text: `${client.contacts[0].name} sent the monthly report request`, time: `${client.lastContactDays}d ago` },
    { dir: "out", text: "Invoice 4821 issued and emailed to accounts", time: "6d ago" },
    { dir: "in", text: "Estate agent forwarded a new void inspection", time: "9d ago" },
    { dir: "out", text: "Night report PDF sent for last week's sites", time: "12d ago" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">Revenue trend</h3>
        <div className="flex items-end justify-between rounded-[10px] border border-border bg-bg px-4 py-3">
          <div>
            <p className="text-2xl font-semibold text-ink">{eur(client.monthlyValue)}</p>
            <p className="text-[11.5px] text-ink-faint">per month · {clientShare(client).toFixed(1)}% of revenue</p>
          </div>
          <Sparkline data={trend} color="var(--color-accent)" />
        </div>
      </section>

      {cross && (
        <section className="rounded-[12px] border border-accent/30 bg-accent-soft/40 p-4">
          <div className="flex items-center gap-2">
            <ArrowUpRight size={16} className="text-accent-strong" weight="bold" />
            <h3 className="text-[13px] font-semibold text-ink">Cross-sell opportunity</h3>
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
            {client.name} takes {client.services[0] === "guarding" ? "guarding" : "property management"} only. A comparable
            client on {cross.missing === "guarding" ? "guarding" : "property management"} is worth about{" "}
            <span className="font-semibold text-ink">{eur(cross.peerValue)}/mo</span>.
          </p>
        </section>
      )}

      <section>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">Contacts</h3>
        <div className="flex flex-col gap-2">
          {client.contacts.map((ct) => (
            <div key={ct.email} className="flex items-center gap-3 rounded-[10px] border border-border bg-bg px-3 py-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-strong">
                {ct.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-ink">{ct.name}</p>
                <p className="truncate text-[11.5px] text-ink-faint">{ct.role} · {ct.email}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
          Sites ({clientSites.length})
        </h3>
        {clientSites.length ? (
          <div className="flex flex-col gap-1.5">
            {clientSites.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-[10px] border border-border bg-bg px-3 py-2 text-[12.5px]">
                <span className="font-medium text-ink">{s.name}</span>
                <span className="text-ink-faint">{s.type}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-ink-muted">Property-only client, no guarding sites.</p>
        )}
      </section>

      <section>
        <h3 className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
          <EnvelopeSimple size={14} /> Email traffic
        </h3>
        <ol className="flex flex-col gap-2.5">
          {activity.map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                  a.dir === "in" ? "bg-accent-soft text-accent-strong" : "bg-success/15 text-success"
                )}
              >
                {a.dir === "in" ? "In" : "Out"}
              </span>
              <div>
                <p className="text-[12.5px] text-ink">{a.text}</p>
                <p className="text-[11px] text-ink-faint">{a.time}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
