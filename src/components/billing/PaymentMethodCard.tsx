import { CreditCard, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";

const cards = [
  { brand: "Mastercard", last4: "7852", color: "grad-dark" },
  { brand: "Visa", last4: "3401", color: "grad-info" },
];

export function PaymentMethodCard() {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Payment method</p>
        <button className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-600">
          <Plus size={14} /> New card
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {cards.map((card) => (
          <div
            key={card.brand}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:border-slate-200"
          >
            <span
              className={`${card.color} icon-shadow flex h-10 w-14 items-center justify-center rounded-lg text-white`}
            >
              <CreditCard size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-600">{card.brand}</p>
              <p className="text-xs text-slate-400">•••• •••• •••• {card.last4}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
