import { HttpTypes } from "@medusajs/types"

/**
 * Retrieves the active (pending) payment session from a cart's payment collection.
 * 
 * @param cart - The cart object containing payment collection data
 * @returns The pending payment session if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * const activeSession = getActivePaymentSession(cart);
 * if (activeSession) {
 *   // Process payment with the active session
 *   console.log(`Payment method: ${activeSession.provider_id}`);
 * }
 * ```
 */
export const getActivePaymentSession = (cart: HttpTypes.StoreCart): HttpTypes.StorePaymentSession | undefined => {
  return cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )
}