import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { listProducts, retrieveProduct } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { queryKeys } from "@/lib/query-keys"

/**
 * React hook for fetching products with infinite scroll pagination.
 * Uses Tanstack Query's useInfiniteQuery for efficient pagination.
 * 
 * @param query_params - Optional query parameters for filtering, sorting, and field selection
 * @param region_id - Optional region ID to get region-specific pricing and availability
 * @returns React Query infinite query result with pages, fetchNextPage, hasNextPage, etc.
 * 
 * @example
 * ```typescript
 * // Basic usage with infinite scroll
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 *   isLoading,
 *   error
 * } = useProducts({
 *   region_id: 'reg_us'
 * });
 * 
 * // With filtering
 * const { data, fetchNextPage, hasNextPage } = useProducts({
 *   query_params: {
 *     collection_id: ['col_123'],
 *     category_id: ['cat_456'],
 *     limit: 12,
 *     order: '-created_at'
 *   },
 *   region_id: 'reg_eu'
 * });
 * 
 * // In a component with infinite scroll
 * function ProductList() {
 *   const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage
 *   } = useProducts({ region_id: 'reg_us' });
 *   
 *   const products = data?.pages.flatMap(page => page.products) || [];
 *   
 *   return (
 *     <div>
 *       {products.map(product => (
 *         <ProductCard key={product.id} product={product} />
 *       ))}
 *       {hasNextPage && (
 *         <button 
 *           onClick={() => fetchNextPage()}
 *           disabled={isFetchingNextPage}
 *         >
 *           {isFetchingNextPage ? 'Loading...' : 'Load More'}
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useProducts = ({
  query_params,
  region_id,
}: {
  query_params?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  region_id?: string
} = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(query_params, region_id),
    queryFn: ({ pageParam }) =>
      listProducts({
        page_param: pageParam,
        query_params,
        region_id,
      }),
    getNextPageParam: (lastPage) => lastPage.next_page,
    getPreviousPageParam: (firstPage) => firstPage.next_page,
    initialPageParam: 1,
    enabled: !!region_id,
  })
}

/**
 * React hook for fetching a single product by handle.
 * Uses Tanstack Query for caching and automatic refetching.
 * 
 * @param handle - The product handle (slug) to fetch
 * @param region_id - Optional region ID to get region-specific pricing and availability
 * @param fields - Optional fields to include in the response
 * @returns Tanstack Query result object with product data, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data: product, isLoading, error } = useProduct({
 *   handle: 'awesome-t-shirt',
 *   region_id: 'reg_us'
 * });
 * 
 * // With specific fields
 * const { data: product } = useProduct({
 *   handle: 'awesome-t-shirt',
 *   region_id: 'reg_eu',
 *   fields: '*variants, *images, *options, *options.values, *collection, *tags'
 * });
 * 
 * // In a product page component
 * function ProductPage({ handle }) {
 *   const { data: product, isLoading, error } = useProduct({
 *     handle,
 *     region_id: 'reg_us',
 *     fields: '*variants, +variants.inventory_quantity, *images, *options, *options.values'
 *   });
 *   
 *   if (isLoading) return <div>Loading product...</div>;
 *   if (error) return <div>Error loading product</div>;
 *   if (!product) return <div>Product not found</div>;
 *   
 *   return (
 *     <div>
 *       <h1>{product.title}</h1>
 *       <p>{product.description}</p>
 *       <ProductVariants product={product} />
 *     </div>
 *   );
 * }
 * ```
 */
export const useProduct = ({
  handle,
  region_id,
  fields,
}: {
  handle: string;
  region_id?: string;
  fields?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.products.detail(handle, region_id),
    queryFn: () => retrieveProduct({ handle, region_id, fields }),
    enabled: !!handle && !!region_id,
  })
}

/**
 * React hook for fetching related products based on collection or tags.
 * Automatically filters out the current product from results.
 * 
 * @param product_id - The ID of the current product to exclude from results
 * @param region_id - Optional region ID to get region-specific pricing and availability
 * @param collection_id - Optional collection ID to find related products from the same collection
 * @param tags - Optional array of tag IDs to find related products with similar tags
 * @returns Tanstack Query result object with related products array, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage with collection
 * const { data: relatedProducts, isLoading } = useRelatedProducts({
 *   product_id: 'prod_123',
 *   region_id: 'reg_us',
 *   collection_id: 'col_456'
 * });
 * 
 * // With tags
 * const { data: relatedProducts } = useRelatedProducts({
 *   product_id: 'prod_123',
 *   region_id: 'reg_eu',
 *   tags: ['tag_789', 'tag_101']
 * });
 * 
 * // In a product page component
 * function ProductPage({ product }) {
 *   const { data: relatedProducts, isLoading } = useRelatedProducts({
 *     product_id: product.id,
 *     region_id: 'reg_us',
 *     collection_id: product.collection?.id,
 *     tags: product.tags?.map(tag => tag.id)
 *   });
 *   
 *   return (
 *     <div>
 *       <ProductDetails product={product} />
 *       {relatedProducts && relatedProducts.length > 0 && (
 *         <section>
 *           <h2>Related Products</h2>
 *           <div className="grid">
 *             {relatedProducts.map(relatedProduct => (
 *               <ProductCard key={relatedProduct.id} product={relatedProduct} />
 *             ))}
 *           </div>
 *         </section>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useRelatedProducts = ({
  product_id,
  region_id,
  collection_id,
  tags,
}: {
  product_id: string;
  region_id?: string;
  collection_id?: string;
  tags?: string[];
}) => {
  return useQuery({
    queryKey: queryKeys.products.related(product_id, region_id),
    queryFn: async () => {
      const params: Record<string, any> = {
        fields: "title, handle, *thumbnail, *variants",
        is_giftcard: false,
        limit: 4
      }
      
      if (collection_id) {
        params.collection_id = [collection_id]
      }
      
      if (tags && tags.length > 0) {
        params.tag_id = tags
      }
      
      const { products } = await listProducts({
        query_params: params,
        region_id,
      })

      return products.filter((product) => product.id !== product_id)
    },
    enabled: !!product_id && !!region_id,
  })
}

/**
 * React hook for fetching the latest products ordered by creation date.
 * Useful for displaying new arrivals or featured products.
 * 
 * @param limit - Number of products to fetch (defaults to 4)
 * @param region_id - Optional region ID to get region-specific pricing and availability
 * @returns Tanstack Query result object with latest products array, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data: latestProducts, isLoading } = useLatestProducts({
 *   region_id: 'reg_us'
 * });
 * 
 * // With custom limit
 * const { data: latestProducts } = useLatestProducts({
 *   limit: 8,
 *   region_id: 'reg_eu'
 * });
 * 
 * // In a homepage component
 * function HomePage() {
 *   const { data: latestProducts, isLoading } = useLatestProducts({
 *     limit: 6,
 *     region_id: 'reg_us'
 *   });
 *   
 *   return (
 *     <div>
 *       <section>
 *         <h2>New Arrivals</h2>
 *         {isLoading ? (
 *           <div>Loading latest products...</div>
 *         ) : (
 *           <div className="grid">
 *             {latestProducts?.products.map(product => (
 *               <ProductCard key={product.id} product={product} />
 *             ))}
 *           </div>
 *         )}
 *       </section>
 *     </div>
 *   );
 * }
 * ```
 */
export const useLatestProducts = ({
  limit = 4,
  region_id,
}: {
  limit?: number
  region_id?: string
} = {}) => {
  return useQuery({
    queryKey: queryKeys.products.latest(limit, region_id),
    queryFn: () =>
      listProducts({
        query_params: { 
          limit,
          order: "-created_at"
        },
        region_id,
      }),
    enabled: !!region_id,
  })
}