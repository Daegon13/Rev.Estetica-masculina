export function buildWhatsAppLink(phoneE164Digits: string, message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneE164Digits}?text=${encoded}`;
}

export function formatUYU(value: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0
  }).format(value);
}
