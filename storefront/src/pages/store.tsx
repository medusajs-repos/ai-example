import { useLoaderData } from "@tanstack/react-router"
import ProductListing from "@/components/product/product-listing"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for product catalog pages in the storefront
 * - Store pages: main product catalog and browsing
 * - Mobile commerce: mobile-optimized product browsing
 * - SEO pages: optimized product catalog for search engines
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for product discovery and browsing
 * - Essential for conversion optimization and sales
 * - Important for SEO and organic traffic
 * - Used in marketing campaigns and promotions
 * - Important for mobile commerce experience
 * 
 * STORE FEATURES:
 * - Product listing with grid layout
 * - Filtering and sorting options
 * - Search functionality
 * - Pagination for large catalogs
 * - Responsive design for mobile/desktop
 * - Performance optimization for large catalogs
 * 
 * LAYOUT STRUCTURE:
 * - Product grid with filtering sidebar
 * - Search and sort controls
 * - Pagination navigation
 * - Responsive grid layout
 * 
 * COMMON PATTERNS:
 * - Product catalog browsing
 * - Search result pages
 * - Mobile product browsing
 * - SEO-optimized product pages
 * 
 * EXAMPLES:
 * - Main store catalog page
 * - Search result pages
 * - Mobile-optimized store browsing
 * - SEO-optimized product catalogs
 */

const Store = () => {
  const { region: defaultRegion } = useLoaderData({
    from: "/$countryCode/store"
  })

  return <ProductListing region={defaultRegion} title="All Products" />
}

export default Store
