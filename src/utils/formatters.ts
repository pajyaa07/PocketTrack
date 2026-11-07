/**
 * Formats numbers into Indian Rupee format (e.g. 12480 -> ₹ 12,480, 100000 -> ₹ 1,00,000)
 */
export function formatRupee(amount: number, showSymbol = true): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);

  return showSymbol ? `₹ ${formatted}` : formatted;
}

export function formatCompactRupee(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  }
  return `₹${amount}`;
}
