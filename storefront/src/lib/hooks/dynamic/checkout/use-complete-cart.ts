import { useMutation, useQueryClient } from "@tanstack/react-query"
import { clearAllCartData, completeCartOrder } from "@/lib/data/checkout/complete"
import { queryKeys } from "@/lib/query-keys"

/**
 * React hook for completing cart orders with automatic cache cleanup. This is used in the last step of the checkout process to complete the order.
 * Uses Tanstack Query's useMutation for handling order completion.
 * Automatically clears cart data and refetches queries after successful completion.
 * 
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const completeOrderMutation = useCompleteCartOrder();
 * 
 * // Usage in a checkout completion component
 * function CheckoutComplete() {
 *   const completeOrderMutation = useCompleteCartOrder();
 *   const router = useRouter();
 *   
 *   const handleCompleteOrder = () => {
 *     completeOrderMutation.mutate(undefined, {
 *       onSuccess: (order) => {
 *         console.log('Order completed:', order.id);
 *         // Redirect to order confirmation
 *         router.push(`/order/confirmed/${order.id}`);
 *       },
 *       onError: (error) => {
 *         console.error('Failed to complete order:', error);
 *         // Show error message
 *       }
 *     });
 *   };
 *   
 *   return (
 *     <div>
 *       <h2>Complete Your Order</h2>
 *       <button 
 *         onClick={handleCompleteOrder}
 *         disabled={completeOrderMutation.isPending}
 *       >
 *         {completeOrderMutation.isPending ? 'Completing Order...' : 'Complete Order'}
 *       </button>
 *     </div>
 *   );
 * }
 * 
 * // With order validation before completion
 * function SecureCheckoutComplete() {
 *   const completeOrderMutation = useCompleteCartOrder();
 *   const { data: cart } = useCart();
 *   
 *   const canCompleteOrder = cart?.shipping_address && 
 *                           cart?.billing_address && 
 *                           cart?.shipping_methods?.length > 0;
 *   
 *   const handleCompleteOrder = () => {
 *     if (!canCompleteOrder) {
 *       alert('Please complete all required steps before placing your order');
 *       return;
 *     }
 *     
 *     completeOrderMutation.mutate();
 *   };
 *   
 *   return (
 *     <button 
 *       onClick={handleCompleteOrder}
 *       disabled={!canCompleteOrder || completeOrderMutation.isPending}
 *     >
 *       {completeOrderMutation.isPending ? 'Processing...' : 'Place Order'}
 *     </button>
 *   );
 * }
 * 
 * // With custom success handling
 * function CustomCheckoutComplete() {
 *   const completeOrderMutation = useCompleteCartOrder();
 *   
 *   const handleCompleteOrder = () => {
 *     completeOrderMutation.mutate(undefined, {
 *       onSuccess: (order) => {
 *         // Custom analytics tracking
 *         analytics.track('Order Completed', {
 *           orderId: order.id,
 *           total: order.total,
 *           currency: order.currency_code
 *         });
 *         
 *         // Custom redirect logic
 *         if (order.payment_status === 'awaiting') {
 *           router.push(`/order/payment/${order.id}`);
 *         } else {
 *           router.push(`/order/confirmed/${order.id}`);
 *         }
 *       }
 *     });
 *   };
 * }
 * ```
 */
export const useCompleteCartOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeCartOrder,
    onSuccess: async (order) => {
      // Clear all cart-related cache after successful order completion
      clearAllCartData({ query_client: queryClient })
      await queryClient.refetchQueries({ predicate: queryKeys.cart.predicate })

      return order
    },
  })
}