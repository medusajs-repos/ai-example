import Medusa from "@medusajs/js-sdk"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (import.meta.env.VITE_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL
}

/**
 * Pre-configured Medusa SDK instance for storefront operations.
 * Automatically configures backend URL, debug mode, and publishable key from environment variables.
 * Useful for making API requests to the Medusa backend.
 * 
 * @example
 * ```typescript
 * import { sdk } from "@/lib/utils/common/sdk";
 * 
 * // Fetch products
 * const products = await sdk.store.product.list();
 * 
 * // Create a cart
 * const cart = await sdk.store.cart.create();
 * ```
 */
export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: import.meta.env.DEV,
  publishableKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "session",
  }
})
