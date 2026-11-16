"use client";

import { Download } from "lucide-react";
import { Modal, ModalActions, primaryButton, secondaryButton } from "@/components/ui/Modal";
import { downloadInvoicePdf, type InvoiceDocument } from "@/components/billing/invoicePdf";

/**
 * Prévia em HTML com o mesmo conteúdo e layout do PDF. Um PDF embutido não abre de
 * forma confiável no celular (Android e iOS), e o HTML funciona em qualquer navegador.
 */
function InvoicePaper({ doc }: { doc: InvoiceDocument }) {
  return (
    <article
      aria-label={`Prévia da fatura ${doc.code}`}
      className="overflow-hidden rounded-lg bg-white text-[#10100d] shadow-[0_12px_32px_-12px_rgb(0_0_0/0.6)]"
    >
      <header className="flex items-start justify-between gap-4 bg-[#191816] px-5 py-4 text-white sm:px-6">
        <div>
          <p className="text-lg font-semibold tracking-tight">Finova Analytics</p>
          <p className="text-xs text-[#a3a29c]">{doc.title}</p>
        </div>
        <div className="text-end">
          <p className="text-sm font-semibold tabular-nums">{doc.code}</p>
          <p className="text-xs text-[#a3a29c]">{doc.status}</p>
        </div>
      </header>

      <div className="px-5 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {doc.fields.map((field) => (
            <div key={field.label}>
              <dt className="text-[10px] font-medium uppercase tracking-wider text-[#5c5b57]">{field.label}</dt>
              <dd className="mt-0.5 text-sm">{field.value}</dd>
            </div>
          ))}
        </dl>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-[#dcdad4] text-[10px] uppercase tracking-wider text-[#5c5b57]">
              <th scope="col" className="pb-2 text-start font-medium">Descrição</th>
              <th scope="col" className="pb-2 text-end font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {doc.lines.map((line) => (
              <tr key={line.description} className="border-b border-[#dcdad4]">
                <td className="py-3 pe-4">{line.description}</td>
                <td className="py-3 text-end tabular-nums">{line.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-4 flex items-baseline justify-end gap-6">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-xl font-semibold tabular-nums text-[#2e7d67]">{doc.total}</span>
        </p>

        <p className="mt-8 border-t border-[#dcdad4] pt-3 text-[11px] text-[#5c5b57]">{doc.footer}</p>
      </div>
    </article>
  );
}

export function InvoicePreviewDialog({ doc, open, onClose }: { doc?: InvoiceDocument; open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pré-visualização da fatura"
      description={doc ? `${doc.code} · confira antes de baixar` : undefined}
      size="lg"
    >
      {doc && (
        <>
          <div className="mt-5">
            <InvoicePaper doc={doc} />
          </div>
          <div className="mt-5">
            <ModalActions>
              <button type="button" onClick={onClose} className={secondaryButton}>
                Fechar
              </button>
              <button
                type="button"
                onClick={() => downloadInvoicePdf(doc)}
                className={`${primaryButton} inline-flex items-center gap-2`}
              >
                <Download size={16} aria-hidden="true" /> Baixar PDF
              </button>
            </ModalActions>
          </div>
        </>
      )}
    </Modal>
  );
}
