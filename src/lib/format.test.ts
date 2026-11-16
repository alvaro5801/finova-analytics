/**
 * Testes unitários de src/lib/format.ts, com o test runner nativo do Node (`node:test`)
 * e sem dependências extras (ADR-0010). Rode com `npm run test:unit`.
 *
 * O script fixa TZ=America/Sao_Paulo: datas com horário dependem do fuso de quem executa.
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  formatBRL,
  formatBRLCompact,
  formatDate,
  formatDateTime,
  formatDecimal,
  formatDelta,
  formatMetric,
  formatMonthLong,
  formatMonthName,
  formatMonthShort,
  formatNumber,
  formatPercent,
  formatRelative,
  formatSignedBRL,
} from "./format.ts";

/** Espaço não separável que o Intl pt-BR insere depois de "R$" (e antes de "mil"/"mi"). */
const NBSP = " ";
/** Menos tipográfico usado em todos os valores negativos da interface. */
const MINUS = "−";

describe("formatBRL (centavos → reais)", () => {
  test("formata milhar com ponto e centavos com vírgula", () => {
    assert.equal(formatBRL(12_345_678), `R$${NBSP}123.456,78`);
    assert.equal(formatBRL(128_456_012), `R$${NBSP}1.284.560,12`);
  });

  test("zero e centavos isolados", () => {
    assert.equal(formatBRL(0), `R$${NBSP}0,00`);
    assert.equal(formatBRL(5), `R$${NBSP}0,05`);
  });

  test("negativo usa o menos tipográfico, igual a formatSignedBRL", () => {
    assert.equal(formatBRL(-100), `${MINUS}R$${NBSP}1,00`);
    assert.equal(formatBRL(-892_040), formatSignedBRL(-892_040));
  });

  test("o separador depois de R$ é espaço NÃO separável (pegadinha de testes)", () => {
    assert.notEqual(formatBRL(100), "R$ 1,00");
    assert.match(formatBRL(100), /^R\$\s1,00$/);
  });
});

describe("formatSignedBRL (entradas e saídas)", () => {
  test("entrada com +, saída com −", () => {
    assert.equal(formatSignedBRL(1_248_000), `+R$${NBSP}12.480,00`);
    assert.equal(formatSignedBRL(-892_040), `${MINUS}R$${NBSP}8.920,40`);
  });

  test("zero conta como entrada", () => {
    assert.equal(formatSignedBRL(0), `+R$${NBSP}0,00`);
  });
});

describe("formatBRLCompact (eixos e rótulos curtos)", () => {
  test("mil e milhão em notação compacta pt-BR", () => {
    assert.equal(formatBRLCompact(48_632_045), `R$${NBSP}486,3${NBSP}mil`);
    assert.equal(formatBRLCompact(600_000_000), `R$${NBSP}6${NBSP}mi`);
  });
});

describe("números e porcentagens", () => {
  test("formatNumber agrupa milhar a partir de 4 dígitos", () => {
    assert.equal(formatNumber(1950), "1.950");
    assert.equal(formatNumber(9262), "9.262");
    assert.equal(formatNumber(320), "320");
  });

  test("formatDecimal sempre com uma casa", () => {
    assert.equal(formatDecimal(8.7), "8,7");
    assert.equal(formatDecimal(9), "9,0");
  });

  test("formatPercent recebe pontos percentuais", () => {
    assert.equal(formatPercent(12.4), "12,4%");
    assert.equal(formatPercent(70.3), "70,3%");
  });

  test("formatDelta tem sinal explícito", () => {
    assert.equal(formatDelta(12.4), "+12,4%");
    assert.equal(formatDelta(-3), `${MINUS}3,0%`);
  });
});

describe("formatMetric (value Int + format, ADR-0001)", () => {
  test("currency = centavos", () => {
    assert.equal(formatMetric(18_240, "currency"), `R$${NBSP}182,40`);
  });

  test("percent = pontos-base (1% = 100)", () => {
    assert.equal(formatMetric(2360, "percent"), "23,6%");
    assert.equal(formatMetric(230, "percent"), "2,3%");
  });

  test("number = unidades", () => {
    assert.equal(formatMetric(3418, "number"), "3.418");
  });
});

describe("meses e datas (pt-BR)", () => {
  test("chave AAAA-MM vira mês curto, longo e por extenso", () => {
    assert.equal(formatMonthShort("2026-10"), "Out");
    assert.equal(formatMonthShort("2026-02"), "Fev");
    assert.equal(formatMonthLong("2026-10"), "Outubro de 2026");
    assert.equal(formatMonthName("2026-10"), "outubro");
  });

  test("virada de ano não escorrega de mês", () => {
    assert.equal(formatMonthShort("2025-12"), "Dez");
    assert.equal(formatMonthShort("2026-01"), "Jan");
  });

  test("formatDate e formatDateTime no fuso de Brasília", () => {
    assert.equal(formatDate("2026-11-15T15:00:00.000Z"), "15 de nov. de 2026");
    assert.equal(formatDateTime("2026-11-15T15:32:00.000Z"), "15 de nov., 12:32");
  });
});

describe("formatRelative", () => {
  const now = new Date("2026-11-15T12:00:00-03:00");
  test("descreve há quanto tempo, em português", () => {
    assert.equal(formatRelative(new Date("2026-11-15T11:59:40-03:00"), now), "agora há pouco");
    assert.equal(formatRelative(new Date("2026-11-15T11:55:00-03:00"), now), "há 5 minutos");
    assert.equal(formatRelative(new Date("2026-11-15T09:00:00-03:00"), now), "há 3 horas");
    assert.equal(formatRelative(new Date("2026-11-13T12:00:00-03:00"), now), "há 2 dias");
  });
});
