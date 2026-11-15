import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  Building2,
  ChartLine,
  CodeXml,
  Gift,
  Headphones,
  Landmark,
  Megaphone,
  Receipt,
  RefreshCw,
  Scale,
  Server,
  TrendingUp,
  TriangleAlert,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** Chave de ícone vinda do banco (seed) → componente lucide. */
export const iconMap: Record<string, LucideIcon> = {
  "trending-up": TrendingUp,
  "chart-line": ChartLine,
  receipt: Receipt,
  wallet: Wallet,
  activity: Activity,
  users: Users,
  alert: TriangleAlert,
  megaphone: Megaphone,
  code: CodeXml,
  building: Building2,
  headphones: Headphones,
  truck: Truck,
  gift: Gift,
  "arrow-in": ArrowDownLeft,
  "arrow-out": ArrowUpRight,
  landmark: Landmark,
  server: Server,
  scale: Scale,
  refresh: RefreshCw,
};

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? Boxes;
}

/** Renderiza o ícone de `key` sem expor uma referência de componente a quem chama. */
export function renderIcon(key: string, props?: LucideProps) {
  const Icon = iconMap[key] ?? Boxes;
  return <Icon aria-hidden="true" {...props} />;
}
