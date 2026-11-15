"use client";

import clsx from "clsx";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useAppSelector } from "@/store/hooks";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const direction = useAppSelector((state) => state.ui.direction);
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <div dir={direction} className="min-h-screen">
      <Sidebar />
      <div
        className={clsx(
          "px-4 pt-4 transition-[padding-inline-start] duration-300 ease-out-soft lg:pe-6",
          sidebarCollapsed ? "lg:ps-[7.5rem]" : "lg:ps-[18.5rem]",
        )}
      >
        <Navbar />
        <main className="pb-10">{children}</main>
      </div>
    </div>
  );
}
