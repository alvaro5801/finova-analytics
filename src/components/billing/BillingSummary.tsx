import { CalendarClock, PiggyBank, Receipt } from "lucide-react";
import { Card } from "@/components/ui/Card";

const items = [
  { label: "Card balance", value: "$2,420", icon: PiggyBank, color: "grad-info" },
  { label: "Total invoiced", value: "$1,410", icon: Receipt, color: "grad-success" },
  { label: "Next payment due", value: "in 6 days", icon: CalendarClock, color: "grad-warning" },
];

export function BillingSummary() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="flex items-center gap-3">
          <span
            className={`${item.color} icon-shadow flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white`}
          >
            <item.icon size={18} />
          </span>
          <div>
            <p className="text-xs font-medium text-slate-400">{item.label}</p>
            <p className="text-base font-bold text-slate-700">{item.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
