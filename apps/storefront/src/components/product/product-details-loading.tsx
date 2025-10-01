import Loading from "@/components/common/loading"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for loading states in product detail pages in the storefront
 * - Product pages: show loading while fetching product information
 * - Product showcases: display loading during product data loading
 * - Mobile commerce: mobile-optimized product detail loading
 * - Performance optimization: improve perceived performance
 * - SEO pages: loading states for product pages
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for user experience during product loading
 * - Essential for perceived performance and engagement
 * - Important for product information loading
 * - Required for product detail page loading
 * - Used in product recommendation systems
 * - Important for mobile commerce experience
 * 
 * LOADING FEATURES:
 * - Product detail skeleton layout
 * - Product information skeleton placeholders
 * - Product image skeleton placeholders
 * - Product actions skeleton placeholders
 * - Related products skeleton placeholders
 * - Responsive design for mobile/desktop
 * 
 * SKELETON LAYOUT:
 * - Product info: title, description, price placeholders
 * - Product image: main image placeholder
 * - Product actions: add to cart, variant selection placeholders
 * - Related products: 4 product placeholders
 * - Responsive: mobile-optimized layout
 * 
 * COMMON PATTERNS:
 * - Product detail loading
 * - Mobile product loading
 * - Product showcase loading
 * - Product information loading
 * - Product page loading
 * 
 * EXAMPLES:
 * - <ProductDetailsLoading />
 * - Product detail page loading
 * - Mobile product loading
 * - Product showcase loading
 */

/**
 * Loading component that matches the product details layout
 * Shows skeleton placeholders for all sections of the product details page
 */
const ProductDetailsLoading = () => {
  return (
    <div className="content-container py-6">
      {/* Three-column layout matching product details */}
      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* Left Column - Product Info & Details */}
        <div className="flex-1 flex flex-col gap-y-6">
          {/* Product Info Section */}
          <div className="space-y-4">
            <Loading rows={1} height="h-8" width="w-3/4" />
            <Loading rows={1} height="h-6" width="w-1/2" />
            <Loading rows={2} height="h-4" width="w-full" />
            <Loading rows={1} height="h-6" width="w-1/3" />
          </div>
          
          {/* Product Details/Tabs Section */}
          <div className="space-y-4">
            <Loading rows={1} height="h-6" width="w-1/4" />
            <Loading rows={4} height="h-4" width="w-full" />
          </div>
        </div>

        {/* Center Column - Image Gallery */}
        <div className="flex-[2]">
          <div className="aspect-[29/34] w-full bg-secondary-bg flex items-center justify-center">
            <Loading rows={1} height="h-8" width="w-8" />
          </div>
        </div>

        {/* Right Column - Actions & CTA */}
        <div className="flex-1 flex flex-col gap-y-6">
          <div className="space-y-4">
            <Loading rows={1} height="h-6" width="w-2/3" />
            <Loading rows={1} height="h-12" width="w-full" />
            <Loading rows={1} height="h-10" width="w-full" />
            <Loading rows={2} height="h-4" width="w-full" />
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="my-16 sm:my-32">
        <div className="space-y-6">
          <Loading rows={1} height="h-8" width="w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-square bg-secondary-bg flex items-center justify-center">
                  <Loading rows={1} height="h-6" width="w-6" />
                </div>
                <Loading rows={1} height="h-4" width="w-3/4" />
                <Loading rows={1} height="h-4" width="w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsLoading
