import ProductSort from "@/components/product/product-sort"
import { type ProductSortOptions } from "@/lib/utils/product/sort-products"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for product listing refinement in the storefront
 * - Product listings: provide sorting and filtering options
 * - Search results: refine search results with sorting
 * - Category pages: refine products within categories
 * - Mobile commerce: mobile-optimized product refinement
 * - Product discovery: help users find and organize products
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for product discovery and browsing
 * - Essential for user experience and product finding
 * - Important for conversion optimization and sales
 * - Required for large product catalogs
 * - Used in product recommendation systems
 * - Important for mobile commerce experience
 * 
 * REFINEMENT FEATURES:
 * - Product sorting and organization
 * - Filtering and refinement options
 * - Responsive design for mobile/desktop
 * - Professional refinement presentation
 * - Easy refinement option switching
 * - Clear refinement option labeling
 * 
 * REFINEMENT OPTIONS:
 * - Sorting: price, popularity, newest, etc.
 * - Filtering: category, brand, price range, etc.
 * - Organization: grid view, list view, etc.
 * - Display: number of products per page
 * 
 * COMMON PATTERNS:
 * - Product listing refinement
 * - Search result refinement
 * - Mobile product refinement
 * - Category product refinement
 * - Product discovery refinement
 * 
 * EXAMPLES:
 * - <ProductListRefinement sortBy={currentSort} setQueryParams={handleSortChange} />
 * - Product listing with refinement
 * - Mobile product refinement
 * - Search result refinement
 */

type ProductListRefinementProps = {
  sortBy: ProductSortOptions
  setQueryParams: (name: string, value: ProductSortOptions) => void
  "data-testid"?: string
}

const ProductListRefinement = ({
  sortBy,
  setQueryParams,
  "data-testid": dataTestId,
}: ProductListRefinementProps) => {
  return (
    <div className="flex sm:flex-col gap-12 py-4 mb-8 sm:px-0 pl-6 sm:min-w-[250px] sm:ml-[1.675rem]">
      <ProductSort
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
    </div>
  )
}

export default ProductListRefinement