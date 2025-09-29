import { useQuery } from "@tanstack/react-query"
import { getRegion, listRegions } from "@/lib/data/regions"
import { queryKeys } from "@/lib/utils/common/query-keys"

/**
 * React hook for fetching all available regions.
 * Uses Tanstack Query for caching and automatic refetching.
 * 
 * @param fields - Optional fields to include in the region response
 * @returns Tanstack Query result object with regions array, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data: regions, isLoading, error } = useRegions();
 * 
 * // With specific fields
 * const { data: regions } = useRegions({ 
 *   fields: '*countries, *payment_providers, *fulfillment_providers'
 * });
 * 
 * // In a region selector component
 * function RegionSelector() {
 *   const { data: regions, isLoading } = useRegions({
 *     fields: '*countries, *payment_providers'
 *   });
 *   
 *   if (isLoading) return <div>Loading regions...</div>;
 *   
 *   return (
 *     <select>
 *       {regions?.regions.map(region => (
 *         <option key={region.id} value={region.id}>
 *           {region.name} ({region.currency_code})
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * 
 * // For checkout region selection
 * function CheckoutRegionSelector() {
 *   const { data: regions } = useRegions({
 *     fields: '*countries, *payment_providers, *fulfillment_providers'
 *   });
 *   
 *   return (
 *     <div>
 *       {regions?.regions.map(region => (
 *         <RegionCard 
 *           key={region.id} 
 *           region={region} 
 *           onSelect={() => setSelectedRegion(region.id)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useRegions = ({ fields }: { fields?: string } = {}) => {
  return useQuery({
    queryKey: queryKeys.regions.list(),
    queryFn: () => listRegions({ fields }),
  })
}

/**
 * React hook for fetching a specific region by country code.
 * Uses Tanstack Query for caching and automatic refetching.
 * 
 * @param country_code - The country code to find the region for (e.g., 'us', 'gb', 'de')
 * @param fields - Optional fields to include in the region response
 * @returns Tanstack Query result object with region data, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data: region, isLoading, error } = useRegion({
 *   country_code: 'us'
 * });
 * 
 * // With specific fields
 * const { data: region } = useRegion({
 *   country_code: 'gb',
 *   fields: '*countries, *payment_providers, *fulfillment_providers'
 * });
 * 
 * // In a component that needs region-specific data
 * function ProductPricing({ countryCode }) {
 *   const { data: region, isLoading } = useRegion({
 *     country_code: countryCode,
 *     fields: '*countries, *payment_providers'
 *   });
 *   
 *   if (isLoading) return <div>Loading region...</div>;
 *   if (!region) return <div>Region not found</div>;
 *   
 *   return (
 *     <div>
 *       <h3>Pricing for {region.name}</h3>
 *       <p>Currency: {region.currency_code}</p>
 *       <p>Tax Rate: {region.tax_rate}%</p>
 *     </div>
 *   );
 * }
 * 
 * // For cart creation with region
 * function CreateCartButton({ countryCode }) {
 *   const { data: region } = useRegion({ country_code: countryCode });
 *   const createCartMutation = useCreateCart();
 *   
 *   const handleCreateCart = () => {
 *     if (region) {
 *       createCartMutation.mutate({ region_id: region.id });
 *     }
 *   };
 *   
 *   return (
 *     <button 
 *       onClick={handleCreateCart}
 *       disabled={!region || createCartMutation.isPending}
 *     >
 *       Create Cart
 *     </button>
 *   );
 * }
 * ```
 */
export const useRegion = ({
  country_code,
  fields,
}: {
  country_code: string;
  fields?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.regions.detail(country_code),
    queryFn: () => getRegion({ country_code, fields }),
  })
}