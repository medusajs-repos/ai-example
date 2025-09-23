import {
  addToCart,
  applyPromoCode,
  createCart,
  deleteLineItem,
  removePromoCode,
  retrieveCart,
  updateLineItem,
} from "@/lib/data/cart"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
  addItemOptimistically,
  createOptimisticCartItem,
  getCurrentCart,
  rollbackOptimisticCart,
  updateLineItemOptimistically,
  removeLineItemOptimistically,
} from "@/lib/utils/cart/optimistic-cart"
import { HttpTypes } from "@medusajs/types"

/**
 * React hook to fetch the current cart with optimistic updates and caching.
 * Uses Tanstack Query with no stale time to ensure fresh data.
 * 
 * @param fields - Optional fields to include in the cart response
 * @returns Tanstack Query result object with cart data, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data: cart, isLoading, error } = useCart();
 * 
 * // With specific fields
 * const { data: cart } = useCart({ 
 *   fields: '*items, *items.variant, *items.variant.product, shipping_methods'
 * });
 * 
 * // In a component
 * function CartSummary() {
 *   const { data: cart, isLoading } = useCart();
 *   
 *   if (isLoading) return <div>Loading cart...</div>;
 *   if (!cart) return <div>No cart found</div>;
 *   
 *   return (
 *     <div>
 *       <h2>Cart ({cart.items.length} items)</h2>
 *       <p>Total: {cart.total}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useCart = ({ fields }: { fields?: string } = {}) => {
  return useQuery({
    queryKey: queryKeys.cart.current(fields),
    queryFn: () => retrieveCart({ fields }),
    staleTime: 0
  })
}

/**
 * React hook to create a new cart with automatic cache invalidation.
 * Uses Tanstack Query's useMutation for handling cart creation.
 * 
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const createCartMutation = useCreateCart();
 * 
 * // Usage in component
 * function CreateCartButton() {
 *   const createCartMutation = useCreateCart();
 *   
 *   const handleCreateCart = () => {
 *     createCartMutation.mutate(
 *       { region_id: 'reg_us' },
 *       {
 *         onSuccess: (cart) => {
 *           console.log('Cart created:', cart.id);
 *           // Redirect to cart page
 *         },
 *         onError: (error) => {
 *           console.error('Failed to create cart:', error);
 *         }
 *       }
 *     );
 *   };
 *   
 *   return (
 *     <button 
 *       onClick={handleCreateCart}
 *       disabled={createCartMutation.isPending}
 *     >
 *       {createCartMutation.isPending ? 'Creating...' : 'Create Cart'}
 *     </button>
 *   );
 * }
 * ```
 */
export const useCreateCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate })
    },
  })
}

/**
 * React hook to add items to cart with optimistic updates.
 * Provides immediate UI feedback while the request is in progress.
 * 
 * @param fields - Optional fields to include in the cart response
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const addToCartMutation = useAddToCart();
 * 
 * // Usage in component
 * function AddToCartButton({ variant, product }) {
 *   const addToCartMutation = useAddToCart();
 *   
 *   const handleAddToCart = () => {
 *     addToCartMutation.mutate({
 *       variant_id: variant.id,
 *       quantity: 1,
 *       country_code: 'us',
 *       product,
 *       variant
 *     }, {
 *       onSuccess: (cart) => {
 *         console.log('Added to cart:', cart);
 *         // Show success message
 *       },
 *       onError: (error) => {
 *         console.error('Failed to add to cart:', error);
 *         // Show error message
 *       }
 *     });
 *   };
 *   
 *   return (
 *     <button 
 *       onClick={handleAddToCart}
 *       disabled={addToCartMutation.isPending}
 *     >
 *       {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
 *     </button>
 *   );
 * }
 * 
 * // With custom fields
 * const addToCartWithFields = useAddToCart({ 
 *   fields: '*items, *items.variant, shipping_methods'
 * });
 * ```
 */
export const useAddToCart = ({ fields }: { fields?: string } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables) => addToCart({ ...variables, fields }),
    onMutate: async (variables: {
      variant_id: string;
      quantity: number;
      country_code: string;
      product?: HttpTypes.StoreProduct;
      variant?: HttpTypes.StoreProductVariant;
    }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ predicate: queryKeys.cart.predicate })

      // Snapshot the previous value
      const previousCart = getCurrentCart(queryClient, fields)

      // If we have a cart and product/variant data, we can add optimistically
      if (previousCart && variables.product && variables.variant) {
        const optimisticItem = createOptimisticCartItem(
          variables.variant,
          variables.product,
          variables.quantity
        )

        addItemOptimistically(queryClient, optimisticItem, fields)
      }

      // Return a context object with the snapshotted value
      return { previousCart }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        rollbackOptimisticCart(queryClient, context.previousCart, fields)
      }
    },
    onSettled: (data) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ predicate: 
        (query) => queryKeys.cart.predicate(query, fields && data ? [fields] : undefined)
      })
      if (data) {
        queryClient.setQueryData(queryKeys.cart.current(fields), data)
      }
    },
  })
}

/**
 * React hook to update line item quantities with optimistic updates.
 * Provides immediate UI feedback while the request is in progress.
 * 
 * @param fields - Optional fields to include in the cart response
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const updateLineItemMutation = useUpdateLineItem();
 * 
 * // Usage in component
 * function QuantitySelector({ lineItem }) {
 *   const updateLineItemMutation = useUpdateLineItem();
 *   
 *   const handleQuantityChange = (newQuantity: number) => {
 *     updateLineItemMutation.mutate({
 *       line_id: lineItem.id,
 *       quantity: newQuantity
 *     }, {
 *       onSuccess: (cart) => {
 *         console.log('Quantity updated:', cart);
 *       },
 *       onError: (error) => {
 *         console.error('Failed to update quantity:', error);
 *       }
 *     });
 *   };
 *   
 *   return (
 *     <select 
 *       value={lineItem.quantity}
 *       onChange={(e) => handleQuantityChange(Number(e.target.value))}
 *       disabled={updateLineItemMutation.isPending}
 *     >
 *       {[1, 2, 3, 4, 5].map(num => (
 *         <option key={num} value={num}>{num}</option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export const useUpdateLineItem = ({ fields }: { fields?: string } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: {
      line_id: string;
      quantity: number;
    }) => updateLineItem({ ...variables, fields }),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        predicate: (query) => queryKeys.cart.predicate(query, fields ? [fields] : undefined)
      })

      // Snapshot the previous value
      const previousCart = getCurrentCart(queryClient, fields)

      // Update optimistically
      if (previousCart) {
        updateLineItemOptimistically(queryClient, variables.line_id, variables.quantity, fields)
      }

      // Return a context object with the snapshotted value
      return { previousCart }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        rollbackOptimisticCart(queryClient, context.previousCart, fields)
      }
    },
    onSettled: (data) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ predicate: 
        (query) => queryKeys.cart.predicate(query, fields && data ? [fields] : undefined)
      })
      if (data) {
        queryClient.setQueryData(queryKeys.cart.current(fields), data)
      }
    },
  })
}

/**
 * React hook to delete line items with optimistic updates.
 * Provides immediate UI feedback while the request is in progress.
 * 
 * @param fields - Optional fields to include in the cart response
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const deleteLineItemMutation = useDeleteLineItem();
 * 
 * // Usage in component
 * function CartItem({ lineItem }) {
 *   const deleteLineItemMutation = useDeleteLineItem();
 *   
 *   const handleRemoveItem = () => {
 *     deleteLineItemMutation.mutate({
 *       line_id: lineItem.id
 *     }, {
 *       onSuccess: (cart) => {
 *         console.log('Item removed:', cart);
 *         // Show success message
 *       },
 *       onError: (error) => {
 *         console.error('Failed to remove item:', error);
 *         // Show error message
 *       }
 *     });
 *   };
 *   
 *   return (
 *     <div>
 *       <span>{lineItem.title}</span>
 *       <button 
 *         onClick={handleRemoveItem}
 *         disabled={deleteLineItemMutation.isPending}
 *       >
 *         {deleteLineItemMutation.isPending ? 'Removing...' : 'Remove'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useDeleteLineItem = ({ fields }: { fields?: string } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: {
      line_id: string;
    }) => deleteLineItem({ ...variables, fields }),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ predicate: 
        (query) => queryKeys.cart.predicate(query, fields ? [fields] : undefined)
      })

      // Snapshot the previous value
      const previousCart = getCurrentCart(queryClient, fields)

      // Remove optimistically
      if (previousCart) {
        removeLineItemOptimistically(queryClient, variables.line_id, fields)
      }

      // Return a context object with the snapshotted value
      return { previousCart }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        rollbackOptimisticCart(queryClient, context.previousCart, fields)
      }
    },
    onSettled: (data) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ predicate: 
        (query) => queryKeys.cart.predicate(query, fields && data ? [fields] : undefined)
      })
      if (data) {
        queryClient.setQueryData(queryKeys.cart.current(fields), data)
      }
    },
  })
}

/**
 * React hook to apply promotion codes to the cart.
 * Automatically invalidates cart cache on success.
 * 
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const applyPromoCodeMutation = useApplyPromoCode();
 * 
 * // Usage in component
 * function PromoCodeForm() {
 *   const [code, setCode] = useState('');
 *   const applyPromoCodeMutation = useApplyPromoCode();
 *   
 *   const handleApplyCode = (e: FormEvent) => {
 *     e.preventDefault();
 *     
 *     applyPromoCodeMutation.mutate(
 *       { code },
 *       {
 *         onSuccess: (cart) => {
 *           console.log('Promo code applied:', cart);
 *           setCode('');
 *           // Show success message
 *         },
 *         onError: (error) => {
 *           console.error('Failed to apply promo code:', error);
 *           // Show error message
 *         }
 *       }
 *     );
 *   };
 *   
 *   return (
 *     <form onSubmit={handleApplyCode}>
 *       <input 
 *         type="text"
 *         value={code}
 *         onChange={(e) => setCode(e.target.value)}
 *         placeholder="Enter promo code"
 *         disabled={applyPromoCodeMutation.isPending}
 *       />
 *       <button type="submit" disabled={applyPromoCodeMutation.isPending}>
 *         {applyPromoCodeMutation.isPending ? 'Applying...' : 'Apply'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export const useApplyPromoCode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: applyPromoCode,
    onSuccess: () => {
      // Update the cache with the fresh data from the server
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate })
    },
  })
}

/**
 * React hook to remove promotion codes from the cart.
 * Automatically invalidates cart cache on success.
 * 
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const removePromoCodeMutation = useRemovePromoCode();
 * 
 * // Usage in component
 * function AppliedPromoCode({ promoCode }) {
 *   const removePromoCodeMutation = useRemovePromoCode();
 *   
 *   const handleRemoveCode = () => {
 *     removePromoCodeMutation.mutate(
 *       { code: promoCode.code },
 *       {
 *         onSuccess: (cart) => {
 *           console.log('Promo code removed:', cart);
 *           // Show success message
 *         },
 *         onError: (error) => {
 *           console.error('Failed to remove promo code:', error);
 *           // Show error message
 *         }
 *       }
 *     );
 *   };
 *   
 *   return (
 *     <div>
 *       <span>{promoCode.code} - {promoCode.amount} off</span>
 *       <button 
 *         onClick={handleRemoveCode}
 *         disabled={removePromoCodeMutation.isPending}
 *       >
 *         {removePromoCodeMutation.isPending ? 'Removing...' : 'Remove'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useRemovePromoCode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removePromoCode,
    onSuccess: () => {
      // Update the cache with the fresh data from the server
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate })
    },
  })
}