import { formatBRL, formatDate, formatMonthLong } from "@/lib/format";
import { A4, buildPdf, type PdfOp, type Rgb } from "@/lib/pdf";
import type { InvoiceData } from "@/types/dashboard";

/**
 * Conteúdo da fatura, montado uma vez e usado tanto no PDF quanto na pré-visualização:
 * o que a pessoa vê na tela é exatamente o que vai baixar.
 */
export interface InvoiceDocument {
  code: string;
  status: string;
  title: string;
  fields: { label: string; value: string }[];
  lines: { description: string; amount: string }[];
  total: string;
  footer: string;
  fileName: string;
}

export function invoiceDocument(invoice: InvoiceData, paymentMethod: string): InvoiceDocument {
  const amount = formatBRL(invoice.amountCents);
  // "#FN-202611" → "2026-11": a competência vem do código da fatura.
  const digits = invoice.code.replace(/\D/g, "");
  return {
    code: invoice.code,
    status: "Paga",
    title: "Fatura da assinatura",
    fields: [
      { label: "Emitida em", value: formatDate(invoice.issuedAt) },
      { label: "Cliente", value: "FINOVA DEMO LTDA" },
      { label: "Competência", value: formatMonthLong(`${digits.slice(0, 4)}-${digits.slice(4, 6)}`) },
      { label: "Forma de pagamento", value: paymentMethod },
    ],
    lines: [{ description: "Assinatura Finova Business – plano mensal", amount }],
    total: amount,
    footer: "Documento fictício gerado no ambiente de demonstração da Finova Analytics. Sem validade fiscal.",
    fileName: `fatura-${invoice.code.replace(/\W/g, "")}.pdf`,
  };
}

const HEADER: Rgb = [25, 24, 22];
const ACCENT: Rgb = [46, 125, 103];
const WHITE: Rgb = [255, 255, 255];
const SOFT_WHITE: Rgb = [154, 153, 147];
const INK: Rgb = [16, 16, 13];
const MUTED: Rgb = [110, 109, 104];

const LEFT = 50;
const RIGHT = A4.width - 50;
const COLUMNS = [LEFT, 320];

export function invoicePdfBytes(doc: InvoiceDocument) {
  const fields = doc.fields.flatMap(({ label, value }, i): PdfOp[] => {
    const x = COLUMNS[i % 2];
    const y = 690 - Math.floor(i / 2) * 50;
    return [
      { kind: "text", text: label.toUpperCase(), x, y, size: 8, color: MUTED },
      { kind: "text", text: value, x, y: y - 16, size: 11, color: INK },
    ];
  });
  const lines = doc.lines.flatMap(({ description, amount }, i): PdfOp[] => [
    { kind: "text", text: description, x: LEFT, y: 538 - i * 24, size: 11 },
    { kind: "text", text: amount, x: RIGHT, y: 538 - i * 24, size: 11, align: "right" },
  ]);
  const afterLines = 522 - (doc.lines.length - 1) * 24;

  return buildPdf([
    { kind: "rect", x: 0, y: A4.height - 110, w: A4.width, h: 110, color: HEADER },
    { kind: "text", text: "Finova Analytics", x: LEFT, y: A4.height - 55, size: 22, bold: true, color: WHITE },
    { kind: "text", text: doc.title, x: LEFT, y: A4.height - 78, size: 11, color: SOFT_WHITE },
    { kind: "text", text: doc.code, x: RIGHT, y: A4.height - 55, size: 14, bold: true, color: WHITE, align: "right" },
    { kind: "text", text: doc.status, x: RIGHT, y: A4.height - 78, size: 11, color: SOFT_WHITE, align: "right" },
    ...fields,
    { kind: "text", text: "DESCRIÇÃO", x: LEFT, y: 572, size: 8, color: MUTED },
    { kind: "text", text: "VALOR", x: RIGHT, y: 572, size: 8, color: MUTED, align: "right" },
    { kind: "line", x1: LEFT, y1: 562, x2: RIGHT, y2: 562 },
    ...lines,
    { kind: "line", x1: LEFT, y1: afterLines, x2: RIGHT, y2: afterLines },
    { kind: "text", text: "Total", x: 360, y: afterLines - 28, size: 12, bold: true },
    { kind: "text", text: doc.total, x: RIGHT, y: afterLines - 30, size: 16, bold: true, color: ACCENT, align: "right" },
    { kind: "line", x1: LEFT, y1: 90, x2: RIGHT, y2: 90 },
    { kind: "text", text: doc.footer, x: LEFT, y: 70, size: 8, color: MUTED },
  ]);
}

export function downloadInvoicePdf(doc: InvoiceDocument) {
  const blob = new Blob([invoicePdfBytes(doc)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = doc.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revogar no mesmo tick pode cancelar o download em alguns navegadores.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
