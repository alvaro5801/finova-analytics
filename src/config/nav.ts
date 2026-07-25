import type { LucideIcon } from "lucide-react";
import {
  ChartColumn,
  CreditCard,
  FileText,
  House,
  Rocket,
  User,
  Wrench,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Tables", href: "/tables", icon: ChartColumn },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "RTL", href: "/rtl", icon: Wrench },
];

export const accountNavItems: NavItem[] = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Sign In", href: "/sign-in", icon: FileText },
  { label: "Sign Up", href: "/sign-up", icon: Rocket },
];

export const allNavItems = [...mainNavItems, ...accountNavItems];
