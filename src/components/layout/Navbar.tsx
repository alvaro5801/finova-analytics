"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Menu, Search, User } from "lucide-react";
import { allNavItems } from "@/config/nav";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";

function currentLabel(pathname: string) {
  const match = allNavItems.find((item) => item.href === pathname);
  return match?.label ?? "Dashboard";
}

export function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const label = currentLabel(pathname);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mb-6 flex flex-wrap items-center justify-between gap-4 px-1 py-2"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-[12px] font-medium text-slate-400">
            Pages / <span className="font-semibold text-white">{label}</span>
          </p>
          <h1 className="text-[14px] font-semibold text-white">{label}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-slate-300 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-[#0075ff]/50 sm:flex">
          <Search size={15} />
          <input
            type="text"
            placeholder="Type here..."
            className="w-32 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500 lg:w-44"
          />
        </label>

        {!user && (
          <Link
            href="/sign-in"
            className="hidden items-center gap-1.5 rounded-lg px-2 py-2 text-[12px] font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white sm:flex"
          >
            <User size={14} fill="currentColor" strokeWidth={0} />
            Sign In
          </Link>
        )}

        {user && (
          <Link
            href="/profile"
            className="hidden items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 sm:flex"
          >
            <span className="grad-info flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            {user.name}
          </Link>
        )}

        <button
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-transform duration-200 hover:-rotate-45 hover:bg-white/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <defs>
              <mask id="settings-gear-hole">
                <rect x="0" y="0" width="24" height="24" fill="white" />
                <circle cx="12" cy="12" r="3" fill="black" />
              </mask>
            </defs>
            <path
              d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
              fill="#718096"
              stroke="#718096"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              mask="url(#settings-gear-hole)"
            />
          </svg>
        </button>

        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10"
        >
          <Bell size={16} fill="currentColor" strokeWidth={0} className="text-[#718096]" />
        </button>
      </div>
    </motion.header>
  );
}
