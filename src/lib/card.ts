export type CardBrand = "Visa" | "Mastercard" | "Amex" | "Cartão";

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  return "Cartão";
}

/** Dígito verificador dos cartões (ISO/IEC 7812): pega erros de digitação antes de enviar. */
export function luhnValid(digits: string) {
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export function formatCardNumber(value: string) {
  return onlyDigits(value).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(value: string) {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function isExpiryValid(value: string, now = new Date()) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export interface CardInput {
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
}

export type CardErrors = Partial<Record<keyof CardInput, string>>;

export function validateCard(input: CardInput, now = new Date()): CardErrors {
  const errors: CardErrors = {};
  if (!luhnValid(onlyDigits(input.number))) errors.number = "Número de cartão inválido.";
  if (input.holder.trim().length < 3) errors.holder = "Informe o nome impresso no cartão.";
  if (!isExpiryValid(input.expiry, now)) errors.expiry = "Validade inválida ou vencida.";
  if (!/^\d{3,4}$/.test(input.cvv)) errors.cvv = "CVV deve ter 3 ou 4 dígitos.";
  return errors;
}
