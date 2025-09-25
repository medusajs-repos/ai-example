import { HttpTypes } from "@medusajs/types"

/**
 * Determines if a cart or order was paid entirely with gift cards.
 * 
 * @param cartOrOrder - The cart or order object to check
 * @returns True if the cart/order has gift cards and total is 0, false otherwise
 * 
 * @example
 * ```typescript
 * const isGiftCardPayment = isPaidWithGiftCard(cart);
 * if (isGiftCardPayment) {
 *   // Handle gift card payment flow
 *   console.log("Order paid with gift cards");
 * }
 * ```
 */
export const isPaidWithGiftCard = (cartOrOrder: HttpTypes.StoreCart | HttpTypes.StoreOrder): boolean => {
  return (cartOrOrder as any)?.gift_cards && 
  (cartOrOrder as any)?.gift_cards?.length > 0 && 
  cartOrOrder?.total === 0
}