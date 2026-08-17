import type { Icon } from "@phosphor-icons/react";
import {
  Sparkle,
  House,
  SquaresFour,
  Kanban,
  CalendarBlank,
  ChartLineUp,
  FileText,
  Users,
  AddressBook,
  ChatCircleDots,
  Lightning,
  Gear,
} from "@phosphor-icons/react/dist/ssr";

export type NavItem = {
  label: string;
  href: string;
  icon: Icon;
  slug: string;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: Sparkle, slug: "home" },
  { label: "Dashboard", href: "/dashboard", icon: House, slug: "dashboard" },
  { label: "Feed", href: "/test/feed", icon: SquaresFour, slug: "feed" },
  { label: "Projects", href: "/test/projects", icon: Kanban, slug: "projects" },
  { label: "Schedule", href: "/test/schedule", icon: CalendarBlank, slug: "schedule" },
  { label: "Analytics", href: "/test/analytics", icon: ChartLineUp, slug: "analytics" },
  { label: "Reports", href: "/test/reports", icon: FileText, slug: "reports" },
  { label: "Team", href: "/test/team", icon: Users, slug: "team" },
  { label: "Directory", href: "/test/directory", icon: AddressBook, slug: "directory" },
  { label: "Messages", href: "/test/messages", icon: ChatCircleDots, slug: "messages" },
  { label: "Automations", href: "/test/automations", icon: Lightning, slug: "automations" },
];

export const secondaryNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Gear, slug: "settings" },
];

export const allNav = [...primaryNav, ...secondaryNav];
