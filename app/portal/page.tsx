"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Globe,
  CaretDown,
  CheckCircle,
  WarningCircle,
  DownloadSimple,
  PaperPlaneTilt,
  FileText,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field, TextInput } from "@/components/ui/Field";
import {
  portalAccounts,
  getClient,
  sites,
  type JobType,
} from "@/lib/data";
import { useDemoStore } from "@/lib/demoStore";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const JOB_TYPES: JobType[] = ["Repair", "Clean", "Void inspection", "Key handover", "Equipment delivery"];
const eur = (n: number) => "€" + n.toLocaleString("en-IE");

function download(name: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function PortalPage() {
  const router = useRouter();
  const { addJob } = useDemoStore();
  const [accountId, setAccountId] = useState(portalAccounts[0].clientId);
  const [accountOpen, setAccountOpen] = useState(false);

  const client = getClient(accountId)!;
  const clientSites = useMemo(() => sites.filter((s) => s.clientId === accountId), [accountId]);

  const [address, setAddress] = useState("");
  const [type, setType] = useState<JobType>("Repair");
  const [detail, setDetail] = useState("");

  const invoices = useMemo(
    () => [
      { ref: "INV-4821", period: "July 2026", amount: client.monthlyValue, status: "Paid" as const },
      { ref: "INV-4902", period: "August 2026", amount: client.monthlyValue, status: "Due" as const },
      { ref: "INV-4740", period: "June 2026", amount: client.monthlyValue, status: "Paid" as const },
    ],
    [client]
  );

  function submitJob(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    addJob({
      clientId: accountId,
      address: address.trim(),
      type,
      detail: detail.trim() || `${type} requested via portal.`,
      from: client.contacts[0].email,
    });
    router.push("/jobs");
  }

  return (
    <div>
      {/* portal banner */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, ease }}
        className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-gradient-to-br from-accent to-accent-strong px-6 py-5 text-accent-ink"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[12px] bg-accent-ink/15">
            <Globe size={20} weight="fill" />
          </span>
          <div>
            <p className="text-[12px] font-medium text-accent-ink/75">Client portal · this is what the estate agent sees</p>
            <h1 className="text-[19px] font-semibold tracking-tight">{client.name}</h1>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setAccountOpen((v) => !v)}
            className="flex items-center gap-2 rounded-[10px] border border-accent-ink/25 bg-accent-ink/10 px-3 py-2 text-[13px] font-medium"
          >
            Viewing as {client.name}
            <CaretDown size={14} />
          </button>
          {accountOpen && (
            <div className="absolute right-0 z-20 mt-1 w-64 overflow-hidden rounded-[10px] border border-border bg-surface text-ink shadow-lg">
              {portalAccounts.map((acc) => (
                <button
                  key={acc.clientId}
                  onClick={() => {
                    setAccountId(acc.clientId);
                    setAccountOpen(false);
                  }}
                  className={cn("block w-full px-3 py-2.5 text-left text-[13px] hover:bg-border-soft", acc.clientId === accountId ? "font-semibold text-accent-strong" : "")}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-5">
          {/* sites + attendance */}
          <Card>
            <h2 className="text-[15px] font-semibold text-ink">Your sites · last night</h2>
            <p className="mt-0.5 text-[12.5px] text-ink-faint">Attendance and any exceptions from the overnight shift.</p>
            <motion.div variants={staggerContainer(0.05)} initial="hidden" animate="show" className="mt-4 flex flex-col gap-2">
              {clientSites.length ? (
                clientSites.map((s) => {
                  const ok = s.status === "On site" || s.status === "Checked out";
                  return (
                    <motion.div key={s.id} variants={fadeUp} transition={{ duration: 0.28, ease }} className="flex items-center justify-between rounded-[10px] border border-border bg-bg px-3 py-2.5">
                      <div>
                        <p className="text-[13px] font-medium text-ink">{s.name}</p>
                        <p className="text-[11.5px] text-ink-faint">{s.window}</p>
                      </div>
                      {ok ? (
                        <span className="flex items-center gap-1.5 text-[12px] font-medium text-success">
                          <CheckCircle size={16} weight="fill" /> Covered
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[12px] font-medium text-danger">
                          <WarningCircle size={16} weight="fill" /> {s.status}
                        </span>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-[13px] text-ink-muted">No guarding sites on this account.</p>
              )}
            </motion.div>
          </Card>

          {/* invoices */}
          <Card className="p-0">
            <h2 className="px-5 pt-5 text-[15px] font-semibold text-ink">Invoices</h2>
            <div className="mt-3 divide-y divide-border-soft">
              {invoices.map((inv) => (
                <div key={inv.ref} className="flex items-center gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-ink">{inv.ref}</p>
                    <p className="text-[11.5px] text-ink-faint">{inv.period}</p>
                  </div>
                  <span className="text-[13px] font-semibold text-ink">{eur(inv.amount)}</span>
                  <Badge tone={inv.status === "Paid" ? "success" : "warning"} dot>
                    {inv.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      download(
                        `${inv.ref}.txt`,
                        `Crime Control\nInvoice ${inv.ref}\nClient: ${client.name}\nPeriod: ${inv.period}\nAmount: ${eur(inv.amount)}\nStatus: ${inv.status}\n`
                      )
                    }
                  >
                    <DownloadSimple size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* raise a job + report */}
        <div className="flex flex-col gap-5">
          <Card>
            <h2 className="text-[15px] font-semibold text-ink">Raise a job</h2>
            <p className="mt-0.5 text-[12.5px] text-ink-faint">Drops straight into the Crime Control jobs board.</p>
            <form onSubmit={submitJob} className="mt-4 flex flex-col gap-3.5">
              <Field label="Property address">
                <TextInput value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Apt 4, Rathmines Rd" />
              </Field>
              <Field label="Job type">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as JobType)}
                  className="h-10 rounded-[10px] border border-border bg-bg px-3 text-[13.5px] text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Details">
                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={3}
                  placeholder="What needs doing?"
                  className="resize-none rounded-[10px] border border-border bg-bg px-3 py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </Field>
              <Button type="submit" variant="primary" className="w-full">
                <PaperPlaneTilt size={15} weight="fill" />
                Submit request
              </Button>
            </form>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-[12px] bg-accent-soft text-accent-strong">
                <FileText size={20} weight="fill" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[14px] font-semibold text-ink">Monthly report</h2>
                <p className="text-[11.5px] text-ink-faint">August 2026 · sites, attendance, jobs</p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="mt-4 w-full"
              onClick={() =>
                download(
                  `crime-control-report-${client.name.replace(/\s/g, "-").toLowerCase()}-aug-2026.txt`,
                  `Crime Control — Monthly Report\nClient: ${client.name}\nPeriod: August 2026\n\nSites covered: ${clientSites.length}\nMonthly value: ${eur(client.monthlyValue)}\n\nAttendance summary and job history attached.\n`
                )
              }
            >
              <DownloadSimple size={15} />
              Download report
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
