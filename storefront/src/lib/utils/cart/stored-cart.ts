const CART_KEY = "medusa_cart"

/**
 * Retrieves the stored cart ID from localStorage.
 * Useful for loading cart data from previous sessions.
 * 
 * @returns The cart ID string if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * const cartId = getStoredCart();
 * if (cartId) {
 *   // Load cart with the stored ID
 * }
 * ```
 */
export const getStoredCart = (): string | undefined => {
  return localStorage.getItem(CART_KEY) || undefined
}

/**
 * Stores a cart ID in localStorage for persistence across sessions.
 * Useful after creating a new cart.
 * 
 * @param cart - The cart ID string to store
 * 
 * @example
 * ```typescript
 * setStoredCart("cart_12345");
 * // Cart ID is now persisted in localStorage
 * ```
 */
export const setStoredCart = (cart: string): void => {
  localStorage.setItem(CART_KEY, cart)
}

/**
 * Removes the stored cart ID from localStorage.
 * Useful when clearing cart data or logging out.
 * 
 * @example
 * ```typescript
 * removeStoredCart();
 * // Cart ID is removed from localStorage
 * ```
 */
export const removeStoredCart = (): void => {
  localStorage.removeItem(CART_KEY)
}