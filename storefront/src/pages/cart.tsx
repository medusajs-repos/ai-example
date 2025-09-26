import { useCart, useCreateCart } from "@/lib/hooks/dynamic/use-cart"
import { Link, useLoaderData } from "@tanstack/react-router"
import CartDetailsLoading from "@/components/cart/cart-details-loading"
import { lazy, Suspense } from "react"
import { Button } from "@/components/common/button"
import { sortCartItems } from "@/lib/utils/cart/sort-cart-items"

const CartItem = lazy(() => import("@/components/cart/cart-line-item"))
const CartSummary = lazy(() => import("@/components/cart/cart-summary"))
const CartEmpty = lazy(() => import("@/components/cart/cart-empty"))
const CartPromo = lazy(() => import("@/components/cart/cart-promo"))

const DEFAULT_CART_FIELDS = "id, *items, total, currency_code, subtotal, shipping_total, discount_total, tax_total, *promotions"

const Cart = () => {
  const { region, countryCode } = useLoaderData({
    from: "/$countryCode/cart"
  })
  const { data: cart, isLoading: cartLoading } = useCart({
    fields: DEFAULT_CART_FIELDS
  })
  const createCartMutation = useCreateCart()

  // Auto-create cart if none exists
  if (!cart && !cartLoading && !createCartMutation.isPending) {
    createCartMutation.mutate({ region_id: region.id })
  }

  const cartItems = sortCartItems(cart?.items || [])

  return (
    <div className="content-container py-12">
      {cartLoading ? <CartDetailsLoading /> : cartItems.length === 0 ? (
        <CartEmpty />
      ) : (
        <Suspense fallback={<CartDetailsLoading />}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="space-y-6 w-full md:w-2/3">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-primary-text !txt-xlarge">Cart</h1>
                {cartItems.length > 0 && (
                  <Link
                    to={`/${countryCode}/store` as any}
                    className="text-secondary-text hover:text-secondary-text-hover txt-small underline"
                  >
                    Continue shopping
                  </Link>
                )}
              </div>
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  <CartItem item={item} cart={cart!} fields={DEFAULT_CART_FIELDS} />
                  {index < cartItems.length - 1 && (
                    <hr className="bg-primary-border mt-6" />
                  )}
                </div>
              ))}
            </div>

            {cart && (
              <div className="flex flex-col gap-y-8 w-full md:w-1/3">
                <div>
                  <h2 className="text-primary-text txt-xlarge">Cart Summary</h2>
                </div>
                
                <div className="flex flex-col gap-y-4">
                  <CartSummary cart={cart} />

                  <CartPromo cart={cart} />
                </div>

                <Link to={`/${countryCode}/checkout` as any}>
                  <Button className="w-full">
                    Checkout
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Suspense>
      )}
    </div>
  )
}

export default Cart
