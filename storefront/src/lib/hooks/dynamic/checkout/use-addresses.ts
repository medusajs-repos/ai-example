import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { setCartAddresses } from "@/lib/data/checkout/addresses"

/**
 * React hook for setting cart addresses with automatic cache invalidation. This is typically used in the firt step of the checkout process to set the shipping and billing addresses.
 * Uses Tanstack Query's useMutation for handling address updates.
 * 
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const setAddressesMutation = useSetCartAddresses();
 * 
 * // Usage in a checkout form component
 * function AddressForm() {
 *   const setAddressesMutation = useSetCartAddresses();
 *   
 *   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
 *     e.preventDefault();
 *     const formData = new FormData(e.currentTarget);
 *     
 *     setAddressesMutation.mutate(formData, {
 *       onSuccess: (cart) => {
 *         console.log('Addresses set successfully:', cart);
 *         // Navigate to next step
 *       },
 *       onError: (error) => {
 *         console.error('Failed to set addresses:', error);
 *         // Show error message
 *       }
 *     });
 *   };
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="shipping_address.first_name" placeholder="First Name" required />
 *       <input name="shipping_address.last_name" placeholder="Last Name" required />
 *       <input name="shipping_address.address_1" placeholder="Address" required />
 *       <input name="shipping_address.city" placeholder="City" required />
 *       <input name="shipping_address.postal_code" placeholder="Postal Code" required />
 *       <select name="shipping_address.country_code" required>
 *         <option value="us">United States</option>
 *         <option value="gb">United Kingdom</option>
 *       </select>
 *       <input name="email" type="email" placeholder="Email" required />
 *       <button type="submit" disabled={setAddressesMutation.isPending}>
 *         {setAddressesMutation.isPending ? 'Setting Addresses...' : 'Continue'}
 *       </button>
 *     </form>
 *   );
 * }
 * 
 * // With separate billing address
 * function CheckoutAddressStep() {
 *   const setAddressesMutation = useSetCartAddresses();
 *   const [useSameAddress, setUseSameAddress] = useState(true);
 *   
 *   const handleSubmit = (formData: FormData) => {
 *     if (useSameAddress) {
 *       // Copy shipping address to billing
 *       const shippingData = {
 *         first_name: formData.get('shipping_address.first_name'),
 *         last_name: formData.get('shipping_address.last_name'),
 *         address_1: formData.get('shipping_address.address_1'),
 *         city: formData.get('shipping_address.city'),
 *         postal_code: formData.get('shipping_address.postal_code'),
 *         country_code: formData.get('shipping_address.country_code'),
 *       };
 *       
 *       Object.entries(shippingData).forEach(([key, value]) => {
 *         formData.append(`billing_address.${key}`, value as string);
 *       });
 *     }
 *     
 *     setAddressesMutation.mutate(formData);
 *   };
 * }
 * ```
 */
export const useSetCartAddresses = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => setCartAddresses({ form_data: formData }),
    onSuccess: () => {
      // Update the cache with the fresh data from the server
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate })
    },
  })
}