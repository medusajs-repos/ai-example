import { useLoaderData } from "@tanstack/react-router"
import ProductListing from "@/components/product/product-listing"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for category product listing pages in the storefront
 * - Category pages: product listings by category
 * - Product catalog: category-based product browsing
 * - Mobile commerce: mobile-optimized category browsing
 * - SEO pages: optimized category pages for search engines
 * - Product discovery: category-based product exploration
 *
 * ECOMMERCE CONTEXT:
 * - Critical for product discovery and browsing
 * - Essential for SEO and search engine optimization
 * - Important for user experience and navigation
 * - Required for product catalog organization
 * - Used in marketing campaigns and promotions
 * - Important for mobile commerce experience
 *
 * CATEGORY PAGE FEATURES:
 * - Category-specific product listings
 * - Product grid with responsive layout
 * - Category name and information display
 * - Product filtering and sorting
 * - SEO-optimized category pages
 * - Mobile-optimized category browsing
 *
 * PAGE STRUCTURE:
 * - Category data loading and display
 * - Product listing with category filtering
 * - Responsive product grid layout
 * - Category-specific product discovery
 *
 * COMMON PATTERNS:
 * - Category product listings
 * - Mobile category browsing
 * - SEO category pages
 * - Product catalog browsing
 * - Category-based product discovery
 *
 * EXAMPLES:
 * - Category page for electronics
 * - Mobile category browsing
 * - SEO-optimized category pages
 * - Product catalog by category
 */
const Category = () => {
  const {
    category,
    region
  } = useLoaderData({
    from: "/$countryCode/categories/$handle",
  })

  const categoryDisplayName =
    category?.name ||
    "Category"

  return (
    <ProductListing 
      region={region} 
      title={categoryDisplayName} 
      queryParams={{
        category_id: category?.id,
      }}
    />
  )
}

export default Category
