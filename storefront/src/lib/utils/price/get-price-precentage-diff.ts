/**
 * Calculates the percentage difference between original and calculated prices.
 * Returns the discount percentage as a string.
 * Used to display the discount percentage in a consistent format.
 * 
 * @param original - The original price amount
 * @param calculated - The calculated/discounted price amount
 * @returns Percentage difference as a string (e.g., "25" for 25% discount)
 * 
 * @example
 * ```typescript
 * getPricePercentageDiff(100, 75); // "25" (25% discount)
 * getPricePercentageDiff(50, 40); // "20" (20% discount)
 * getPricePercentageDiff(30, 30); // "0" (no discount)
 * ```
 */
export const getPricePercentageDiff = (original: number, calculated: number): string => {
  const diff = original - calculated
  const decrease = (diff / original) * 100

  return decrease.toFixed()
}