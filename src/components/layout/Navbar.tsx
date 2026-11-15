"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { PageSearch } from "@/components/layout/PageSearch";
import { allNavItems } from "@/config/nav";
import { motionTokens } from "@/lib/tokens";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar, toggleSidebarCollapsed } from "@/store/slices/uiSlice";

function currentLabel(pathname: string) {
  return allNavItems.find((item) => item.href === pathname)?.label ?? "Visão geral";
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const iconButton =
  "flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-fg";

export function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const label = currentLabel(pathname);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.base, ease: motionTokens.ease }}
      className="sticky top-3 z-20 mb-6 flex items-center justify-between gap-3 rounded-2xl border border-line bg-canvas/70 px-3 py-2.5 backdrop-blur-xl sm:px-4"
    >
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Abrir menu"
          className={`${iconButton} lg:hidden`}
        >
          <Menu size={18} />
        </button>
        <button
          onClick={() => dispatch(toggleSidebarCollapsed())}
          aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          aria-expanded={!sidebarCollapsed}
          aria-controls="sidebar-desktop"
          className={`${iconButton} hidden lg:flex`}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen size={18} aria-hidden="true" className="rtl:-scale-x-100" />
          ) : (
            <PanelLeftClose size={18} aria-hidden="true" className="rtl:-scale-x-100" />
          )}
        </button>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">
            Finova <span className="text-faint">/</span> {label}
          </p>
          <h1 className="truncate text-base font-semibold tracking-tight text-fg sm:text-lg">{label}</h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <div className="hidden sm:block">
          <PageSearch />
        </div>

        <span
          title="Todos os dados exibidos são fictícios"
          className="hidden items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent md:inline-flex"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Dados demo
        </span>

        <button aria-label="Notificações" title="Sem notificações novas" className={iconButton}>
          <Bell size={17} />
        </button>

        {user && (
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-xl py-1 pe-1 ps-1 transition-colors duration-200 hover:bg-white/[0.06] md:pe-3"
          >
            <span className="grad-info flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-white">
              {initials(user.name)}
            </span>
            <span className="hidden max-w-[10rem] truncate text-sm font-medium text-fg md:inline">
              {user.name}
            </span>
          </Link>
        )}
      </div>
    </motion.header>
  );
}
