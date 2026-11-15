"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import clsx from "clsx";
import { FinovaLogo, FinovaMark } from "@/components/brand/FinovaLogo";
import { navSections, type NavItem } from "@/config/nav";
import { motionTokens } from "@/lib/tokens";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSidebar } from "@/store/slices/uiSlice";
import { clearUser } from "@/store/slices/authSlice";

const navItemBase =
  "group relative isolate flex items-center gap-3 whitespace-nowrap rounded-xl py-2.5 text-sm font-medium transition-colors duration-200";
const navItemInactive = "text-muted hover:bg-white/[0.04] hover:text-fg";
const navIconBase = "shrink-0 transition-colors duration-200";
const navIconInactive = "text-muted group-hover:text-fg";

function NavLink({
  item,
  onNavigate,
  collapsed,
}: {
  item: NavItem;
  onNavigate: () => void;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={clsx(
        navItemBase,
        collapsed ? "ps-3.5 pe-3" : "px-3",
        active ? "text-fg" : navItemInactive,
      )}
    >
      {active && (
        <motion.span
          layoutId="active-nav-pill"
          className="absolute inset-0 -z-10 rounded-xl bg-white/[0.05] ring-1 ring-inset ring-line-strong"
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
        >
          <span className="absolute inset-y-2.5 start-0 w-[3px] rounded-full bg-primary" />
        </motion.span>
      )}
      <Icon
        size={18}
        strokeWidth={1.9}
        aria-hidden="true"
        className={clsx(navIconBase, active ? "text-fg" : navIconInactive)}
      />
      <span className={clsx(collapsed && "sr-only")}>{item.label}</span>
    </Link>
  );
}

function LogoutButton({ onNavigate, collapsed }: { onNavigate: () => void; collapsed: boolean }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logout = () => {
    dispatch(clearUser());
    onNavigate();
    router.push("/sign-in");
  };

  return (
    <button
      type="button"
      onClick={logout}
      title={collapsed ? "Sair" : undefined}
      className={clsx(navItemBase, "w-full", collapsed ? "ps-3.5 pe-3" : "px-3", navItemInactive)}
    >
      <LogOut size={18} strokeWidth={1.9} aria-hidden="true" className={clsx(navIconBase, navIconInactive)} />
      <span className={clsx(collapsed && "sr-only")}>Sair</span>
    </button>
  );
}

function SidebarContent({
  onNavigate,
  collapsed = false,
}: {
  onNavigate: () => void;
  collapsed?: boolean;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden whitespace-nowrap px-4 py-5">
      <Link href="/dashboard" onClick={onNavigate} className="px-2">
        {collapsed ? (
          <span className="inline-flex">
            <FinovaMark />
            <span className="sr-only">Finova Analytics</span>
          </span>
        ) : (
          <FinovaLogo />
        )}
      </Link>

      <div
        aria-hidden="true"
        className="mt-5 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
      />

      <nav aria-label="Navegação principal" className="mt-2 flex flex-col">
        {navSections.map((section, index) => (
          <div key={section.title} className="mt-4">
            <div className="mb-1.5 flex h-4 items-center px-3">
              <p
                className={clsx(
                  "text-[11px] font-semibold uppercase leading-4 tracking-[0.14em] text-muted/80",
                  collapsed && "sr-only",
                )}
              >
                {section.title}
              </p>
              {collapsed && index > 0 && (
                <span aria-hidden="true" className="h-px w-full bg-line-strong" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} onNavigate={onNavigate} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <LogoutButton onNavigate={onNavigate} collapsed={collapsed} />
      </div>
    </div>
  );
}

export function Sidebar() {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
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
      <aside
        id="sidebar-desktop"
        className={clsx(
          "fn-card fixed inset-y-4 start-4 z-30 hidden overflow-hidden rounded-2xl transition-[width] duration-300 ease-out-soft lg:block",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <LayoutGroup id="sidebar-desktop">
          <SidebarContent onNavigate={() => {}} collapsed={collapsed} />
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
