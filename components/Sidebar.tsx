"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLineLeft, CaretLineRight, Stack } from "@phosphor-icons/react";
import { primaryNav, secondaryNav } from "@/lib/nav";
import { Avatar } from "./ui/Avatar";
import { springSoft } from "@/lib/motion";
import clsx from "clsx";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 248 }}
      transition={springSoft}
      className="relative hidden shrink-0 flex-col md:flex"
    >
      <div className="flex h-16 items-center gap-2.5 px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-accent text-accent-ink">
          <Stack weight="fill" size={18} />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="text-[15px] font-semibold leading-tight text-ink">
                Northbeam
              </p>
              <p className="text-[11px] leading-tight text-ink-faint">
                Workspace
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {primaryNav.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group relative flex h-10 items-center gap-3 rounded-[10px] px-3 text-[13.5px] font-medium transition-colors duration-150",
                active
                  ? "text-accent-strong"
                  : "text-ink-muted hover:text-ink hover:bg-border-soft"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-[10px] bg-surface shadow-[0_1px_0_rgba(15,23,42,0.02)]"
                  transition={springSoft}
                />
              )}
              <Icon
                size={19}
                weight={active ? "fill" : "regular"}
                className="relative z-10 shrink-0"
              />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="mx-1 mb-1 flex flex-col gap-0.5 rounded-2xl border border-border bg-surface p-2 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
        {secondaryNav.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group relative flex h-10 items-center gap-3 rounded-[10px] px-3 text-[13.5px] font-medium transition-colors duration-150",
                active
                  ? "text-accent-strong"
                  : "text-ink-muted hover:text-ink hover:bg-border-soft"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-secondary"
                  className="absolute inset-0 rounded-[10px] bg-bg"
                  transition={springSoft}
                />
              )}
              <Icon size={19} weight={active ? "fill" : "regular"} className="relative z-10" />
              {!collapsed && <span className="relative z-10">{item.label}</span>}
            </Link>
          );
        })}

        <button
          onClick={() => router.push("/settings")}
          className="mt-1 flex h-12 items-center gap-2.5 rounded-[10px] px-2.5 text-left transition-colors duration-150 hover:bg-border-soft"
        >
          <Avatar initials="MA" size={32} />
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <p className="truncate text-[13px] font-semibold leading-tight text-ink">
                Mac O&apos;Brien
              </p>
              <p className="truncate text-[11px] leading-tight text-ink-faint">
                View profile
              </p>
            </div>
          )}
        </button>
      </div>

      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-16 flex size-6 items-center justify-center rounded-full border border-border bg-surface text-ink-faint shadow-sm transition-colors hover:text-ink"
      >
        {collapsed ? <CaretLineRight size={12} /> : <CaretLineLeft size={12} />}
      </button>
    </motion.aside>
  );
}
