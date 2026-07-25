"use client";

import { useState } from "react";
import { AtSign, GitBranch, Link2, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { useAppSelector } from "@/store/hooks";

const settingsItems = [
  { key: "email", label: "Email me when someone follows me", defaultChecked: true },
  { key: "reply", label: "Email me when someone answers my post", defaultChecked: false },
  { key: "mention", label: "Email me when someone mentions me", defaultChecked: true },
  { key: "activity", label: "New launches and product updates", defaultChecked: false },
  { key: "monthly", label: "Monthly product digest", defaultChecked: true },
];

const infoItems = [
  { icon: Mail, label: "Email", value: "demo.user@example.com" },
  { icon: Phone, label: "Mobile", value: "+1 (555) 219-0453" },
  { icon: MapPin, label: "Location", value: "San Francisco, CA" },
];

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(settingsItems.map((s) => [s.key, s.defaultChecked])),
  );

  const displayName = user?.name ?? "Demo User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <Card className="overflow-hidden p-0">
          <div className="grad-dark h-32 w-full sm:h-40" />
          <div className="flex flex-col items-center gap-3 px-5 pb-5 sm:flex-row sm:items-end">
            <span className="grad-info icon-shadow -mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white text-2xl font-semibold text-white sm:-mt-12">
              {initials}
            </span>
            <div className="flex-1 text-center sm:text-start">
              <p className="text-lg font-semibold text-slate-700">{displayName}</p>
              <p className="text-sm text-slate-400">Product Designer, Material Dashboard</p>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <a className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" href="#">
                <AtSign size={16} />
              </a>
              <a className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" href="#">
                <GitBranch size={16} />
              </a>
              <a className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" href="#">
                <Link2 size={16} />
              </a>
            </div>
          </div>
        </Card>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Reveal delay={0.06}>
            <Card>
              <p className="text-sm font-semibold text-slate-700">Profile information</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Hi, I&apos;m {displayName}. This is a demo profile populated with mock
                data to showcase the pixel-faithful dashboard rebuild &mdash; connected
                to Redux state and a seeded API.
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {infoItems.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <item.icon size={14} />
                    </span>
                    <span className="text-slate-400">{item.label}:</span>
                    <span className="font-medium text-slate-600">{item.value}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>

        <div className="lg:col-span-1">
          <Reveal delay={0.12}>
            <Card>
              <p className="text-sm font-semibold text-slate-700">Platform settings</p>
              <ul className="mt-4 flex flex-col gap-4">
                {settingsItems.map((item) => (
                  <li key={item.key} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <Toggle
                      checked={settings[item.key]}
                      onChange={(value) =>
                        setSettings((prev) => ({ ...prev, [item.key]: value }))
                      }
                      label={item.label}
                    />
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
