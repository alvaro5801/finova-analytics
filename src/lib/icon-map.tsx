import {
  Bell,
  Boxes,
  Cable,
  CreditCard,
  FileText,
  Globe,
  Layers,
  MessageSquare,
  MousePointerClick,
  Package,
  PenTool,
  ShoppingCart,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  wallet: Wallet,
  users: Users,
  "user-plus": UserPlus,
  "chart-bar": TrendingUp,
  cursor: MousePointerClick,
  cart: ShoppingCart,
  trend: TrendingUp,
  bell: Bell,
  "credit-card": CreditCard,
  package: Package,
  globe: Globe,
  "file-text": FileText,
  figma: PenTool,
  atlassian: Boxes,
  slack: MessageSquare,
  spotify: Cable,
  jira: Boxes,
  invision: Layers,
};

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? Boxes;
}

/** Renders the icon for `key` without exposing a component reference to callers. */
export function renderIcon(key: string, props?: LucideProps) {
  const Icon = iconMap[key] ?? Boxes;
  return <Icon {...props} />;
}
