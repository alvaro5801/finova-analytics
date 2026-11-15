"use client";

import { useState } from "react";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Toggle } from "@/components/ui/Toggle";
import { useAppSelector } from "@/store/hooks";

const settingsItems = [
  { key: "budget", label: "Alertar quando uma área passar de 90% do orçamento", defaultChecked: true },
  { key: "inflow", label: "Avisar recebimentos acima de R$ 10.000,00", defaultChecked: true },
  { key: "weekly", label: "Resumo semanal de fluxo de caixa por e-mail", defaultChecked: false },
  { key: "monthly", label: "Relatório mensal de resultado em PDF", defaultChecked: true },
  { key: "product", label: "Novidades do produto Finova", defaultChecked: false },
];

/** Dados fictícios de demonstração (domínio e telefone reservados). */
const infoItems = [
  { icon: Mail, label: "E-mail", value: "marina.costa@finova.example" },
  { icon: Phone, label: "Telefone", value: "+55 (11) 99999-0000" },
  { icon: Building2, label: "Empresa", value: "Finova Demo Ltda." },
  { icon: MapPin, label: "Local", value: "São Paulo, SP" },
];

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(settingsItems.map((s) => [s.key, s.defaultChecked])),
  );

  const displayName = user?.name ?? "Marina Costa";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <Reveal>
        <Card className="overflow-hidden p-0">
          <div
            className="h-28 w-full sm:h-36"
            style={{
              backgroundImage:
                "radial-gradient(30rem 12rem at 85% 0%, rgb(34 211 238 / 0.35), transparent 70%), linear-gradient(120deg, #2a1f6b 0%, #4a34c9 45%, #7958f5 100%)",
            }}
          />
          <div className="flex flex-col items-center gap-3 px-6 pb-6 sm:flex-row sm:items-end">
            <span className="grad-info -mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-surface text-2xl font-semibold text-white shadow-glow sm:-mt-12">
              {initials}
            </span>
            <div className="flex-1 text-center sm:text-start">
              <p className="text-lg font-semibold text-fg">{displayName}</p>
              <p className="text-sm text-muted">Diretora financeira (CFO) · Finova Demo Ltda.</p>
            </div>
            <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              Plano Business
            </span>
          </div>
        </Card>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        <div className="lg:col-span-2">
          <Reveal delay={0.06} className="h-full">
            <Card className="h-full">
              <CardHeader title="Informações do perfil" />
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Perfil de demonstração com dados fictícios. O nome exibido vem do estado global
                (Redux) após o login simulado, e os indicadores do painel vêm da API seedada.
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {infoItems.map((item) => (
                  <li key={item.label} className="fn-well flex items-center gap-3 rounded-xl px-4 py-3 text-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
                      <item.icon size={15} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted">{item.label}</p>
                      <p className="truncate font-medium text-fg">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>

        <div className="lg:col-span-1">
          <Reveal delay={0.12} className="h-full">
            <Card className="h-full">
              <CardHeader title="Alertas e notificações" />
              <ul className="mt-5 flex flex-col gap-4">
                {settingsItems.map((item) => (
                  <li key={item.key} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted">{item.label}</span>
                    <Toggle
                      checked={settings[item.key]}
                      onChange={(value) => setSettings((prev) => ({ ...prev, [item.key]: value }))}
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
