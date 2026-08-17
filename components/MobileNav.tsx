"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Stack } from "@phosphor-icons/react";
import { primaryNav, secondaryNav } from "@/lib/nav";
import { ease } from "@/lib/motion";
import clsx from "clsx";

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.28, ease }}
            className="absolute inset-y-0 left-0 flex w-[78vw] max-w-[280px] flex-col bg-surface"
          >
            <div className="flex h-16 items-center gap-2.5 px-4">
              <div className="flex size-9 items-center justify-center rounded-[10px] bg-accent text-accent-ink">
                <Stack weight="fill" size={18} />
              </div>
              <p className="text-[15px] font-semibold text-ink">Northbeam</p>
              <button
                onClick={onClose}
                className="ml-auto flex size-9 items-center justify-center rounded-[10px] text-ink-faint hover:bg-border-soft"
              >
                <X size={17} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
              {[...primaryNav, ...secondaryNav].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={clsx(
                      "flex h-11 items-center gap-3 rounded-[10px] px-3 text-[14px] font-medium",
                      active
                        ? "bg-bg text-accent-strong"
                        : "text-ink-muted hover:bg-border-soft hover:text-ink"
                    )}
                  >
                    <Icon size={19} weight={active ? "fill" : "regular"} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
