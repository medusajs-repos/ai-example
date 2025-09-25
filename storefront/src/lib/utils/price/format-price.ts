import { isEmpty } from "@/lib/utils/common/validation"

type FormatPriceParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

/**
 * Formats a numeric amount as currency using the Intl.NumberFormat API.
 * Falls back to plain number string if currency code is empty or invalid.
 * Used to display prices in a consistent format.
 * 
 * @param params - Formatting parameters
 * @param params.amount - The numeric amount to format
 * @param params.currency_code - The currency code (e.g., "USD", "EUR")
 * @param params.minimumFractionDigits - Minimum number of decimal places
 * @param params.maximumFractionDigits - Maximum number of decimal places
 * @param params.locale - Locale for formatting (defaults to "en-US")
 * @returns Formatted currency string or plain number string
 * 
 * @example
 * ```typescript
 * formatPrice({ amount: 19.99, currency_code: "USD" }); // "$19.99"
 * formatPrice({ amount: 100, currency_code: "EUR", locale: "de-DE" }); // "100,00 €"
 * formatPrice({ amount: 25, currency_code: "" }); // "25"
 * formatPrice({ 
 *   amount: 19.9, 
 *   currency_code: "USD", 
 *   minimumFractionDigits: 2 
 * }); // "$19.90"
 * ```
 */
export const formatPrice = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: FormatPriceParams): string => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}