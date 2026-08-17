import { cn } from "@/lib/cn";

export function Avatar({
  initials,
  size = 36,
  className,
}: {
  initials: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex items-center justify-center rounded-full bg-accent text-accent-ink font-semibold shrink-0",
        className
      )}
    >
      <span style={{ fontSize: size * 0.38 }}>{initials}</span>
    </div>
  );
}
