import { formatBRL, formatDate, formatMonthLong } from "@/lib/format";
import { A4, buildPdf, type PdfOp, type Rgb } from "@/lib/pdf";
import type { InvoiceData } from "@/types/dashboard";

const HEADER: Rgb = [25, 24, 22];
const ACCENT: Rgb = [46, 125, 103];
const WHITE: Rgb = [255, 255, 255];
const SOFT_WHITE: Rgb = [154, 153, 147];
const INK: Rgb = [16, 16, 13];
const MUTED: Rgb = [110, 109, 104];

const LEFT = 50;
const RIGHT = A4.width - 50;

function field(label: string, value: string, x: number, y: number): PdfOp[] {
  return [
    { kind: "text", text: label.toUpperCase(), x, y, size: 8, color: MUTED },
    { kind: "text", text: value, x, y: y - 16, size: 11, color: INK },
  ];
}

export function invoicePdfBytes(invoice: InvoiceData, paymentMethod: string) {
  const amount = formatBRL(invoice.amountCents);
  // "#FN-202611" → "2026-11": a competência vem do código da fatura.
  const digits = invoice.code.replace(/\D/g, "");
  const reference = formatMonthLong(`${digits.slice(0, 4)}-${digits.slice(4, 6)}`);

  return buildPdf([
    { kind: "rect", x: 0, y: A4.height - 110, w: A4.width, h: 110, color: HEADER },
    { kind: "text", text: "Finova Analytics", x: LEFT, y: A4.height - 55, size: 22, bold: true, color: WHITE },
    { kind: "text", text: "Fatura da assinatura", x: LEFT, y: A4.height - 78, size: 11, color: SOFT_WHITE },
    { kind: "text", text: invoice.code, x: RIGHT, y: A4.height - 55, size: 14, bold: true, color: WHITE, align: "right" },
    { kind: "text", text: "Paga", x: RIGHT, y: A4.height - 78, size: 11, color: SOFT_WHITE, align: "right" },

    ...field("Emitida em", formatDate(invoice.issuedAt), LEFT, 690),
    ...field("Competência", reference, LEFT, 640),
    ...field("Cliente", "FINOVA DEMO LTDA", 320, 690),
    ...field("Forma de pagamento", paymentMethod, 320, 640),

    { kind: "text", text: "DESCRIÇÃO", x: LEFT, y: 572, size: 8, color: MUTED },
    { kind: "text", text: "VALOR", x: RIGHT, y: 572, size: 8, color: MUTED, align: "right" },
    { kind: "line", x1: LEFT, y1: 562, x2: RIGHT, y2: 562 },
    { kind: "text", text: "Assinatura Finova Business – plano mensal", x: LEFT, y: 538, size: 11 },
    { kind: "text", text: amount, x: RIGHT, y: 538, size: 11, align: "right" },
    { kind: "line", x1: LEFT, y1: 522, x2: RIGHT, y2: 522 },
    { kind: "text", text: "Total", x: 360, y: 494, size: 12, bold: true },
    { kind: "text", text: amount, x: RIGHT, y: 492, size: 16, bold: true, color: ACCENT, align: "right" },

    { kind: "line", x1: LEFT, y1: 90, x2: RIGHT, y2: 90 },
    {
      kind: "text",
      text: "Documento fictício gerado no ambiente de demonstração da Finova Analytics. Sem validade fiscal.",
      x: LEFT,
      y: 70,
      size: 8,
      color: MUTED,
    },
  ]);
}

export function downloadInvoicePdf(invoice: InvoiceData, paymentMethod: string) {
  const blob = new Blob([invoicePdfBytes(invoice, paymentMethod)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fatura-${invoice.code.replace(/\W/g, "")}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revogar no mesmo tick pode cancelar o download em alguns navegadores.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
