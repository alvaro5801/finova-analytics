"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useAppSelector } from "@/store/hooks";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const direction = useAppSelector((state) => state.ui.direction);

  return (
    <div dir={direction} className="min-h-screen">
      <div className="grad-brand fixed inset-x-0 top-0 z-40 h-[3px]" />
      <Sidebar />
      <div className="px-4 pt-4 lg:ps-[18.5rem] lg:pe-6">
        <Navbar />
        <main className="pb-8">{children}</main>
      </div>
    </div>
  );
}
