import Image from "next/image";

export type AppKey = "gmail" | "whatsapp" | "calendar" | "aib";

const sources: Record<AppKey, string> = {
  gmail: "/logos/gmail.png",
  whatsapp: "/logos/whatsapp.png",
  calendar: "/logos/calendar.png",
  aib: "/logos/aib.png",
};

// Gmail and WhatsApp source images are transparent marks with no baked-in
// badge, so they render bare (no card bg/shadow) instead of boxed.
const hasBadgeBg: Record<AppKey, boolean> = {
  gmail: false,
  whatsapp: false,
  calendar: true,
  aib: true,
};

export function AppLogo({
  app,
  size = 36,
  className,
}: {
  app: AppKey;
  size?: number;
  className?: string;
}) {
  const badged = hasBadgeBg[app];

  return (
    <span
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[11px] ${
        badged ? "bg-white shadow-[0_1px_3px_rgba(15,23,42,0.15)]" : ""
      } ${className ?? ""}`}
    >
      <Image
        src={sources[app]}
        alt=""
        width={size}
        height={size}
        className={badged ? "size-full object-cover" : "size-full object-contain"}
        unoptimized
      />
    </span>
  );
}
