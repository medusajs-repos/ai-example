import { HttpTypes } from "@medusajs/types"
import { lazy, Suspense, useMemo } from "react"
import { useProducts } from "@/lib/hooks/static/use-products"
import Loading from "@/components/common/loading"
import ProductCard from "@/components/product/product-card"
import ProductListingLoading from "@/components/product/product-listing-loading"

const Pagination = lazy(() => import("@/components/common/pagination"))

const PRODUCTS_PER_PAGE = 12

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for product listing pages in the storefront
 * - Product catalog pages: main product catalog and browsing
 * - Category pages: product listings by category
 * - Search results: filtered product listings
 * - Mobile commerce: mobile-optimized product browsing
 * - SEO pages: optimized product catalog for search engines
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for product discovery and browsing
 * - Essential for conversion optimization and sales
 * - Important for SEO and organic traffic
 * - Required for product catalog management
 * - Used in marketing campaigns and promotions
 * - Important for mobile commerce experience
 * 
 * LISTING FEATURES:
 * - Product grid with responsive layout
 * - Pagination for large product catalogs
 * - Loading states for better user experience
 * - Empty state handling for no products
 * - Product count display and information
 * - Performance optimization with lazy loading
 * 
 * PRODUCT DISPLAY:
 * - Responsive grid layout (1-4 columns)
 * - Product cards with images, titles, and prices
 * - Pagination for navigation through products
 * - Loading states during data fetching
 * - Empty state when no products available
 * 
 * COMMON PATTERNS:
 * - Product catalog browsing
 * - Category-based product listings
 * - Search result pages
 * - Mobile product browsing
 * - SEO-optimized product pages
 * 
 * EXAMPLES:
 * - <ProductListing region={region} title="All Products" />
 * - <ProductListing region={region} title="Electronics" queryParams={{category_id: "electronics"}} />
 * - <ProductListing region={region} title="Search Results" queryParams={{q: "laptop"}} />
 */

type ProductListProps = {
  region: HttpTypes.StoreRegion
  title: string
  queryParams?: Record<string, string>
}

const ProductListing = ({ region, title, queryParams }: ProductListProps) => {   
  const { 
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    hasPreviousPage,
  } = useProducts({
    region_id: region.id,
    query_params: {
      ...queryParams,
      limit: PRODUCTS_PER_PAGE,
    },
  })

  const handlePageChange = (page: number) => {
    if (page > (data?.pages.length || 0)) {
      fetchNextPage()
    } else if (page < (data?.pages.length || 0)) {
      fetchPreviousPage()
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.products) || []
  }, [data?.pages])

  if (isFetching) {
    return <ProductListingLoading />
  }

  return (
    <div
      className="content-container flex flex-col lg:flex-row gap-6 py-6"
      data-testid="products-container"
    >
      <div className="flex-1">
        <div className="mb-8">
          <h1
            data-testid="products-page-title"
            className="txt-xlarge-plus text-primary-text mb-1"
          >
            {title}
          </h1>
          <p className="text-secondary-text">{products.length} items</p>
        </div>
        {products.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="txt-xlarge text-secondary-text">No products yet</div>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-6 gap-y-8"
              data-testid="products-list"
            >
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {(hasNextPage || hasPreviousPage) && (
              <Suspense fallback={<Loading />}>
                <Pagination
                  data-testid="products-pagination"
                  page={products.length || 1}
                  totalPages={products.length || 1}
                  onPageChange={handlePageChange}
                />
              </Suspense>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductListing