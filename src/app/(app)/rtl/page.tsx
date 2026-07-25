"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesOverviewCard } from "@/components/dashboard/SalesOverviewCard";
import type { SalesPointData, StatCardData } from "@/types/dashboard";

const rtlStats: StatCardData[] = [
  {
    id: 1,
    key: "money",
    title: "Weekly Revenue",
    value: "$12,400",
    changePct: 18,
    changeLabel: "since last week",
    icon: "wallet",
    color: "dark",
    order: 0,
  },
  {
    id: 2,
    key: "users",
    title: "New Signups",
    value: "1,204",
    changePct: 9,
    changeLabel: "since last week",
    icon: "globe",
    color: "info",
    order: 1,
  },
  {
    id: 3,
    key: "clients",
    title: "Refunds",
    value: "87",
    changePct: -4,
    changeLabel: "since last quarter",
    icon: "file-text",
    color: "success",
    order: 2,
  },
  {
    id: 4,
    key: "sales",
    title: "Conversion Rate",
    value: "3.2%",
    changePct: 6,
    changeLabel: "since last month",
    icon: "cart",
    color: "primary",
    order: 3,
  },
];

const rtlSales: SalesPointData[] = [
  { id: 1, month: "Jan", value: 80, secondary: 140, order: 0 },
  { id: 2, month: "Feb", value: 130, secondary: 110, order: 1 },
  { id: 3, month: "Mar", value: 95, secondary: 160, order: 2 },
  { id: 4, month: "Apr", value: 260, secondary: 190, order: 3 },
  { id: 5, month: "May", value: 190, secondary: 230, order: 4 },
  { id: 6, month: "Jun", value: 310, secondary: 200, order: 5 },
  { id: 7, month: "Jul", value: 240, secondary: 270, order: 6 },
];

const rtlProjects = [
  { name: "Marketing Site Redesign", progress: 45, tag: "In progress" },
  { name: "Mobile App Launch", progress: 100, tag: "Done" },
  { name: "API Migration", progress: 70, tag: "In progress" },
];

export default function RtlPage() {
  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <Card>
          <p className="text-sm font-semibold text-white">Dashboard Preview</p>
          <p className="mt-1 text-sm text-[#A0AEC0]">
            An alternate data set rendered with the same dashboard components,
            for previewing widgets outside the main dashboard page.
          </p>
        </Card>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {rtlStats.map((stat, i) => (
          <Reveal key={stat.id} delay={i * 0.06}>
            <StatCard stat={stat} />
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="h-[420px] lg:col-span-2">
          <Reveal className="block h-full">
            <SalesOverviewCard points={rtlSales} />
          </Reveal>
        </div>
        <div className="h-[420px] lg:col-span-1">
          <Reveal className="block h-full" delay={0.08}>
            <Card className="flex h-full flex-col">
              <p className="text-sm font-semibold text-white">Projects</p>
              <ul className="mt-4 flex flex-col gap-4">
                {rtlProjects.map((project, i) => (
                  <motion.li
                    key={project.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-200">{project.name}</span>
                      <span className="text-xs font-semibold text-[#A0AEC0]">{project.tag}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: "easeOut" }}
                        className="grad-info h-full rounded-full"
                      />
                    </div>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
