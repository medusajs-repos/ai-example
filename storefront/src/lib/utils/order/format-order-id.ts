/**
 * Formats an order ID with a hash prefix and zero-padding for consistent display.
 * 
 * @param orderId - The raw order ID string
 * @returns Formatted order ID with hash prefix and zero-padding (e.g., "#000123")
 * 
 * @example
 * ```typescript
 * formatOrderId("123"); // "#000123"
 * formatOrderId("1"); // "#000001"
 * formatOrderId("1234567"); // "#1234567"
 * ```
 */
export const formatOrderId = (orderId: string): string => {
  return `#${orderId.padStart(6, "0")}`
}