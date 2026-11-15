"use client";

import { motion } from "framer-motion";
import { motionTokens } from "@/lib/tokens";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.slow, delay, ease: motionTokens.ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
