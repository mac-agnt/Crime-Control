"use client";

import { useRouter } from "next/navigation";
import { MagnifyingGlass, MoonStars, SunDim, List } from "@phosphor-icons/react";
import { Avatar } from "./ui/Avatar";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export function Topbar({
  onSearch,
  onMenu,
}: {
  onSearch: () => void;
  onMenu: () => void;
}) {
  const router = useRouter();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md md:px-6">
      <button
        onClick={onMenu}
        className="flex size-9 items-center justify-center rounded-[10px] text-ink-muted hover:bg-border-soft hover:text-ink md:hidden"
        aria-label="Open menu"
      >
        <List size={19} />
      </button>

      <button
        onClick={onSearch}
        className="flex h-10 w-full max-w-sm items-center gap-2.5 rounded-[10px] border border-border bg-bg px-3 text-left text-[13px] text-ink-faint transition-colors hover:border-ink-faint/40"
      >
        <MagnifyingGlass size={16} />
        <span className="hidden sm:inline">Search anything...</span>
        <span className="sm:hidden">Search</span>
        <kbd className="ml-auto hidden items-center rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-ink-faint sm:flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          aria-label="Toggle theme"
          className="flex size-9 items-center justify-center rounded-[10px] text-ink-muted hover:bg-border-soft hover:text-ink"
        >
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex"
          >
            {theme === "dark" ? <MoonStars size={18} /> : <SunDim size={18} />}
          </motion.span>
        </motion.button>

        <button
          onClick={() => router.push("/settings")}
          aria-label="Open profile settings"
          className="ml-1 rounded-full ring-offset-2 ring-offset-bg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <Avatar initials="MA" size={34} />
        </button>
      </div>
    </header>
  );
}
