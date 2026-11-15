"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { X } from "lucide-react";
import { motionTokens } from "@/lib/tokens";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function ModalPanel({ onClose, title, description, children, className }: Omit<ModalProps, "open">) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const first = panelRef.current?.querySelector<HTMLElement>(
      "input:not([disabled]), select:not([disabled]), textarea, button:not([data-modal-close])",
    );
    first?.focus();
    // Devolve o foco a quem abriu o modal (se o elemento ainda existir).
    return () => {
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: motionTokens.fast }}
        className="fixed inset-0 z-[60] bg-canvas/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-description` : undefined}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: motionTokens.base, ease: motionTokens.ease }}
        className={clsx(
          "fn-card fixed left-1/2 top-1/2 z-[60] max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl p-6",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={`${id}-title`} className="text-base font-semibold tracking-tight text-fg">
              {title}
            </h2>
            {description && (
              <p id={`${id}-description`} className="mt-1 text-sm text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            data-modal-close
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        {children}
      </motion.div>
    </>
  );
}

export function Modal({ open, ...panelProps }: ModalProps) {
  if (typeof document === "undefined") return null;
  // Portal: um ancestral com transform (animações de entrada) prenderia o `fixed` dentro dele.
  return createPortal(<AnimatePresence>{open && <ModalPanel {...panelProps} />}</AnimatePresence>, document.body);
}

export function ModalActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 flex justify-end gap-2">{children}</div>;
}

export const secondaryButton =
  "rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-fg transition-colors duration-200 hover:bg-white/[0.06]";
export const primaryButton = "fn-btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold";
export const dangerButton =
  "rounded-xl bg-danger/90 px-4 py-2.5 text-sm font-semibold text-canvas transition-colors duration-200 hover:bg-danger";
