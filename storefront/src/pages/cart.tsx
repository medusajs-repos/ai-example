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
    <Suspense fallback={<CartDetailsLoading />}>
      <div className="content-container py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-ui-fg-base">Cart</h1>
          {cartItems.length > 0 && (
            <Link
              to={`/${countryCode}/store` as any}
              className="text-ui-fg-muted hover:text-ui-fg-base txt-small underline"
            >
              Continue shopping
            </Link>
          )}
        </div>

        {cartItems.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="space-y-8">
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  <CartItem item={item} cart={cart!} fields={DEFAULT_CART_FIELDS} />
                  {index < cartItems.length - 1 && (
                    <hr className="border-ui-border-base mt-6" />
                  )}
                </div>
              ))}
            </div>

            {cart && (
              <div className="border-t border-ui-border-base pt-8">
                <div className="max-w-sm ml-auto flex flex-col gap-y-4">
                  <CartSummary cart={cart} />

                  <CartPromo cart={cart} />

                  <Button asChild className="w-full">
                    <Link to={`/${countryCode}/checkout` as any}>
                      Checkout
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Suspense>
  )
}

export default Cart
