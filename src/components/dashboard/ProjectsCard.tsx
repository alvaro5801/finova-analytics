"use client";

import { motion } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ProjectData } from "@/types/dashboard";

function CompanyIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "figma":
      return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[15px] font-bold text-[#FF61F6]">
          Xd
        </span>
      );
    case "atlassian":
      return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.6 11.2a1 1 0 0 0-1.7.1L1 21.4a1 1 0 0 0 .9 1.4h6.6a1 1 0 0 0 .9-.6c1.4-3 .5-7.6-1.8-11z"
              fill="#2684FF"
            />
            <path
              d="M10.5 1.2a12.9 12.9 0 0 0 .2 13.1l3.2 6.5a1 1 0 0 0 .9.6h6.6a1 1 0 0 0 .9-1.4S12.4 1.8 12.1 1.2a1 1 0 0 0-1.6 0z"
              fill="#2684FF"
            />
          </svg>
        </span>
      );
    case "slack":
      return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="1.5" width="3" height="8" rx="1.5" fill="#36C5F0" />
            <rect x="9" y="14.5" width="3" height="8" rx="1.5" fill="#2EB67D" />
            <rect x="14.5" y="9" width="8" height="3" rx="1.5" fill="#ECB22E" />
            <rect x="1.5" y="9" width="8" height="3" rx="1.5" fill="#E01E5A" />
          </svg>
        </span>
      );
    case "spotify":
      return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#1DB954" />
            <path
              d="M5.8 9.5c4-1.2 9-1 12.5 1M6.3 13c3.3-1 7.2-.8 10 .9M6.8 16.3c2.8-.8 6-.6 8.3.8"
              stroke="#0b0f30"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
      );
    case "jira":
      return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect
              x="12"
              y="1.5"
              width="14.5"
              height="14.5"
              rx="3"
              transform="rotate(45 12 12)"
              fill="#2684FF"
            />
          </svg>
        </span>
      );
    case "invision":
      return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#FF3366] text-[13px] font-bold italic text-white">
          in
        </span>
      );
    default:
      return <span className="h-8 w-8 shrink-0" />;
  }
}

function MemberStack({ members }: { members: string }) {
  const initials = members.split(",");
  return (
    <div className="flex -space-x-2 rtl:space-x-reverse">
      {initials.map((initial, i) => (
        <span
          key={initial + i}
          className="grad-info flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0b0f30] text-[10px] font-semibold text-white"
        >
          {initial}
        </span>
      ))}
    </div>
  );
}

const cardBackground =
  "linear-gradient(126.97deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(10, 14, 35, 0.71) 91.2%)";

export function ProjectsCard({ projects }: { projects: ProjectData[] }) {
  return (
    <Card className="flex h-full flex-col" style={{ background: cardBackground }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-5">
          <p className="text-[18px] font-bold text-white">Projects</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#A0AEC0]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#01B574" />
              <path
                d="M7.5 12.5l3 3 6-6.5"
                stroke="black"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-bold text-[#A0AEC0]">
              {projects.filter((p) => p.status === "done").length} done this
              month
            </span>{" "}
          </p>
        </div>
        <button
          aria-label="More options"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-[40%]" />
            <col className="w-[22%]" />
            <col className="w-[22%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-[#A0AEC0]">
              <th className="pb-2 font-semibold">Companies</th>
              <th className="pb-2 font-semibold">Members</th>
              <th className="pb-2 font-semibold">Budget</th>
              <th className="pb-2 font-semibold">Completion</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) => {
              return (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="border-t border-white/10"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <CompanyIcon icon={project.icon} />
                      <span className="text-[14px] font-bold text-slate-200">
                        {project.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <MemberStack members={project.members} />
                  </td>
                  <td className="py-3 pr-4 text-[14px] font-bold text-slate-300">
                    {project.budget}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[14px] font-bold text-slate-200">
                      {project.completion}%
                    </span>
                    <div className="mt-1.5 h-1 w-[125px] overflow-hidden rounded-full bg-[#2D2E5F]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.completion}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2 + i * 0.05,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-[#0075FF]"
                      />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function ProjectsSkeleton() {
  return (
    <Card style={{ background: cardBackground }}>
      <Skeleton className="h-4 w-24" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    </Card>
  );
}
