import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { buildPdf } from "./pdf.ts";

function render() {
  const bytes = buildPdf([
    { kind: "rect", x: 0, y: 742, w: 595, h: 100, color: [121, 88, 245] },
    { kind: "text", text: "Ação (teste) – R$ 1.490,00", x: 50, y: 800, bold: true },
    { kind: "text", text: "R$ 10,00", x: 545, y: 500, align: "right" },
    { kind: "line", x1: 50, y1: 580, x2: 545, y2: 580 },
  ]);
  return Buffer.from(bytes).toString("latin1");
}

describe("buildPdf", () => {
  test("gera um documento PDF completo", () => {
    const pdf = render();
    assert.ok(pdf.startsWith("%PDF-1.4"));
    assert.ok(pdf.trimEnd().endsWith("%%EOF"));
  });

  test("codifica o texto em WinAnsi e escapa parênteses", () => {
    assert.ok(render().includes("(A\xe7\xe3o \\(teste\\) \x96 R$ 1.490,00) Tj"));
  });

  test("a tabela xref aponta para o início de cada objeto", () => {
    const pdf = render();
    const startxref = Number(/startxref\n(\d+)/.exec(pdf)![1]);
    assert.ok(pdf.slice(startxref).startsWith("xref"));
    const offsets = [...pdf.matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]));
    assert.ok(offsets.length >= 6);
    offsets.forEach((offset, i) => assert.ok(pdf.slice(offset).startsWith(`${i + 1} 0 obj`)));
  });

  test("texto alinhado à direita termina na coordenada x informada", () => {
    // "R$ 10,00" em Helvetica 11: 4×556 (dígitos) + 722 (R) + 556 ($) + 278 (espaço) + 278 (vírgula) = 4058/1000 em
    const width = (4058 / 1000) * 11;
    assert.ok(render().includes(`${(545 - width).toFixed(2)} 500.00 Td`));
  });
});
