import { useQuery } from "@tanstack/react-query"
import { retrieveProduct } from "@/lib/data/products"

/**
 * React hook for fetching a single product with no caching (always fresh data).
 * This is useful for product pages where you need real-time inventory and pricing data.
 * Uses Tanstack Query with staleTime: 0 to disable caching.
 * 
 * @param handle - The product handle (slug) to fetch
 * @param region_id - The region ID to get region-specific pricing and availability (required)
 * @param fields - Optional fields to include in the response (defaults to comprehensive product data)
 * @returns React Query result object with product data, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage for product page
 * const { data: product, isLoading, error } = useProductDynamic({
 *   handle: 'awesome-t-shirt',
 *   region_id: 'reg_us'
 * });
 * 
 * // With custom fields
 * // if you pass custom fields, you will not receive the price and inventory data
 * const { data: product } = useProductDynamic({
 *   handle: 'awesome-t-shirt',
 *   region_id: 'reg_eu',
 *   fields: '*variants, *images, *options, *options.values'
 * });
 * 
 * // In a product page component with real-time data
 * function ProductPage({ handle, regionId }) {
 *   const { data: product, isLoading, error } = useProductDynamic({
 *     handle,
 *     region_id: regionId,
 *   });
 *   
 *   if (isLoading) return <div>Loading product...</div>;
 *   if (error) return <div>Error loading product</div>;
 *   if (!product) return <div>Product not found</div>;
 *   
 *   return (
 *     <div>
 *       <h1>{product.title}</h1>
 *       <ProductVariants product={product} />
 *       <InventoryStatus product={product} />
 *     </div>
 *   );
 * }
 * ```
 */
export const useProductDynamic = ({
  handle,
  region_id,
  fields,
}: {
  handle: string;
  region_id: string;
  fields?: string;
}) => {
  return useQuery({
    queryKey: ["product-dynamic", handle, region_id],
    queryFn: () => retrieveProduct({
      handle,
      region_id,
      fields: fields || "*variants, variants.inventory_quantity, variants.manage_inventory, variants.allow_backorder, *options, *options.values"
    }),
    staleTime: 0, // Don't cache
    enabled: !!handle && !!region_id,
  })
}