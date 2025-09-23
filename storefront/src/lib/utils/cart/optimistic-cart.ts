import { HttpTypes } from "@medusajs/types";
import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

/**
 * Utility functions for optimistic cart updates
 */

export interface OptimisticCartItem {
  id: string;
  variant_id: string;
  quantity: number;
  title: string;
  thumbnail?: string | null;
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
 * Creates an optimistic cart item for add to cart operations
 */
export const createOptimisticCartItem = (
  variant: HttpTypes.StoreProductVariant,
  product: HttpTypes.StoreProduct,
  quantity: number = 1
): OptimisticCartItem => {
  const unitPrice = variant.calculated_price?.calculated_amount || 0;
  
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
    variant: {
      id: variant.id,
      title: variant.title || "Default Variant",
    },
    unit_price: unitPrice,
    total: unitPrice * quantity,
    isOptimistic: true,
  };
};

/**
 * Adds an item to the cart optimistically
 */
export const addItemOptimistically = (
  queryClient: QueryClient,
  newItem: OptimisticCartItem,
  fields?: string
): HttpTypes.StoreCart | null => {
  const currentCart = queryClient.getQueryData<HttpTypes.StoreCart | null>(
    queryKeys.cart.current(fields)
  );

  if (!currentCart) {
    // If no cart exists, we can't add optimistically
    // The mutation will handle creating a new cart
    return null;
  }

  // Check if item already exists in cart
  const existingItemIndex = currentCart.items?.findIndex(
    item => item.variant_id === newItem.variant_id
  );

  let updatedItems: HttpTypes.StoreCartLineItem[];

  if (existingItemIndex !== undefined && existingItemIndex >= 0) {
    // Update existing item quantity
    updatedItems = [...(currentCart.items || [])];
    const existingItem = updatedItems[existingItemIndex];
    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: existingItem.quantity + newItem.quantity,
      total: (existingItem.unit_price || 0) * (existingItem.quantity + newItem.quantity),
    };
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
    } as HttpTypes.StoreCartLineItem;
    
    updatedItems = [...(currentCart.items || []), optimisticLineItem]
  }

  const newItemSubtotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);

  const optimisticCart: OptimisticCart = {
    ...currentCart,
    items: updatedItems,
    item_subtotal: newItemSubtotal,
    isOptimistic: true,
  };

  // Update the cache optimistically
  queryClient.setQueryData(queryKeys.cart.current(fields), optimisticCart);

  return optimisticCart;
};

/**
 * Updates a line item quantity optimistically
 */
export const updateLineItemOptimistically = (
  queryClient: QueryClient,
  lineId: string,
  quantity: number,
  fields?: string
): HttpTypes.StoreCart | null => {
  const currentCart = queryClient.getQueryData<HttpTypes.StoreCart | null>(
    queryKeys.cart.current(fields)
  );

  if (!currentCart) {
    return null;
  }

  const updatedItems = (currentCart.items || []).map(item => {
    if (item.id === lineId) {
      return {
        ...item,
        quantity,
        total: (item.unit_price || 0) * quantity,
        original_total: (item.unit_price || 0) * quantity,
      };
    }
    return item;
  });

  const optimisticCart: OptimisticCart = {
    ...currentCart,
    items: updatedItems,
    item_subtotal: updatedItems.reduce((sum, item) => sum + (item.total || 0), 0),
    isOptimistic: true,
  };

  queryClient.setQueryData(queryKeys.cart.current(fields), optimisticCart);

  return optimisticCart;
};

/**
 * Removes a line item optimistically
 */
export const removeLineItemOptimistically = (
  queryClient: QueryClient,
  lineId: string,
  fields?: string
): HttpTypes.StoreCart | null => {
  const currentCart = queryClient.getQueryData<HttpTypes.StoreCart | null>(
    queryKeys.cart.current(fields)
  );

  if (!currentCart) {
    return null;
  }

  const updatedItems = (currentCart.items || []).filter(item => item.id !== lineId);

  const optimisticCart: OptimisticCart = {
    ...currentCart,
    items: updatedItems,
    item_subtotal: updatedItems.reduce((sum, item) => sum + (item.total || 0), 0),
    isOptimistic: true,
  };

  queryClient.setQueryData(queryKeys.cart.current(fields), optimisticCart);

  return optimisticCart;
};

/**
 * Rolls back optimistic changes on error
 */
export const rollbackOptimisticCart = (
  queryClient: QueryClient,
  previousCart: HttpTypes.StoreCart | null,
  fields?: string
) => {
  queryClient.setQueryData(queryKeys.cart.current(fields), previousCart);
};

/**
 * Gets the current cart state from cache
 */
export const getCurrentCart = (queryClient: QueryClient, fields?: string): HttpTypes.StoreCart | null => {
  return queryClient.getQueryData<HttpTypes.StoreCart | null>(queryKeys.cart.current(fields)) || 
    queryClient.getQueriesData<HttpTypes.StoreCart | null>({
      predicate: queryKeys.cart.predicate
    })[0]?.[1] || null;
};
