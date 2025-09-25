import { HttpTypes } from "@medusajs/types"
import { QueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/utils/common/query-keys"

/**
 * Utility functions for optimistic cart updates
 */

export interface OptimisticCartItem {
  id: string;
  variant_id: string;
  quantity: number;
  title: string;
  thumbnail?: string | null;
  product_title?: string;
  variant_title?: string;
  product?: {
    id: string;
    title: string;
  };
  variant?: {
    id: string;
    title: string;
  };
  unit_price: number;
  total: number;
  isOptimistic?: boolean;
}

export interface OptimisticCart extends HttpTypes.StoreCart {
  isOptimistic?: boolean;
}

/**
 * Creates an optimistic cart item for immediate UI updates during add to cart operations.
 * Generates a temporary item with calculated pricing before the server response.
 * 
 * @param variant - The product variant being added to cart
 * @param product - The product object containing title and thumbnail
 * @param quantity - The quantity to add (defaults to 1)
 * @returns Optimistic cart item with temporary ID and calculated totals
 * 
 * @example
 * ```typescript
 * const optimisticItem = createOptimisticCartItem(variant, product, 2);
 * // Returns item with temporary ID and calculated price for immediate UI update
 * ```
 */
export const createOptimisticCartItem = (
  variant: HttpTypes.StoreProductVariant,
  product: HttpTypes.StoreProduct,
  quantity: number = 1
): OptimisticCartItem => {
  const unitPrice = variant.calculated_price?.calculated_amount || 0
  
  return {
    id: `optimistic-${variant.id}-${Date.now()}`, // Temporary ID
    variant_id: variant.id,
    quantity,
    title: product.title,
    thumbnail: product.thumbnail,
    product: {
      id: product.id,
      title: product.title,
    },
    product_title: product.title,
    variant: {
      id: variant.id,
      title: variant.title || "Default Variant",
    },
    variant_title: variant.title || "Default Variant",
    unit_price: unitPrice,
    total: unitPrice * quantity,
    isOptimistic: true,
  }
}

/**
 * Adds an item to the cart optimistically by updating the query cache immediately.
 * This provides instant UI feedback while the actual API call is in progress.
 * 
 * @param queryClient - TanStack Query client for cache management
 * @param newItem - The optimistic cart item to add
 * @param fields - Optional fields parameter for query key
 * @returns Updated cart object or null if no current cart exists
 * 
 * @example
 * ```typescript
 * const updatedCart = addItemOptimistically(queryClient, optimisticItem);
 * if (updatedCart) {
 *   // UI immediately shows the new item
 *   // Real API call happens in background
 * }
 * ```
 */
export const addItemOptimistically = (
  queryClient: QueryClient,
  newItem: OptimisticCartItem,
  optimisticCart?: OptimisticCart,
  fields?: string
): HttpTypes.StoreCart | null => {
  const currentCart = optimisticCart || queryClient.getQueryData<HttpTypes.StoreCart | null>(
    queryKeys.cart.current(fields)
  )

  if (!currentCart) {
    // If no cart exists, we can't add optimistically
    // The mutation will handle creating a new cart
    return null
  }

  // Check if item already exists in cart
  const existingItemIndex = currentCart.items?.findIndex(
    item => item.variant_id === newItem.variant_id
  )

  let updatedItems: HttpTypes.StoreCartLineItem[]

  if (existingItemIndex !== undefined && existingItemIndex >= 0) {
    // Update existing item quantity
    updatedItems = [...(currentCart.items || [])]
    const existingItem = updatedItems[existingItemIndex]
    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: existingItem.quantity + newItem.quantity,
      total: (existingItem.unit_price || 0) * (existingItem.quantity + newItem.quantity),
    }
  } else {
    // Add new item - cast to StoreCartLineItem for compatibility
    const optimisticLineItem = {
      ...newItem,
      cart_id: currentCart.id,
      cart: currentCart,
      item_total: newItem.total,
      item_subtotal: newItem.total,
      item_tax_total: 0,
      original_total: newItem.total,
      original_tax_total: 0,
      original_subtotal: newItem.total,
      discount_total: 0,
      discount_tax_total: 0,
      gift_card_total: 0,
      subtotal: newItem.total,
      tax_total: 0,
      total: newItem.total,
      created_at: new Date(),
      updated_at: new Date(),
      metadata: {},
      adjustments: [],
      tax_lines: [],
      unit_tax_amount: 0,
      requires_shipping: true,
      is_discountable: true,
      is_tax_inclusive: false,
    } as HttpTypes.StoreCartLineItem
    
    updatedItems = [...(currentCart.items || []), optimisticLineItem]
  }

  const newItemSubtotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0)

  const newOptimisticCart: OptimisticCart = {
    ...currentCart,
    items: updatedItems,
    item_subtotal: newItemSubtotal,
    isOptimistic: true,
  }

  // Update the cache optimistically
  queryClient.setQueryData(queryKeys.cart.current(fields), newOptimisticCart)

  return newOptimisticCart
}

/**
 * Updates a cart line item quantity optimistically in the query cache.
 * Provides immediate UI feedback for quantity changes.
 * 
 * @param queryClient - TanStack Query client for cache management
 * @param lineId - The ID of the line item to update
 * @param quantity - The new quantity for the line item
 * @param fields - Optional fields parameter for query key
 * @returns Updated cart object or null if no current cart exists
 * 
 * @example
 * ```typescript
 * const updatedCart = updateLineItemOptimistically(queryClient, "line_123", 3);
 * if (updatedCart) {
 *   // UI immediately shows updated quantity and totals
 * }
 * ```
 */
export const updateLineItemOptimistically = (
  queryClient: QueryClient,
  lineId: string,
  quantity: number,
  fields?: string
): HttpTypes.StoreCart | null => {
  const currentCart = queryClient.getQueryData<HttpTypes.StoreCart | null>(
    queryKeys.cart.current(fields)
  )

  if (!currentCart) {
    return null
  }

  const updatedItems = (currentCart.items || []).map(item => {
    if (item.id === lineId) {
      return {
        ...item,
        quantity,
        total: (item.unit_price || 0) * quantity,
        original_total: (item.unit_price || 0) * quantity,
      }
    }
    return item
  })

  const optimisticCart: OptimisticCart = {
    ...currentCart,
    items: updatedItems,
    item_subtotal: updatedItems.reduce((sum, item) => sum + (item.total || 0), 0),
    isOptimistic: true,
  }

  queryClient.setQueryData(queryKeys.cart.current(fields), optimisticCart)

  return optimisticCart
}

/**
 * Removes a cart line item optimistically from the query cache.
 * Provides immediate UI feedback for item removal.
 * 
 * @param queryClient - TanStack Query client for cache management
 * @param lineId - The ID of the line item to remove
 * @param fields - Optional fields parameter for query key
 * @returns Updated cart object or null if no current cart exists
 * 
 * @example
 * ```typescript
 * const updatedCart = removeLineItemOptimistically(queryClient, "line_123");
 * if (updatedCart) {
 *   // UI immediately shows item removed and updated totals
 * }
 * ```
 */
export const removeLineItemOptimistically = (
  queryClient: QueryClient,
  lineId: string,
  fields?: string
): HttpTypes.StoreCart | null => {
  const currentCart = queryClient.getQueryData<HttpTypes.StoreCart | null>(
    queryKeys.cart.current(fields)
  )

  if (!currentCart) {
    return null
  }

  const updatedItems = (currentCart.items || []).filter(item => item.id !== lineId)

  const optimisticCart: OptimisticCart = {
    ...currentCart,
    items: updatedItems,
    item_subtotal: updatedItems.reduce((sum, item) => sum + (item.total || 0), 0),
    isOptimistic: true,
  }

  queryClient.setQueryData(queryKeys.cart.current(fields), optimisticCart)

  return optimisticCart
}

/**
 * Rolls back optimistic cart changes when an API call fails.
 * Restores the cart to its previous state before the optimistic update.
 * 
 * @param queryClient - TanStack Query client for cache management
 * @param previousCart - The cart state to restore to
 * @param fields - Optional fields parameter for query key
 * 
 * @example
 * ```typescript
 * try {
 *   await addToCart(variant);
 * } catch (error) {
 *   // Rollback optimistic changes on error
 *   rollbackOptimisticCart(queryClient, previousCart);
 *   showErrorMessage("Failed to add item to cart");
 * }
 * ```
 */
export const rollbackOptimisticCart = (
  queryClient: QueryClient,
  previousCart: HttpTypes.StoreCart | null,
  fields?: string
) => {
  queryClient.setQueryData(queryKeys.cart.current(fields), previousCart)
}

/**
 * Creates an optimistic cart for immediate UI updates during cart creation operations.
 * Generates a temporary cart with basic structure before the server response.
 * 
 * @param region_id - The region ID for the cart
 * @param fields - Optional fields parameter for query key
 * @returns Optimistic cart with temporary ID and basic structure
 * 
 * @example
 * ```typescript
 * const optimisticCart = createOptimisticCart('reg_us');
 * // Returns cart with temporary ID for immediate UI update
 * ```
 */
export const createOptimisticCart = (region: HttpTypes.StoreRegion): OptimisticCart => {
  const tempId = `optimistic-cart-${Date.now()}`
  
  return {
    id: tempId,
    region_id: region.id,
    items: [],
    item_subtotal: 0,
    item_tax_total: 0,
    item_total: 0,
    original_item_total: 0,
    original_item_tax_total: 0,
    original_item_subtotal: 0,
    original_total: 0,
    original_tax_total: 0,
    original_subtotal: 0,
    subtotal: 0,
    tax_total: 0,
    total: 0,
    discount_total: 0,
    discount_tax_total: 0,
    gift_card_total: 0,
    gift_card_tax_total: 0,
    shipping_total: 0,
    shipping_tax_total: 0,
    shipping_subtotal: 0,
    original_shipping_total: 0,
    original_shipping_subtotal: 0,
    original_shipping_tax_total: 0,
    shipping_address: undefined,
    billing_address: undefined,
    shipping_methods: [],
    payment_collection: undefined,
    region: undefined,
    customer_id: undefined,
    sales_channel_id: undefined,
    promotions: [],
    currency_code: region.currency_code,
    metadata: {},
    created_at: new Date(),
    updated_at: new Date(),
    isOptimistic: true,
  }
}

/**
 * Gets the current cart state from the query cache.
 * First tries to get the cart with specific fields, then falls back to any cart query.
 * 
 * @param queryClient - TanStack Query client for cache management
 * @param fields - Optional fields parameter for query key
 * @returns Current cart object or null if no cart found in cache
 * 
 * @example
 * ```typescript
 * const currentCart = getCurrentCart(queryClient);
 * if (currentCart) {
 *   // Use current cart state
 *   console.log(`Cart has ${currentCart.items?.length} items`);
 * }
 * ```
 */
export const getCurrentCart = (queryClient: QueryClient, fields?: string): HttpTypes.StoreCart | null => {
  return queryClient.getQueryData<HttpTypes.StoreCart | null>(queryKeys.cart.current(fields)) || 
    queryClient.getQueriesData<HttpTypes.StoreCart | null>({
      predicate: queryKeys.cart.predicate
    })[0]?.[1] || null
}
