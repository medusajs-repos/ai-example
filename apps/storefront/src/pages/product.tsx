import { lazy, Suspense } from "react"
import { useLoaderData } from "@tanstack/react-router"
import Loading from "@/components/common/loading"
import ProductDetailsLoading from "@/components/product/product-details-loading"
import ErrorBoundary from "@/components/common/error-boundary"
import ProductInfo from "@/components/product/product-info"
import ProductTabs from "@/components/product/product-tabs"
import ProductActions from "@/components/product/product-actions"
import ImageGallery from "@/components/common/image-gallery"

// Dynamic imports for below-the-fold components only
const RelatedProducts = lazy(() => import("@/components/product/related-products"))

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for individual product detail pages in the storefront
 * - Product pages: detailed product information and purchase flow
 * - SEO pages: optimized product pages for search engines
 * - Marketing pages: product-specific landing pages
 * - Mobile commerce: responsive product browsing
 * - Social sharing: product pages for social media sharing
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for product conversion and sales
 * - Essential for SEO and organic traffic
 * - Important for product information and specifications
 * - Required for variant selection and customization
 * - Used in recommendation systems and cross-selling
 * - Critical for mobile commerce experience
 * 
 * PAGE LAYOUT:
 * - Three-column responsive layout
 * - Left: Product info and details tabs
 * - Center: Image gallery with zoom functionality
 * - Right: Product actions and add-to-cart
 * - Bottom: Related products for cross-selling
 * 
 * KEY FEATURES:
 * - Product image gallery with zoom
 * - Variant selection and customization
 * - Add to cart functionality
 * - Product information and specifications
 * - Related products recommendations
 * - Error handling and loading states
 * - Performance optimization with lazy loading
 * 
 * PERFORMANCE OPTIMIZATION:
 * - Lazy loading for heavy components
 * - Suspense boundaries for better UX
 * - Error boundaries for graceful failures
 * - Optimized image loading
 * 
 * COMMON PATTERNS:
 * - Product detail pages with variants
 * - Mobile-optimized product browsing
 * - SEO-friendly product pages
 * - Social commerce integration
 * - Personalization and recommendations
 * 
 * EXAMPLES:
 * - Product page with multiple variants
 * - Mobile product browsing experience
 * - SEO-optimized product pages
 * - Social commerce product sharing
 */

const ProductDetails = () => {
  const { product, region } = useLoaderData({
    from: "/$countryCode/products/$handle"
  })

  return (
    <Suspense fallback={<ProductDetailsLoading />}>
      <ErrorBoundary>
        {/* Original three-column layout */}
        <div
          className="content-container flex flex-col lg:flex-row gap-6 py-6 relative"
          data-testid="product-container"
        >
          {/* Left Column - Product Info & Details */}
          <div className="flex-1 flex flex-col gap-y-6">
            <ErrorBoundary fallback={<div className="text-secondary-text">Failed to load product info</div>}>
              <ProductInfo product={product} />
            </ErrorBoundary>
            <ErrorBoundary fallback={<div className="text-secondary-text">Failed to load product details</div>}>
              <ProductTabs product={product} />
            </ErrorBoundary>
          </div>

          {/* Center Column - Image Gallery */}
          <div className="flex-[2]">
            <ErrorBoundary
              fallback={
                <div className="aspect-[29/34] w-full bg-secondary-bg flex items-center justify-center">
                  <span className="text-secondary-text">Failed to load images</span>
                </div>
              }
            >
              <ImageGallery images={product?.images || []} />
            </ErrorBoundary>
          </div>

          {/* Right Column - Actions & CTA */}
          <div className="flex-1 flex flex-col gap-y-6">
            <ErrorBoundary
              fallback={
                <div className="text-secondary-text">
                  Failed to load product actions
                </div>
              }
            >
              <ProductActions product={product} region={region} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Related Products Section */}
        <div
          className="content-container my-16 sm:my-32"
          data-testid="related-products-container"
        >
          <ErrorBoundary
            fallback={
              <div className="text-center text-secondary-text">
                Failed to load related products
              </div>
            }
          >
            <RelatedProducts product={product} region={region} />
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    </Suspense>
  )
}

export default ProductDetails
