import Loading from "@/components/common/loading"

/**
 * Loading component that matches the product listing layout
 * Shows skeleton placeholders for all sections of the product listing page
 */
const ProductListingLoading = () => {
  return (
    <div
      className="content-container flex flex-col lg:flex-row gap-6 py-6"
      data-testid="products-container"
    >
      {/* Center Column - Product Grid */}
      <div className="flex-1">
        {/* Header Section */}
        <div className="mb-8">
          <Loading rows={1} height="h-8" width="w-48" />
          <Loading rows={1} height="h-4" width="w-20" />
        </div>

        {/* Product Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-6 gap-y-8"
          data-testid="products-list"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="space-y-3">
              {/* Product Image */}
              <div className="aspect-square bg-secondary-bg flex items-center justify-center">
                <Loading rows={1} height="h-8" width="w-8" />
              </div>
              
              {/* Product Info */}
              <div className="space-y-2">
                <Loading rows={1} height="h-4" width="w-3/4" />
                <Loading rows={1} height="h-4" width="w-1/2" />
                <Loading rows={1} height="h-5" width="w-1/3" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Loading rows={1} height="h-8" width="w-8" />
            <Loading rows={1} height="h-8" width="w-8" />
            <Loading rows={1} height="h-8" width="w-8" />
            <Loading rows={1} height="h-8" width="w-8" />
            <Loading rows={1} height="h-8" width="w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListingLoading
