"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { renderIcon } from "@/lib/icon-map";
import type { OrderEventData } from "@/types/dashboard";

const iconColor: Record<string, string> = {
  dark: "text-slate-300",
  info: "text-[#0075ff]",
  success: "text-emerald-400",
  primary: "text-[#e91e8c]",
  warning: "text-[#f0ad4e]",
  danger: "text-[#e33f3f]",
};

function OrderIcon({ icon, color }: { icon: string; color: string }) {
  if (icon === "none") {
    return <span className="h-6 w-6 shrink-0" />;
  }
  if (icon === "figma") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#4a1942] text-[10px] font-bold text-[#ff61f6]">
        Xd
      </span>
    );
  }
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center ${
        iconColor[color] ?? "text-white"
      }`}
    >
      {renderIcon(icon, { size: 16, fill: "currentColor", strokeWidth: 0 })}
    </span>
  );
}

const cardBackground =
  "linear-gradient(126.97deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(10, 14, 35, 0.71) 91.2%)";

export function OrdersCard({ orders }: { orders: OrderEventData[] }) {
  return (
    <Card className="flex h-full flex-col" style={{ background: cardBackground }}>
      <p className="text-[18px] font-bold text-white">Orders overview</p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-[#A0AEC0] text-[13px] font-bold">
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
        +30% this month
      </p>

      <ol className="mt-6 space-y-6">
        {orders.map((order, i) => (
          <motion.li
            key={order.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="flex items-start gap-4"
          >
            <OrderIcon icon={order.icon} color={order.color} />
            <div>
              <p className="text-[14px] font-bold text-white">{order.title}</p>
              <p className="mt-0.5 text-[12px] font-normal text-[#A0AEC0]">
                {order.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Card>
  );
}

export function OrdersSkeleton() {
  return (
    <Card style={{ background: cardBackground }}>
      <Skeleton className="h-4 w-32" />
      <div className="mt-6 space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 shrink-0 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
