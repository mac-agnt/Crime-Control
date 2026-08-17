"use client";

import { cn } from "@/lib/cn";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border bg-surface", className)}>
      <table className="w-full min-w-[720px] border-collapse text-left">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-border">
      <tr>{children}</tr>
    </thead>
  );
}

export function TH({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint",
        className
      )}
    >
      {children}
    </th>
  );
}

export function TR({
  children,
  className,
  onClick,
  highlight,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  highlight?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-border-soft last:border-0 transition-colors",
        onClick && "cursor-pointer hover:bg-border-soft/50",
        highlight && "bg-danger/[0.05]",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TD({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 text-[13px] text-ink", className)}>{children}</td>;
}
