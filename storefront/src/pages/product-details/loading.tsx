import { Loading } from "@/components/common";

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
          <div className="aspect-[29/34] w-full bg-ui-bg-subtle rounded-lg flex items-center justify-center">
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
      <div className="my-16 small:my-32">
        <div className="space-y-6">
          <Loading rows={1} height="h-8" width="w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-square bg-ui-bg-subtle rounded-lg flex items-center justify-center">
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
  );
};

export default ProductDetailsLoading;
