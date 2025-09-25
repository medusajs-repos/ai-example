import { HttpTypes } from "@medusajs/types"

/**
 * Sorts cart items by their creation date in ascending order (oldest first).
 * Items without creation dates are placed at the end.
 * Used to display cart items in a consistent order.
 * 
 * @param items - Array of cart line items to sort
 * @returns Sorted array of cart line items ordered by creation date
 * 
 * @example
 * ```typescript
 * const sortedItems = sortCartItems(cart.items);
 * // Returns items sorted from oldest to newest
 * ```
 */
export const sortCartItems = (items: HttpTypes.StoreCartLineItem[]): HttpTypes.StoreCartLineItem[] => {
  return items.sort((a, b) => {
    if (!a.created_at || !b.created_at) {
      return 0
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}