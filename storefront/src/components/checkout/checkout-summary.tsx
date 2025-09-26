import { HttpTypes } from "@medusajs/types"
import { lazy, Suspense } from "react"
import Loading from "@/components/common/loading"

const CartSummary = lazy(() => import("@/components/cart/cart-summary"))
const CartLineItem = lazy(() => import("@/components/cart/cart-line-item"))
const CartPromo = lazy(() => import("@/components/cart/cart-promo"))

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for checkout summary sections in the storefront
 * - Checkout pages: display order summary during checkout flow
 * - Order review: show cart contents before payment
 * - Mobile checkout: compact order summary for mobile
 * - Guest checkout: order summary for non-registered users
 * - Order confirmation: display purchased items
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for checkout flow and order processing
 * - Essential for order review and confirmation
 * - Important for cart abandonment recovery
 * - Required for price transparency and trust
 * - Used in mobile commerce optimization
 * - Important for conversion optimization
 * 
 * SUMMARY FEATURES:
 * - Cart items display with quantities
 * - Price breakdown (subtotal, tax, shipping, total)
 * - Promotional code application
 * - Sticky positioning for easy access
 * - Responsive design for mobile/desktop
 * - Loading states for dynamic content
 * 
 * LAYOUT STRUCTURE:
 * - Cart items list with product details
 * - Price summary with totals
 * - Promotional code section
 * - Sticky positioning for checkout flow
 * 
 * COMMON PATTERNS:
 * - Checkout order summary
 * - Mobile checkout optimization
 * - Guest checkout summary
 * - Order confirmation display
 * - Cart abandonment recovery
 * 
 * EXAMPLES:
 * - <CheckoutSummary cart={cart} />
 * - Checkout page with order summary
 * - Mobile checkout with compact summary
 * - Order confirmation with item details
 */

interface CheckoutSummaryProps {
  cart: HttpTypes.StoreCart;
}

const CheckoutSummary = ({ cart }: CheckoutSummaryProps) => {
  return (
    <div className="h-fit sticky lg:top-20">
      <div className="flex flex-col gap-8">
        <Suspense fallback={<Loading />}>
          <div className="space-y-4">
            {cart.items?.map((item) => (
              <CartLineItem key={item.id} item={item} cart={cart} type="display" className="first:pt-0" />
            ))}
          </div>
        </Suspense>

        <Suspense fallback={<Loading />}>
          <CartSummary cart={cart} />
        </Suspense>

        <Suspense fallback={<Loading />}>
          <CartPromo cart={cart} />
        </Suspense>
      </div>
    </div>
  )
}

export default CheckoutSummary
