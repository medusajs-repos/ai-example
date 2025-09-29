import { HttpTypes } from "@medusajs/types"

export type ProductSortOptions =
  | "price_asc"
  | "price_desc"
  | "created_at";

/**
 * Sorts an array of products based on the specified sorting option.
 * Uses the first variant's calculated price for price-based sorting.
 * 
 * @param params - Parameters object
 * @param params.products - Array of products to sort
 * @param params.sortBy - Sorting criteria (price ascending, price descending, or creation date)
 * @returns Sorted array of products
 * 
 * @example
 * ```typescript
 * // Sort by price ascending
 * const sortedProducts = sortProducts({ 
 *   products, 
 *   sortBy: "price_asc" 
 * });
 * 
 * // Sort by price descending
 * const expensiveFirst = sortProducts({ 
 *   products, 
 *   sortBy: "price_desc" 
 * });
 * 
 * // Sort by creation date (default server order)
 * const newestFirst = sortProducts({ 
 *   products, 
 *   sortBy: "created_at" 
 * });
 * ```
 */
export default function sortProducts ({
  products,
  sortBy,
}: {
  products: HttpTypes.StoreProduct[];
  sortBy: ProductSortOptions;
}): HttpTypes.StoreProduct[] {
  const sorted = [...products]

  switch (sortBy) {
    case "price_asc":
      return sorted.sort((a, b) => {
        const aPrice =
          a.variants?.[0]?.calculated_price?.calculated_amount ||
          0
        const bPrice =
          b.variants?.[0]?.calculated_price?.calculated_amount ||
          0
        return aPrice - bPrice
      })
    case "price_desc":
      return sorted.sort((a, b) => {
        const aPrice =
          a.variants?.[0]?.calculated_price?.calculated_amount ||
          0
        const bPrice =
          b.variants?.[0]?.calculated_price?.calculated_amount ||
          0
        return bPrice - aPrice
      })
    case "created_at":
    default:
      // They're sorted by created_at in the server
      return sorted
  }
}