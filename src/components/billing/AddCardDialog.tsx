"use client";

import { useId, useState } from "react";
import { CreditCard } from "@/components/billing/CreditCard";
import { TextField } from "@/components/ui/FormField";
import { Modal, ModalActions, primaryButton, secondaryButton } from "@/components/ui/Modal";
import {
  detectBrand,
  formatCardNumber,
  formatExpiry,
  onlyDigits,
  validateCard,
  type CardInput,
} from "@/lib/card";
import type { PaymentCard } from "@/store/slices/billingSlice";

const FIELD_ORDER: (keyof CardInput)[] = ["number", "holder", "expiry", "cvv"];

function CardForm({ onClose, onAdd }: { onClose: () => void; onAdd: (card: PaymentCard) => void }) {
  const id = useId();
  const [form, setForm] = useState<CardInput>({ number: "", holder: "", expiry: "", cvv: "" });
  const [primary, setPrimary] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = validateCard(form);
  const shownErrors = submitted ? errors : {};
  const digits = onlyDigits(form.number);
  const brand = detectBrand(digits);
  const previewNumber = digits.padEnd(Math.max(16, digits.length), "•").replace(/(.{4})(?=.)/g, "$1 ");

  const update = (key: keyof CardInput, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const firstInvalid = FIELD_ORDER.find((key) => errors[key]);
    if (firstInvalid) {
      document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return;
    }
    onAdd({
      id: `card-${Date.now()}`,
      brand,
      last4: digits.slice(-4),
      expires: form.expiry,
      holder: form.holder.trim().toUpperCase(),
      primary,
    });
    onClose();
  };

  return (
    <>
      <CreditCard
        className="mt-5"
        brand={brand}
        number={previewNumber}
        holder={form.holder.trim().toUpperCase() || "Nome no cartão"}
        expires={form.expiry || "MM/AA"}
        primary={primary}
      />

      <form noValidate onSubmit={submit} className="mt-5 flex flex-col gap-4">
        <TextField
          id={`${id}-number`}
          label="Número do cartão"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="0000 0000 0000 0000"
          value={form.number}
          onChange={(e) => update("number", formatCardNumber(e.target.value))}
          error={shownErrors.number}
          hint="Use um número de teste, como 4111 1111 1111 1111."
        />
        <TextField
          id={`${id}-holder`}
          label="Nome impresso"
          autoComplete="cc-name"
          placeholder="Como aparece no cartão"
          value={form.holder}
          onChange={(e) => update("holder", e.target.value)}
          error={shownErrors.holder}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            id={`${id}-expiry`}
            label="Validade"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/AA"
            value={form.expiry}
            onChange={(e) => update("expiry", formatExpiry(e.target.value))}
            error={shownErrors.expiry}
          />
          <TextField
            id={`${id}-cvv`}
            label="CVV"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={form.cvv}
            onChange={(e) => update("cvv", onlyDigits(e.target.value).slice(0, 4))}
            error={shownErrors.cvv}
          />
        </div>

        <label className="flex items-center gap-2.5 text-sm text-fg">
          <input
            type="checkbox"
            checked={primary}
            onChange={(e) => setPrimary(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Definir como cartão principal
        </label>

        <ModalActions>
          <button type="button" onClick={onClose} className={secondaryButton}>
            Cancelar
          </button>
          <button type="submit" className={primaryButton}>
            Adicionar cartão
          </button>
        </ModalActions>
      </form>
    </>
  );
}

export function AddCardDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (card: PaymentCard) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Novo cartão" description="Cartão corporativo para débito das faturas">
      <CardForm onClose={onClose} onAdd={onAdd} />
    </Modal>
  );
}
