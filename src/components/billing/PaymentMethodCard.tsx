"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { AddCardDialog } from "@/components/billing/AddCardDialog";
import { CreditCard } from "@/components/billing/CreditCard";
import { motionTokens } from "@/lib/tokens";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCard, type PaymentCard } from "@/store/slices/billingSlice";

export function PaymentMethodCard() {
  const cards = useAppSelector((state) => state.billing.cards);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const close = useCallback(() => setOpen(false), []);

  const add = useCallback(
    (card: PaymentCard) => {
      dispatch(addCard(card));
      setAnnouncement(`Cartão ${card.brand} final ${card.last4} adicionado.`);
    },
    [dispatch],
  );

  return (
    <Card className="h-full">
      <CardHeader
        title="Formas de pagamento"
        subtitle="Cartões corporativos cadastrados"
        action={
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="fn-press inline-flex shrink-0 items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-fg transition-colors duration-200 hover:border-primary/50 hover:bg-primary/10"
          >
            <Plus size={14} aria-hidden="true" /> Novo
          </button>
        }
      />
      <ul className="mt-5 flex flex-col gap-4">
        {cards.map((card) => (
          <motion.li
            key={card.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.base, ease: motionTokens.ease }}
            className="transition-transform duration-300 ease-out-soft hover:-translate-y-0.5"
          >
            <CreditCard
              brand={card.brand}
              number={`•••• •••• •••• ${card.last4}`}
              holder={card.holder}
              expires={card.expires}
              primary={card.primary}
            />
          </motion.li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <AddCardDialog open={open} onClose={close} onAdd={add} />
    </Card>
  );
}
