import type { AppKey } from "@/components/icons/AppLogo";

export type PushNotification = {
  id: string;
  app: AppKey;
  appLabel: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
};

export const notifications: PushNotification[] = [
  {
    id: "n1",
    app: "gmail",
    appLabel: "Gmail",
    title: "Fitzgerald Property Group",
    detail: "Guard hasn't arrived at Grangegorman Block C — can someone confirm?",
    time: "14m ago",
    unread: true,
  },
  {
    id: "n2",
    app: "whatsapp",
    appLabel: "WhatsApp",
    title: "Tomasz Mensah",
    detail: "Yeah I can take the Naas cover tonight, on my way.",
    time: "22m ago",
    unread: true,
  },
  {
    id: "n3",
    app: "calendar",
    appLabel: "Calendar",
    title: "Night shift starts in 30 minutes",
    detail: "18 sites rostered · 6 still unfilled",
    time: "31m ago",
    unread: false,
  },
  {
    id: "n4",
    app: "aib",
    appLabel: "AIB",
    title: "Payment received",
    detail: "Blackwood Estates paid invoice 4821 for €2,140.",
    time: "1h ago",
    unread: false,
  },
];
