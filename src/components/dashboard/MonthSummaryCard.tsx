"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAppSelector } from "@/store/hooks";

export function WelcomeCard() {
  const user = useAppSelector((state) => state.auth.user);
  const name = user?.name ?? "Dohn Jon";

  return (
    <Card className="relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden p-8">
      <Image
        src="/images/welcome-jellyfish.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover"
        style={{
          objectPosition: "75% 62%",
          transform: "scale(1.6) scaleX(-1)",
          left: "90px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,10,30,0.95) 0%, rgba(6,10,30,0.55) 32%, rgba(6,10,30,0.05) 62%)",
        }}
      />

      <div className="relative z-10">
        <p className="text-xs text-slate-300">Welcome back,</p>
        <p className="mt-1 text-[1.75rem] font-bold text-white">{name}</p>
        <p className="mt-4 max-w-[220px] text-[1rem] text-slate-300">
          Glad to see you again!
          <br />
          Ask me anything.
        </p>
      </div>

      <button className="group relative z-10 flex items-center gap-1.5 text-sm font-medium text-slate-200 transition-colors hover:text-white">
        Tap to record
        <ArrowRight
          size={15}
          className="transition-transform duration-200 group-hover:translate-x-1 mt-1"
        />
      </button>
    </Card>
  );
}

export function WelcomeSkeleton() {
  return <Card className="h-full min-h-[280px] animate-pulse bg-white/5" />;
}
