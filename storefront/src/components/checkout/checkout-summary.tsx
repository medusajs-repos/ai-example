import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { lazy, Suspense } from "react"
import Loading from "@/components/common/loading"

const CartSummary = lazy(() => import("@/components/cart/cart-summary"))
const CartLineItem = lazy(() => import("@/components/cart/cart-line-item"))
const CartPromo = lazy(() => import("@/components/cart/cart-promo"))

interface CheckoutSummaryProps {
  cart: HttpTypes.StoreCart;
}

const CheckoutSummary = ({ cart }: CheckoutSummaryProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-ui-border-base h-fit sticky top-6">
      <Heading level="h3" className="mb-6">
        Order Summary
      </Heading>
      
      <Suspense fallback={<Loading />}>
        <div className="space-y-4 mb-6">
          {cart.items?.map((item) => (
            <CartLineItem key={item.id} item={item} cart={cart} type="display" />
          ))}
        </div>
      </Suspense>

      <Suspense fallback={<Loading />}>
        <CartSummary cart={cart} />
      </Suspense>

      <hr className="my-4 border-ui-border-base" />

      <Suspense fallback={<Loading />}>
        <CartPromo cart={cart} />
      </Suspense>
    </div>
  )
}

export default CheckoutSummary
