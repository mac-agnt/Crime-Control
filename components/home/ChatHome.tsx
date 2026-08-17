"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Paperclip,
  Microphone,
  Sparkle,
  Kanban,
  Plus,
  WarningCircle,
  NotePencil,
  CalendarBlank,
} from "@phosphor-icons/react";
import { ease, fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { HomeRail } from "@/components/home/HomeRail";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const suggestions = [
  { icon: WarningCircle, label: "What's blocked this week?" },
  { icon: Kanban, label: "Summarise my open projects" },
  { icon: NotePencil, label: "Draft today's standup notes" },
  { icon: CalendarBlank, label: "Who's free for a sync tomorrow?" },
];

const canned = [
  "Here's a quick summary based on what's in your workspace right now.",
  "Good question. Looking at recent activity, that's held steady this week.",
  "Done. I've drafted that and left it in your notes for review.",
  "Three projects touch that area. Checkout redesign is the one closest to done.",
];

export function ChatHome() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setStarted(true);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: value },
    ]);
    setDraft("");
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: canned[Math.floor(Math.random() * canned.length)],
        },
      ]);
    }, 1000 + Math.random() * 500);
  }

  function reset() {
    setStarted(false);
    setMessages([]);
    setDraft("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className="grid min-h-[520px] grid-cols-1 gap-6 lg:h-[calc(100dvh-9.5rem)] lg:grid-cols-[1fr_340px]">
    <div className="relative flex min-h-0 flex-col overflow-hidden lg:h-full">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[42%] top-1/2 h-80 w-[48rem] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-full bg-glow/60 blur-[100px]" />
        <div className="absolute left-[42%] top-1/2 h-32 w-80 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-full bg-glow/90 blur-[30px]" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {started ? (
          <motion.div
            key="conversation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="mb-1 flex shrink-0 items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-accent-strong">
                  <Sparkle size={15} weight="fill" />
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold leading-tight text-ink">
                    Assistant
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] leading-tight text-ink-faint">
                    <span className="size-1.5 rounded-full bg-success animate-pulse-dot" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium text-ink-faint transition-colors hover:bg-border-soft hover:text-ink"
              >
                <Plus size={14} />
                New chat
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-1 py-4"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-sm bg-accent text-accent-ink"
                        : "rounded-bl-sm bg-surface text-ink"
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-ink-faint"
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-1 shrink-0">
              <PromptInput
                value={draft}
                onChange={setDraft}
                onSubmit={() => send(draft)}
                placeholder="Message assistant..."
                autoFocus
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
              <motion.span
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.35, ease }}
                className="mb-5 flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent-strong"
              >
                <Sparkle size={18} weight="fill" />
              </motion.span>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.35, delay: 0.05, ease }}
                className="inline-flex flex-col items-center"
              >
                <h1 className="text-[26px] font-medium tracking-tight text-ink sm:text-[30px]">
                  Good afternoon, Mac
                </h1>
                <motion.div
                  className="mt-2 h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 64, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6, ease }}
                />
              </motion.div>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.35, delay: 0.1, ease }}
                className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-faint"
              >
                Ask anything about your workspace, or jump back in below.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.35, delay: 0.15, ease }}
                className="mt-7 w-full max-w-xl"
              >
                <PromptInput
                  value={draft}
                  onChange={setDraft}
                  onSubmit={() => send(draft)}
                  placeholder="Ask Northbeam anything..."
                  size="lg"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer(0.05, 0.2)}
                initial="hidden"
                animate="show"
                className="mt-4 flex flex-wrap justify-center gap-2"
              >
                {suggestions.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.button
                      key={s.label}
                      variants={fadeUp}
                      transition={{ duration: 0.25, ease }}
                      onClick={() => send(s.label)}
                      className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium text-ink-faint transition-colors hover:bg-border-soft hover:text-ink"
                    >
                      <Icon size={13} />
                      {s.label}
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <div className="lg:overflow-y-auto">
      <HomeRail />
    </div>
  </div>
  );
}

function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  size = "md",
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) requestAnimationFrame(() => ref.current?.focus());
  }, [autoFocus]);

  return (
    <div
      className={cn(
        "flex items-end gap-1 rounded-[26px] border border-transparent bg-surface/70 px-2.5 backdrop-blur-xl transition-all duration-200 focus-within:border-accent/25 focus-within:bg-surface",
        size === "lg" ? "py-2.5" : "py-1.5"
      )}
    >
      <button
        type="button"
        aria-label="Attach file"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-border-soft hover:text-ink"
      >
        <Paperclip size={16} />
      </button>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        rows={1}
        placeholder={placeholder}
        className={cn(
          "max-h-32 min-h-6 flex-1 resize-none bg-transparent text-ink placeholder:text-ink-faint focus:outline-none",
          size === "lg" ? "text-[14.5px] py-1.5" : "text-[13.5px] py-1"
        )}
      />
      <button
        type="button"
        aria-label="Voice input"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-border-soft hover:text-ink"
      >
        <Microphone size={16} />
      </button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onSubmit}
        disabled={!value.trim()}
        aria-label="Send message"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream text-cream-ink transition-opacity disabled:opacity-30"
      >
        <ArrowUp size={15} weight="bold" />
      </motion.button>
    </div>
  );
}
