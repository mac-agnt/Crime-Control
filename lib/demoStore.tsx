"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { jobs as seedJobs, nextJobRef, type Job, type JobType } from "@/lib/data";

type RaiseJobInput = {
  clientId: string;
  address: string;
  type: JobType;
  detail: string;
  from: string;
};

type DemoStore = {
  jobs: Job[];
  addJob: (input: RaiseJobInput) => Job;
  advanceJob: (id: string, status: Job["status"]) => void;
  lastRaisedId: string | null;
};

const Ctx = createContext<DemoStore | null>(null);

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [lastRaisedId, setLastRaisedId] = useState<string | null>(null);

  const value = useMemo<DemoStore>(
    () => ({
      jobs,
      lastRaisedId,
      addJob: (input) => {
        const { id, ref } = nextJobRef();
        const job: Job = {
          id,
          ref,
          address: input.address,
          clientId: input.clientId,
          type: input.type,
          contractor: null,
          raised: "17/08/2026",
          slaHours: 24,
          status: "Requested",
          emailFrom: input.from,
          emailSubject: `${input.type} request — ${input.address}`,
          emailBody: `From: ${input.from}\n\n${input.detail}\n\nRaised via client portal`,
          notes: [],
          proof: false,
        };
        setJobs((prev) => [job, ...prev]);
        setLastRaisedId(id);
        return job;
      },
      advanceJob: (id, status) =>
        setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j))),
    }),
    [jobs, lastRaisedId]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoStore(): DemoStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemoStore must be used within DemoStoreProvider");
  return ctx;
}
