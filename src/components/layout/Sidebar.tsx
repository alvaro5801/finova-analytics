"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import clsx from "clsx";
import { FinovaLogo } from "@/components/brand/FinovaLogo";
import { navSections, type NavItem } from "@/config/nav";
import { motionTokens } from "@/lib/tokens";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSidebar } from "@/store/slices/uiSlice";

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "group relative isolate flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
        active ? "text-fg" : "text-muted hover:bg-white/[0.04] hover:text-fg",
      )}
    >
      {active && (
        <motion.span
          layoutId="active-nav-pill"
          className="absolute inset-0 -z-10 rounded-xl bg-primary/[0.14] ring-1 ring-inset ring-primary/30"
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
        >
          <span className="absolute inset-y-2.5 start-0 w-[3px] rounded-full bg-primary-light" />
        </motion.span>
      )}
      <Icon
        size={18}
        strokeWidth={1.9}
        aria-hidden="true"
        className={clsx(
          "shrink-0 transition-colors duration-200",
          active ? "text-primary-light" : "text-muted group-hover:text-fg",
        )}
      />
      <span>{item.label}</span>
    </Link>
  );
}

function DemoNotice() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line p-4">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(14rem 9rem at 100% 0%, rgb(121 88 245 / 0.35), transparent 70%), radial-gradient(12rem 8rem at 0% 100%, rgb(34 211 238 / 0.16), transparent 70%)",
        }}
      />
      <div className="relative">
        <span className="grad-brand flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-glow">
          <Sparkles size={16} aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-semibold text-fg">Ambiente de demonstração</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Todos os valores são fictícios e gerados pelo seed do banco.
        </p>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-5">
      <Link href="/dashboard" onClick={onNavigate} className="px-2">
        <FinovaLogo />
      </Link>

      <div
        aria-hidden="true"
        className="mt-5 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
      />

      <nav aria-label="Navegação principal" className="mt-2 flex flex-col">
        {navSections.map((section) => (
          <div key={section.title} className="mt-4">
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted/80">
              {section.title}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <DemoNotice />
      </div>
    </div>
  );
}

export function Sidebar() {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const direction = useAppSelector((state) => state.ui.direction);
  const dispatch = useAppDispatch();
  const close = () => dispatch(closeSidebar());
  const offscreen = direction === "rtl" ? "100%" : "-100%";

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dispatch(closeSidebar());
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, dispatch]);

  return (
    <>
      {/* Sidebar fixa no desktop */}
      <aside className="fn-card fixed inset-y-4 start-4 z-30 hidden w-64 rounded-2xl lg:block">
        <LayoutGroup id="sidebar-desktop">
          <SidebarContent onNavigate={() => {}} />
        </LayoutGroup>
      </aside>

      {/* Drawer em tablet e celular */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.fast }}
              className="fixed inset-0 z-40 bg-canvas/70 backdrop-blur-sm lg:hidden"
              onClick={close}
            />
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              initial={{ x: offscreen }}
              animate={{ x: 0 }}
              exit={{ x: offscreen }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              className="fn-card fixed inset-y-3 start-3 z-50 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl lg:hidden"
            >
              <button
                onClick={close}
                aria-label="Fechar menu"
                className="absolute end-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
              >
                <X size={16} />
              </button>
              <LayoutGroup id="sidebar-mobile">
                <SidebarContent onNavigate={close} />
              </LayoutGroup>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
