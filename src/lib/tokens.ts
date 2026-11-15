/**
 * Espelho JS dos tokens definidos em `src/app/globals.css` (`@theme`).
 * Recharts e atributos SVG não leem classes Tailwind, então recebem as cores daqui.
 * Mantenha os dois arquivos em sincronia.
 */
export const colors = {
  canvas: "#090E1A",
  surface: "#151D30",
  surface2: "#1B2540",
  sunken: "#0D1324",
  line: "rgba(232, 237, 247, 0.08)",
  lineStrong: "rgba(232, 237, 247, 0.14)",
  primary: "#7958F5",
  primaryLight: "#A893FF",
  accent: "#22D3EE",
  fg: "#E8EDF7",
  muted: "#8B95AD",
  faint: "#5D6782",
  success: "#34D399",
  danger: "#F87171",
  warning: "#FBBF24",
} as const;

/** Durações em segundos (Framer Motion) e milissegundos (Recharts). */
export const motionTokens = {
  fast: 0.2,
  base: 0.3,
  slow: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
  /** D4: desenho inicial de gráfico, só na primeira montagem. */
  chartDrawMs: 700,
  /** D4: transições de dados (ex.: troca de período). */
  chartUpdateMs: 300,
} as const;
