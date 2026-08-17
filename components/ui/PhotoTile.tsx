"use client";

import { Camera } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

// A styled stand-in for a captured photo. Renders fully offline (no network
// image) so it never shows as a broken image during a live demo.
export function PhotoTile({
  caption,
  seed = 0,
  className,
  ratio = "aspect-[4/3]",
}: {
  caption?: string;
  seed?: number;
  className?: string;
  ratio?: string;
}) {
  const hues = [
    "from-accent-soft to-border-soft",
    "from-success/20 to-border-soft",
    "from-warning/20 to-border-soft",
    "from-border to-surface-raised",
  ];
  return (
    <div className={cn("overflow-hidden rounded-[12px] border border-border", className)}>
      <div className={cn("relative flex items-center justify-center bg-gradient-to-br", hues[seed % hues.length], ratio)}>
        <Camera size={26} weight="duotone" className="text-ink-faint/70" />
        {caption && (
          <span className="absolute inset-x-0 bottom-0 truncate bg-ink/45 px-2.5 py-1 text-[11px] font-medium text-white">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
