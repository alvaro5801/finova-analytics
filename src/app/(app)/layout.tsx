"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useAppSelector } from "@/store/hooks";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const direction = useAppSelector((state) => state.ui.direction);

  return (
    <div dir={direction} className="min-h-screen">
      <div aria-hidden="true" className="grad-brand fixed inset-x-0 top-0 z-40 h-[2px] opacity-80" />
      <Sidebar />
      <div className="px-4 pt-4 lg:ps-[18.5rem] lg:pe-6">
        <Navbar />
        <main className="pb-10">{children}</main>
      </div>
    </div>
  );
}
