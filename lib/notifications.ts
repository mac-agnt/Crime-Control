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
    title: "Priya Nair",
    detail: "Left a comment on Checkout redesign — could we tighten the copy here?",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    app: "whatsapp",
    appLabel: "WhatsApp",
    title: "Conor Murphy",
    detail: "Sent the onboarding deck, take a look before standup.",
    time: "12m ago",
    unread: true,
  },
  {
    id: "n3",
    app: "calendar",
    appLabel: "Calendar",
    title: "Standup starts in 15 minutes",
    detail: "Growth team daily sync · 9:30 AM",
    time: "25m ago",
    unread: false,
  },
  {
    id: "n4",
    app: "aib",
    appLabel: "AIB",
    title: "Payment received",
    detail: "Kilcullen Restoration paid invoice 4821 for €2,140.",
    time: "1h ago",
    unread: false,
  },
];
