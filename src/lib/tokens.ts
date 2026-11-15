/**
 * Espelho JS dos tokens definidos em `src/app/globals.css` (`@theme`).
 * Recharts e atributos SVG não leem classes Tailwind, então recebem as cores daqui.
 * Mantenha os dois arquivos em sincronia.
 */
export const colors = {
  canvas: "#10100D",
  surface: "#191816",
  surface2: "#201F1C",
  sunken: "#141311",
  line: "rgba(236, 234, 228, 0.08)",
  lineStrong: "rgba(236, 234, 228, 0.14)",
  primary: "#5BB89D",
  primaryLight: "#7FD1B9",
  accent: "#88BFE6",
  series1: "#5592D8",
  series2: "#D4733D",
  fg: "#ECEBE6",
  muted: "#A3A29C",
  faint: "#75746E",
  success: "#5ECA8E",
  danger: "#FA6C68",
  warning: "#ECB461",
  neutral: "#9498A1",
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
