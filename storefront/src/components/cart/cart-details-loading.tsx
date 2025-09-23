import Loading from "@/components/common/loading"

/**
 * Loading component that matches the cart page layout
 * Shows skeleton placeholders for all sections of the cart page
 */
const CartDetailsLoading = () => {
  return (
    <div className="content-container py-12 max-w-4xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <Loading rows={1} height="h-8" width="w-16" />
        <Loading rows={1} height="h-4" width="w-32" />
      </div>

      {/* Cart Items Section */}
      <div className="space-y-8">
        <div className="space-y-6">
          {/* Cart Item 1 */}
          <div className="space-y-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-ui-bg-subtle rounded-lg flex items-center justify-center">
                <Loading rows={1} height="h-6" width="w-6" />
              </div>
              
              {/* Product Details */}
              <div className="flex-1 space-y-2">
                <Loading rows={1} height="h-5" width="w-3/4" />
                <Loading rows={1} height="h-4" width="w-1/2" />
                <Loading rows={1} height="h-4" width="w-1/4" />
              </div>
              
              {/* Quantity and Price */}
              <div className="flex flex-col items-end space-y-2">
                <Loading rows={1} height="h-8" width="w-20" />
                <Loading rows={1} height="h-5" width="w-16" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-ui-border-base" />

          {/* Cart Item 2 */}
          <div className="space-y-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-ui-bg-subtle rounded-lg flex items-center justify-center">
                <Loading rows={1} height="h-6" width="w-6" />
              </div>
              
              {/* Product Details */}
              <div className="flex-1 space-y-2">
                <Loading rows={1} height="h-5" width="w-2/3" />
                <Loading rows={1} height="h-4" width="w-1/3" />
                <Loading rows={1} height="h-4" width="w-1/4" />
              </div>
              
              {/* Quantity and Price */}
              <div className="flex flex-col items-end space-y-2">
                <Loading rows={1} height="h-8" width="w-20" />
                <Loading rows={1} height="h-5" width="w-16" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-ui-border-base" />

          {/* Cart Item 3 */}
          <div className="space-y-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-ui-bg-subtle rounded-lg flex items-center justify-center">
                <Loading rows={1} height="h-6" width="w-6" />
              </div>
              
              {/* Product Details */}
              <div className="flex-1 space-y-2">
                <Loading rows={1} height="h-5" width="w-4/5" />
                <Loading rows={1} height="h-4" width="w-2/5" />
                <Loading rows={1} height="h-4" width="w-1/3" />
              </div>
              
              {/* Quantity and Price */}
              <div className="flex flex-col items-end space-y-2">
                <Loading rows={1} height="h-8" width="w-20" />
                <Loading rows={1} height="h-5" width="w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Cart Summary Section */}
        <div className="border-t border-ui-border-base pt-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Loading rows={1} height="h-4" width="w-20" />
              <Loading rows={1} height="h-4" width="w-16" />
            </div>
            <div className="flex justify-between">
              <Loading rows={1} height="h-4" width="w-24" />
              <Loading rows={1} height="h-4" width="w-16" />
            </div>
            <div className="flex justify-between">
              <Loading rows={1} height="h-4" width="w-16" />
              <Loading rows={1} height="h-4" width="w-16" />
            </div>
            <hr className="border-ui-border-base" />
            <div className="flex justify-between">
              <Loading rows={1} height="h-6" width="w-20" />
              <Loading rows={1} height="h-6" width="w-20" />
            </div>
            <Loading rows={1} height="h-12" width="w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartDetailsLoading
