"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { accountNavItems, mainNavItems, type NavItem } from "@/config/nav";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSidebar } from "@/store/slices/uiSlice";

function NavLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`group relative flex items-center gap-3 rounded-2xl px-2.5 py-2 text-[14px] font-normal transition-colors duration-200 ${
        active ? "text-white" : "text-slate-200 hover:text-white"
      }`}
    >
      {active && (
        <motion.span
          layoutId="active-nav-pill"
          className="absolute inset-0 -z-10 rounded-2xl bg-[#1A1F37] shadow-[0px_3.5px_5.5px_0px_#00000005]"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span
        className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[12px] transition-colors ${
          active
            ? "icon-shadow bg-[#0075FF] text-white"
            : "bg-[#1A1F37] text-[#0075FF] shadow-[0px_3.5px_5.5px_0px_#00000005]"
        }`}
      >
        <Icon size={15} strokeWidth={2} fill="currentColor" />
      </span>
      <span>{item.label}</span>
    </Link>
  );
}

function HelpCardWaves() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 300 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="helpWaveBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2b1f72" />
          <stop offset="100%" stopColor="#05061a" />
        </linearGradient>
        <radialGradient id="helpWaveGlow" cx="78%" cy="8%" r="70%">
          <stop offset="0%" stopColor="#8f6bff" />
          <stop offset="45%" stopColor="#4436c9" />
          <stop offset="100%" stopColor="#161446" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="helpWaveMid" x1="10%" y1="0%" x2="90%" y2="80%">
          <stop offset="0%" stopColor="#7aa6ff" />
          <stop offset="50%" stopColor="#3457e6" />
          <stop offset="100%" stopColor="#0d0b30" />
        </linearGradient>
        <filter id="helpWaveBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect width="300" height="260" fill="url(#helpWaveBase)" />
      <rect width="300" height="260" fill="url(#helpWaveGlow)" />

      <path
        d="M-20,130 C50,70 90,175 150,135 C220,90 245,165 320,100 L320,280 L-20,280 Z"
        fill="url(#helpWaveMid)"
        filter="url(#helpWaveBlur)"
      />
      <path
        d="M-20,175 C70,140 120,225 200,185 C255,158 285,205 320,178 L320,280 L-20,280 Z"
        fill="#05061c"
        filter="url(#helpWaveBlur)"
      />
      <path
        d="M110,-10 C150,25 145,60 185,65 C225,70 245,25 300,35 L300,-10 Z"
        fill="#bfe3ff"
        opacity="0.45"
        filter="url(#helpWaveBlur)"
      />
    </svg>
  );
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex h-full flex-col px-4 py-6">
      <div className="mb-8 px-2">
        <p
          className="text-[14px] font-semibold uppercase tracking-[0.3em]"
          style={{
            background:
              "linear-gradient(40deg, #FFFFFF 70.67%, rgba(117, 122, 140, 0) 108%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          Vision UI
        </p>
      </div>

      <div
        className="mb-3"
        style={{
          height: 0,
          borderTop: "1px solid",
          borderImageSource:
            "linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)",
          borderImageSlice: 1,
        }}
      />

      <nav className="flex flex-col gap-3">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <p className="mb-1.5 mt-6 px-4 text-xs font-bold uppercase tracking-wide text-slate-500">
        Account pages
      </p>
      <nav className="flex flex-col gap-3">
        {accountNavItems.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div className="icon-shadow relative overflow-hidden rounded-2xl p-4 text-white transition-transform duration-300 hover:-translate-y-1">
          <HelpCardWaves />
          <div className="relative">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0075ff] text-xs font-bold text-white">
                ?
              </span>
            </span>
            <p className="mt-4 text-base font-bold">Need help?</p>
            <p className="mt-1 text-sm text-white/80">Please check our docs</p>
            <button className="mt-4 w-full rounded-xl bg-black/40 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-black/55">
              Documentation
            </button>
          </div>
        </div>
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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="glass-card card-shadow fixed inset-y-4 start-4 z-30 hidden w-64 rounded-2xl backdrop-blur-xl lg:block">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* Mobile / tablet drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={close}
            />
            <motion.aside
              key="drawer"
              initial={{ x: offscreen }}
              animate={{ x: 0 }}
              exit={{ x: offscreen }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="glass-card card-shadow fixed inset-y-4 start-4 z-50 w-64 rounded-2xl backdrop-blur-xl lg:hidden"
            >
              <button
                onClick={close}
                aria-label="Close sidebar"
                className="absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
              <SidebarContent onNavigate={close} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
