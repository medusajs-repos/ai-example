import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { initiateCartPaymentSession, listCartPaymentMethods } from "@/lib/data/checkout/payment"
import { queryKeys } from "@/lib/utils/common/query-keys"

/**
 * React hook for fetching available payment methods for a region. This is typically used in the third step of the checkout process to list the payment methods, allowing the customer to select a payment method.
 * Uses Tanstack Query with no caching to ensure fresh payment method data.
 * 
 * @param region_id - The region ID to get payment methods for
 * @param fields - Optional fields to include in the response
 * @returns Tanstack Query result object with payment methods array, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data: paymentMethods, isLoading, error } = useCartPaymentMethods({
 *   region_id: 'reg_us'
 * });
 * 
 * // In a payment method selection component
 * function PaymentMethodSelector({ regionId }) {
 *   const { data: paymentMethods, isLoading, error } = useCartPaymentMethods({
 *     region_id: regionId,
 *   });
 *   
 *   if (isLoading) return <div>Loading payment methods...</div>;
 *   if (error) return <div>Error loading payment methods</div>;
 *   
 *   const enabledMethods = paymentMethods?.filter(method => method.is_enabled) || [];
 *   
 *   return (
 *     <div>
 *       <h3>Select Payment Method</h3>
 *       {enabledMethods.map(method => (
 *         <PaymentMethodCard 
 *           key={method.id} 
 *           method={method}
 *           onSelect={() => selectPaymentMethod(method.id)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * 
 * // With dynamic region selection
 * function DynamicPaymentMethods({ selectedRegion }) {
 *   const { data: paymentMethods } = useCartPaymentMethods({
 *     region_id: selectedRegion?.id,
 *   });
 *   
 *   return (
 *     <div>
 *       {paymentMethods?.map(method => (
 *         <button 
 *           key={method.id}
 *           onClick={() => initiatePayment(method.id)}
 *           disabled={!method.is_enabled}
 *         >
 *           {method.name}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useCartPaymentMethods = ({
  region_id,
  fields,
}: {
  region_id?: string;
  fields?: string;
} = {}) => {
  return useQuery({
    queryKey: queryKeys.payments.sessions(region_id),
    queryFn: () => listCartPaymentMethods({ region_id: region_id!, fields }),
    enabled: !!region_id,
    staleTime: 0,
  })
}

/**
 * React hook for initiating payment sessions with automatic cache invalidation.
 * This is typically used in the third step of the checkout process to initiate a payment session with a specific payment provider after the customer has selected a payment method.
 * Uses Tanstack Query's useMutation for handling payment session initiation.
 * 
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const initiatePaymentMutation = useInitiateCartPaymentSession();
 * 
 * // Usage in a payment flow component
 * function PaymentFlow() {
 *   const initiatePaymentMutation = useInitiateCartPaymentSession();
 *   
 *   const handlePaymentInitiation = (providerId: string) => {
 *     initiatePaymentMutation.mutate(
 *       { provider_id: providerId },
 *       {
 *         onSuccess: (paymentCollection) => {
 *           console.log('Payment session initiated:', paymentCollection.id);
 *           // Redirect to payment provider or show payment form
 *           redirectToPaymentProvider(paymentCollection);
 *         },
 *         onError: (error) => {
 *           console.error('Failed to initiate payment:', error);
 *           // Show error message
 *         }
 *       }
 *     );
 *   };
 *   
 *   return (
 *     <div>
 *       <button 
 *         onClick={() => handlePaymentInitiation('stripe')}
 *         disabled={initiatePaymentMutation.isPending}
 *       >
 *         {initiatePaymentMutation.isPending ? 'Initiating...' : 'Pay with Stripe'}
 *       </button>
 *       <button 
 *         onClick={() => handlePaymentInitiation('paypal')}
 *         disabled={initiatePaymentMutation.isPending}
 *       >
 *         {initiatePaymentMutation.isPending ? 'Initiating...' : 'Pay with PayPal'}
 *       </button>
 *     </div>
 *   );
 * }
 * 
 * // With payment method selection
 * function PaymentMethodSelector() {
 *   const initiatePaymentMutation = useInitiateCartPaymentSession();
 *   const { data: paymentMethods } = useCartPaymentMethods({ region_id: 'reg_us' });
 *   
 *   const handlePaymentMethodSelect = (methodId: string) => {
 *     initiatePaymentMutation.mutate(
 *       { provider_id: methodId },
 *       {
 *         onSuccess: (paymentCollection) => {
 *           // Handle different payment providers
 *           switch (methodId) {
 *             case 'pp_stripe_stripe':
 *               handleStripePayment(paymentCollection);
 *               break;
 *             default:
 *               handleGenericPayment(paymentCollection);
 *           }
 *         }
 *       }
 *     );
 *   };
 *   
 *   return (
 *     <div>
 *       {paymentMethods?.map(method => (
 *         <PaymentMethodButton 
 *           key={method.id}
 *           method={method}
 *           onClick={() => handlePaymentMethodSelect(method.id)}
 *           disabled={initiatePaymentMutation.isPending}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * 
 * // With validation before payment initiation
 * function SecurePaymentInitiation() {
 *   const initiatePaymentMutation = useInitiateCartPaymentSession();
 *   const { data: cart } = useCart();
 *   
 *   const canInitiatePayment = cart?.shipping_address && 
 *                             cart?.billing_address && 
 *                             cart?.shipping_methods?.length > 0;
 *   
 *   const handlePaymentInitiation = (providerId: string) => {
 *     if (!canInitiatePayment) {
 *       alert('Please complete all required steps before payment');
 *       return;
 *     }
 *     
 *     initiatePaymentMutation.mutate({ provider_id: providerId });
 *   };
 * }
 * ```
 */
export const useInitiateCartPaymentSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: initiateCartPaymentSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate })
    },
  })
}