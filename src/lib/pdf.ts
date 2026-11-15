/**
 * Gerador mínimo de PDF (uma página A4, Helvetica), sem dependências.
 * Cobre o que a fatura precisa: texto, retângulos preenchidos e linhas.
 */
export type Rgb = readonly [number, number, number];

export type PdfOp =
  | {
      kind: "text";
      text: string;
      x: number;
      y: number;
      size?: number;
      bold?: boolean;
      color?: Rgb;
      align?: "left" | "right";
    }
  | { kind: "rect"; x: number; y: number; w: number; h: number; color: Rgb }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; color?: Rgb; width?: number };

export const A4 = { width: 595, height: 842 } as const;

/** Caracteres fora do Latin-1 que existem no WinAnsiEncoding. */
const WIN_ANSI_EXTRA: Record<string, number> = { "–": 0x96, "—": 0x97, "•": 0x95, "…": 0x85, "’": 0x92, "“": 0x93, "”": 0x94 };

function toWinAnsi(text: string) {
  let out = "";
  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (WIN_ANSI_EXTRA[char]) out += String.fromCharCode(WIN_ANSI_EXTRA[char]);
    else out += code < 256 ? char : "?";
  }
  return out;
}

function escapeText(text: string) {
  return toWinAnsi(text).replace(/[\\()]/g, "\\$&");
}

/** Larguras Helvetica (1/1000 em) dos caracteres de valores e datas; o resto usa a média. */
const WIDTHS: Record<string, number> = {
  " ": 278, " ": 278, ",": 278, ".": 278, "/": 278, "-": 333, "$": 556, R: 722, "#": 556,
  ...Object.fromEntries("0123456789".split("").map((d) => [d, 556])),
};

function textWidth(text: string, size: number) {
  let units = 0;
  for (const char of text) units += WIDTHS[char] ?? 556;
  return (units / 1000) * size;
}

const n = (value: number) => value.toFixed(2);
const rgb = ([r, g, b]: Rgb) => `${n(r / 255)} ${n(g / 255)} ${n(b / 255)}`;

function renderOp(op: PdfOp) {
  switch (op.kind) {
    case "rect":
      return `${rgb(op.color)} rg ${n(op.x)} ${n(op.y)} ${n(op.w)} ${n(op.h)} re f`;
    case "line":
      return `${rgb(op.color ?? [220, 224, 232])} RG ${n(op.width ?? 0.8)} w ${n(op.x1)} ${n(op.y1)} m ${n(op.x2)} ${n(op.y2)} l S`;
    case "text": {
      const size = op.size ?? 11;
      const x = op.align === "right" ? op.x - textWidth(op.text, size) : op.x;
      return `BT /${op.bold ? "F2" : "F1"} ${size} Tf ${rgb(op.color ?? [9, 14, 26])} rg ${n(x)} ${n(op.y)} Td (${escapeText(op.text)}) Tj ET`;
    }
  }
}

export function buildPdf(ops: PdfOp[]): Uint8Array<ArrayBuffer> {
  const content = ops.map(renderOp).join("\n");
  const font = (name: string) => `<< /Type /Font /Subtype /Type1 /BaseFont /${name} /Encoding /WinAnsiEncoding >>`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4.width} ${A4.height}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    font("Helvetica"),
    font("Helvetica-Bold"),
  ];

  // Todo o documento é Latin-1 (1 byte por caractere), então o tamanho da string é o offset em bytes.
  let pdf = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i);
  return bytes;
}
