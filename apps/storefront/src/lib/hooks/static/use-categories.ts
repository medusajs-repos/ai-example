import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/utils/common/query-keys"
import { listCategories } from "@/lib/data/categories"
import { HttpTypes } from "@medusajs/types"

/**
 * React hook for fetching product categories.
 * Uses Tanstack Query for caching and automatic refetching.
 * 
 * @param fields - Optional fields to include in the category response
 * @param queryParams - Optional query parameters for filtering and sorting
 * @returns Tanstack Query result object with categories array, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data: categories, isLoading, error } = useCategories();
 * 
 * // With specific fields
 * const { data: categories } = useCategories({
 *   fields: 'name,handle'
 * });
 * 
 * // With query parameters
 * const { data: categories } = useCategories({
 *   queryParams: {
 *     limit: 10,
 *     order: 'name'
 *   }
 * });
 * 
 * // In a component that needs categories
 * function CategoryList() {
 *   const { data: categories, isLoading } = useCategories();
 *   
 *   if (isLoading) return <div>Loading categories...</div>;
 *   
 *   return (
 *     <div>
 *       {categories?.map(category => (
 *         <div key={category.id}>
 *           {category.name}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useCategories = ({
  fields,
  queryParams,
  enabled = true,
}: {
  fields?: string;
  queryParams?: HttpTypes.StoreProductCategoryListParams;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: queryKeys.categories.list(fields, queryParams),
    queryFn: () => listCategories({ fields, queryParams }),
    enabled,
  })
}