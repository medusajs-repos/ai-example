import Loading from "@/components/common/loading"

/**
 * Loading component that matches the cart page layout
 * Shows skeleton placeholders for all sections of the cart page
 */
const CartDetailsLoading = () => {
  return (
    <div className="content-container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Cart Items */}
        <div className="space-y-6 w-full md:w-2/3">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <Loading rows={1} height="h-8" width="w-16" />
            <Loading rows={1} height="h-4" width="w-32" />
          </div>

          {/* Cart Items */}
          <div className="space-y-6">
            {/* Cart Item 1 */}
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-secondary-bg flex items-center justify-center">
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

            {/* Divider */}
            <hr className="bg-primary-border" />

            {/* Cart Item 2 */}
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-secondary-bg flex items-center justify-center">
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

            {/* Divider */}
            <hr className="bg-primary-border" />

            {/* Cart Item 3 */}
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-secondary-bg flex items-center justify-center">
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

        {/* Right side - Cart Summary */}
        <div className="flex flex-col gap-y-8 w-full md:w-1/3">
          {/* Cart Summary Header */}
          <div>
            <Loading rows={1} height="h-8" width="w-32" />
          </div>
          
          {/* Cart Summary Content */}
          <div className="flex flex-col gap-y-4">
            {/* Summary lines */}
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
              <hr className="bg-primary-border" />
              <div className="flex justify-between">
                <Loading rows={1} height="h-6" width="w-20" />
                <Loading rows={1} height="h-6" width="w-20" />
              </div>
            </div>

            {/* Promo section */}
            <div className="space-y-2">
              <Loading rows={1} height="h-4" width="w-24" />
            </div>
          </div>

          {/* Checkout Button */}
          <Loading rows={1} height="h-12" width="w-full" />
        </div>
      </div>
    </div>
  )
}

export default CartDetailsLoading
