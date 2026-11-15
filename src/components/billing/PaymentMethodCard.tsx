import clsx from "clsx";
import { Nfc, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";

const cards = [
  { brand: "Mastercard", last4: "7852", expires: "08/28", holder: "FINOVA DEMO LTDA", primary: true, bg: "grad-primary" },
  { brand: "Visa", last4: "3401", expires: "03/27", holder: "FINOVA DEMO LTDA", primary: false, bg: "grad-dark" },
];

export function PaymentMethodCard() {
  return (
    <Card className="h-full">
      <CardHeader
        title="Formas de pagamento"
        subtitle="Cartões corporativos cadastrados"
        action={
          <button
            type="button"
            aria-disabled="true"
            title="Indisponível no ambiente de demonstração"
            className="inline-flex shrink-0 cursor-not-allowed items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-muted"
          >
            <Plus size={14} aria-hidden="true" /> Novo
          </button>
        }
      />
      <ul className="mt-5 flex flex-col gap-4">
        {cards.map((card) => (
          <li
            key={card.last4}
            className={clsx(
              "relative overflow-hidden rounded-2xl p-5 text-white ring-1 ring-inset ring-white/10 transition-transform duration-300 ease-out-soft hover:-translate-y-0.5",
              card.bg,
            )}
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative flex items-start justify-between">
              <span className="text-sm font-semibold tracking-wide">{card.brand}</span>
              {card.primary && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  Principal
                </span>
              )}
            </div>
            <div className="relative mt-6 flex items-center gap-3">
              <span className="h-7 w-9 rounded-md bg-gradient-to-br from-amber-200/90 to-amber-400/80" aria-hidden="true" />
              <Nfc size={18} className="text-white/70" aria-hidden="true" />
            </div>
            <p className="relative mt-4 font-mono text-base tracking-[0.18em] tabular-nums">
              •••• •••• •••• {card.last4}
            </p>
            <div className="relative mt-3 flex justify-between text-[11px] uppercase tracking-wide text-white/70">
              <span>{card.holder}</span>
              <span>Val. {card.expires}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
