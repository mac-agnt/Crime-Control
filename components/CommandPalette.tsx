"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MagnifyingGlass, ArrowElbowDownLeft } from "@phosphor-icons/react";
import { allNav } from "@/lib/nav";
import { ease } from "@/lib/motion";

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allNav;
    return allNav.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset highlight when the query or open state (parent-controlled) changes
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale query when the palette (parent-controlled) opens
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[activeIndex]) {
        router.push(results[activeIndex].href);
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, activeIndex, onClose, router]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/30 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)]"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <MagnifyingGlass size={18} className="text-ink-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, actions..."
                className="h-12 w-full bg-transparent text-[14px] text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <kbd className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-ink-faint">
                Esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-6 text-center text-[13px] text-ink-faint">
                  No results for &quot;{query}&quot;
                </p>
              )}
              {results.map((item, index) => {
                const Icon = item.icon;
                const active = index === activeIndex;
                return (
                  <button
                    key={item.href}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      router.push(item.href);
                      onClose();
                    }}
                    className={`relative flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[13.5px] transition-colors ${
                      active ? "bg-accent-soft text-accent-strong" : "text-ink-muted"
                    }`}
                  >
                    <Icon size={17} weight={active ? "fill" : "regular"} />
                    <span className="font-medium">{item.label}</span>
                    {active && (
                      <ArrowElbowDownLeft
                        size={13}
                        className="ml-auto text-accent-strong/70"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
