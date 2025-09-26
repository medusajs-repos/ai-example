import FilterRadioGroup from "@/components/common/filter-radio-group"
import { type ProductSortOptions } from "@/lib/utils/product/sort-products"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for product sorting in the storefront
 * - Product listings: sort products by various criteria
 * - Search results: sort search results by relevance
 * - Category pages: sort products within categories
 * - Mobile commerce: mobile-optimized product sorting
 * - Product discovery: help users find products
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for product discovery and browsing
 * - Essential for user experience and product finding
 * - Important for conversion optimization and sales
 * - Required for large product catalogs
 * - Used in product recommendation systems
 * - Important for mobile commerce experience
 * 
 * SORT FEATURES:
 * - Product sorting by various criteria
 * - Visual sort option selection
 * - Responsive design for mobile/desktop
 * - Clear sort option labeling
 * - Professional sort presentation
 * - Easy sort option switching
 * 
 * SORT OPTIONS:
 * - Latest Arrivals: newest products first
 * - Price: Low to High: cheapest products first
 * - Price: High to Low: most expensive products first
 * - Popularity: most popular products first
 * - Rating: highest rated products first
 * 
 * COMMON PATTERNS:
 * - Product listing sorting
 * - Search result sorting
 * - Mobile product sorting
 * - Category product sorting
 * - Product discovery sorting
 * 
 * EXAMPLES:
 * - <ProductSort sortBy={currentSort} setQueryParams={handleSortChange} />
 * - Product listing with sorting
 * - Mobile product sorting
 * - Search result sorting
 */

type SortProductsProps = {
  sortBy: ProductSortOptions
  setQueryParams: (name: string, value: ProductSortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc", 
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low", 
  },
]

const ProductSort = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: string) => {
    setQueryParams("sortBy", value as ProductSortOptions)
  }

  return (
    <FilterRadioGroup
      title="Sort by"
      items={sortOptions}
      value={sortBy}
      onChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default ProductSort