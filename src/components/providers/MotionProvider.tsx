"use client";

import { MotionConfig } from "framer-motion";

/**
 * Respeita `prefers-reduced-motion` em todas as animações do Framer Motion:
 * transform e layout são desligados, e só a opacidade continua animando.
 * Gráficos (Recharts) e CSS têm tratamento próprio: `useReducedMotion` e a media query em globals.css.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
