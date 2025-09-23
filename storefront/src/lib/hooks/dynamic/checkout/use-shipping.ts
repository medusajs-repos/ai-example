import { queryKeys } from "@/lib/query-keys"
import { 
  getCartShippingOptions, 
  setCartShippingMethod 
} from "@/lib/data/checkout/shipping"
import { getCartId } from "@/lib/utils/cookies"
import { 
  useQuery, 
  useQueryClient, 
  useMutation 
} from "@tanstack/react-query"

/**
 * React hook for fetching available shipping options for the current cart.
 * This is typically used in the second step of the checkout process to list the shipping options, allowing the customer to select a shipping option.
 * Uses Tanstack Query with no caching to ensure fresh shipping data.
 * 
 * @param cart_id - Optional cart ID. If not provided, uses stored cart ID.
 * @returns Tanstack Query result object with shipping options array, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data: shippingOptions, isLoading, error } = useShippingOptions();
 * 
 * // With specific cart ID
 * const { data: options } = useShippingOptions({ cart_id: 'cart_123' });
 * 
 * // In a shipping selection component
 * function ShippingOptionsSelector() {
 *   const { data: shippingOptions, isLoading, error } = useShippingOptions();
 *   
 *   if (isLoading) return <div>Loading shipping options...</div>;
 *   if (error) return <div>Error loading shipping options</div>;
 *   
 *   const enabledOptions = shippingOptions?.filter(option => option.is_enabled) || [];
 *   
 *   return (
 *     <div>
 *       <h3>Select Shipping Method</h3>
 *       {enabledOptions.map(option => (
 *         <ShippingOptionCard 
 *           key={option.id} 
 *           option={option}
 *           onSelect={() => selectShippingOption(option.id)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useShippingOptions = ({
  cart_id,
}: {
  cart_id?: string;
} = {}) => {
  return useQuery({
    queryKey: queryKeys.shipping.options(cart_id || ""),
    queryFn: getCartShippingOptions,
    enabled: !!cart_id || !!getCartId(),
    staleTime: 0
  })
}

/**
 * React hook for setting cart shipping methods with automatic cache invalidation.
 * This is typically used in the second step of the checkout process to set the shipping method for the cart after the customer has selected a shipping option.
 * Uses Tanstack Query's useMutation for handling shipping method updates.
 * 
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const setShippingMethodMutation = useSetCartShippingMethod();
 * 
 * // Usage in a shipping selection component
 * function ShippingMethodSelector() {
 *   const setShippingMethodMutation = useSetCartShippingMethod();
 *   const { data: shippingOptions } = useShippingOptions();
 *   
 *   const handleShippingSelection = (optionId: string) => {
 *     setShippingMethodMutation.mutate(
 *       { shipping_option_id: optionId },
 *       {
 *         onSuccess: (cart) => {
 *           console.log('Shipping method set:', cart.shipping_methods);
 *           // Proceed to next step
 *         },
 *         onError: (error) => {
 *           console.error('Failed to set shipping method:', error);
 *           // Show error message
 *         }
 *       }
 *     );
 *   };
 *   
 *   return (
 *     <div>
 *       {shippingOptions?.map(option => (
 *         <button 
 *           key={option.id}
 *           onClick={() => handleShippingSelection(option.id)}
 *           disabled={setShippingMethodMutation.isPending}
 *         >
 *           {option.name}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * 
 * // With cart total updates
 * function ShippingWithTotalUpdate() {
 *   const setShippingMethodMutation = useSetCartShippingMethod();
 *   const { data: cart } = useCart();
 *   
 *   const handleShippingWithTotalUpdate = (optionId: string) => {
 *     setShippingMethodMutation.mutate(
 *       { shipping_option_id: optionId },
 *       {
 *         onSuccess: (updatedCart) => {
 *           console.log('Cart total updated:', updatedCart.total);
 *           console.log('Shipping cost:', updatedCart.shipping_total);
 *           
 *           // Update UI with new totals
 *           updateCartDisplay(updatedCart);
 *         }
 *       }
 *     );
 *   };
 *   
 *   return (
 *     <div>
 *       <div>Current Total: {cart?.total || 0}</div>
 *       <ShippingOptionsList onSelect={handleShippingWithTotalUpdate} />
 *     </div>
 *   );
 * }
 * ```
 */
export const useSetCartShippingMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: setCartShippingMethod,
    onSuccess: async (cart) => {
      // Update the cart cache
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate })
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.options(cart.id) })
    },
  })
}