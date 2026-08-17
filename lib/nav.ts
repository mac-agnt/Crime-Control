import type { Icon } from "@phosphor-icons/react";
import {
  Sparkle,
  MapPin,
  Lifebuoy,
  CalendarBlank,
  Clock,
  Package,
  Buildings,
  Wrench,
  Globe,
  Gear,
} from "@phosphor-icons/react/dist/ssr";
import { sites, openShifts } from "@/lib/data";

export type NavItem = {
  label: string;
  href: string;
  icon: Icon;
  slug: string;
  badge?: number;
};

const alertCount = sites.filter((s) => s.status === "No show" || s.status === "Late").length;
const coverCount = openShifts.length;

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: Sparkle, slug: "home" },
  { label: "Live Sites", href: "/sites", icon: MapPin, slug: "sites", badge: alertCount },
  { label: "Cover Desk", href: "/cover", icon: Lifebuoy, slug: "cover", badge: coverCount },
  { label: "Roster", href: "/roster", icon: CalendarBlank, slug: "roster" },
  { label: "Timesheets", href: "/timesheets", icon: Clock, slug: "timesheets" },
  { label: "Equipment", href: "/equipment", icon: Package, slug: "equipment" },
  { label: "Clients", href: "/clients", icon: Buildings, slug: "clients" },
  { label: "Property Jobs", href: "/jobs", icon: Wrench, slug: "jobs" },
  { label: "Client Portal", href: "/portal", icon: Globe, slug: "portal" },
];

export const secondaryNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Gear, slug: "settings" },
];

export const allNav = [...primaryNav, ...secondaryNav];
