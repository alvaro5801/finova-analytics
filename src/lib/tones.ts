import type { StatColor } from "@/types/dashboard";

/** Chip de ícone por tom semântico (cor vinda do seed). */
export const toneChip: Record<StatColor, string> = {
  primary: "bg-primary/15 text-primary-light ring-primary/25",
  info: "bg-accent/10 text-accent ring-accent/25",
  success: "bg-success/10 text-success ring-success/25",
  warning: "bg-warning/10 text-warning ring-warning/25",
  danger: "bg-danger/10 text-danger ring-danger/25",
  dark: "bg-white/[0.05] text-muted ring-line-strong",
};
