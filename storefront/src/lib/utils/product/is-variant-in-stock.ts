import { HttpTypes } from "@medusajs/types"

/**
 * Determines if a product variant is available for purchase.
 * Considers inventory management settings, backorder allowance, and current stock levels.
 * 
 * @param variant - The product variant to check stock for
 * @returns True if variant is in stock or available for backorder, false otherwise
 * 
 * @example
 * ```typescript
 * const isAvailable = isVariantInStock(variant);
 * if (isAvailable) {
 *   // Show "Add to Cart" button
 * } else {
 *   // Show "Out of Stock" message
 * }
 * 
 * // Variant is in stock if:
 * // - Inventory is not managed, OR
 * // - Backorders are allowed, OR
 * // - Inventory is managed and quantity > 0
 * ```
 */
export default function isVariantInStock(variant: HttpTypes.StoreProductVariant): boolean {
  return !variant.manage_inventory || variant.allow_backorder || (
    variant.manage_inventory === true &&
    (variant.inventory_quantity || 0) > 0
  )
}