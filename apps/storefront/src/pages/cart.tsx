import CartDetailsLoading from "@/components/cart/cart-details-loading";
import { Button } from "@/components/common/button";
import { useCart, useCreateCart } from "@/lib/hooks/dynamic/use-cart";
import { sortCartItems } from "@/lib/utils/cart/sort-cart-items";
import { Link, useLoaderData } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const CartItem = lazy(() => import("@/components/cart/cart-line-item"));
const CartSummary = lazy(() => import("@/components/cart/cart-summary"));
const CartEmpty = lazy(() => import("@/components/cart/cart-empty"));
const CartPromo = lazy(() => import("@/components/cart/cart-promo"));

const DEFAULT_CART_FIELDS =
  "id, *items, total, currency_code, subtotal, shipping_total, discount_total, tax_total, *promotions";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for shopping cart pages in the storefront
 * - Cart pages: display and manage customer cart contents
 * - Checkout flow: cart review before proceeding to checkout
 * - Mobile commerce: mobile-optimized cart experience
 * - Cart abandonment: cart recovery and re-engagement
 *
 * ECOMMERCE CONTEXT:
 * - Critical for cart management and user experience
 * - Essential for checkout flow and order processing
 * - Important for cart abandonment recovery
 * - Required for inventory management and stock checking
 * - Used in promotional campaigns and discounts
 * - Critical for mobile commerce experience
 *
 * PAGE LAYOUT:
 * - Two-column responsive layout
 * - Left: Cart items with quantity controls and remove options
 * - Right: Cart summary with totals, promotions, and checkout button
 * - Empty state: encouraging message to continue shopping
 *
 * KEY FEATURES:
 * - Cart item management (quantity, remove)
 * - Price calculation and totals
 * - Promotional code application
 * - Shipping and tax calculation
 * - Checkout button and flow initiation
 * - Continue shopping functionality
 * - Responsive design for mobile/desktop
 *
 * CART FUNCTIONALITY:
 * - Auto-create cart if none exists
 * - Sort cart items for consistent display
 * - Real-time price updates
 * - Promotional code handling
 * - Stock validation
 *
 * COMMON PATTERNS:
 * - Shopping cart with multiple items
 * - Empty cart state with recommendations
 * - Mobile cart optimization
 * - Cart abandonment recovery
 * - Promotional cart experiences
 *
 * EXAMPLES:
 * - Full shopping cart with multiple items
 * - Empty cart with product recommendations
 * - Mobile-optimized cart experience
 * - Cart with promotional discounts
 */

const Cart = () => {
  const { region, countryCode } = useLoaderData({
    from: "/$countryCode/cart",
  });
  const { data: cart, isLoading: cartLoading } = useCart({
    fields: DEFAULT_CART_FIELDS,
  });
  const createCartMutation = useCreateCart();

  // Auto-create cart if none exists
  if (!cart && !cartLoading && !createCartMutation.isPending) {
    createCartMutation.mutate({ region_id: region.id });
  }

  const cartItems = sortCartItems(cart?.items || []);

  return (
    <div className="content-container py-12">
      {cartLoading ? (
        <CartDetailsLoading />
      ) : cartItems.length === 0 ? (
        <CartEmpty />
      ) : (
        <Suspense fallback={<CartDetailsLoading />}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="space-y-6 w-full md:w-2/3">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-primary-text !text-xlarge">Cart</h1>
                {cartItems.length > 0 && (
                  <Link
                    to={`/${countryCode}/store` as any}
                    className="text-secondary-text hover:text-secondary-text-hover text-sm underline"
                  >
                    Continue shopping
                  </Link>
                )}
              </div>
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  <CartItem
                    item={item}
                    cart={cart!}
                    fields={DEFAULT_CART_FIELDS}
                  />
                  {index < cartItems.length - 1 && (
                    <hr className="bg-primary-border mt-6" />
                  )}
                </div>
              ))}
            </div>

            {cart && (
              <div className="flex flex-col gap-y-8 w-full md:w-1/3">
                <div>
                  <h2 className="text-primary-text text-xlarge">
                    Cart Summary
                  </h2>
                </div>

                <div className="flex flex-col gap-y-4">
                  <CartSummary cart={cart} />

                  <CartPromo cart={cart} />
                </div>

                <Link to={`/${countryCode}/checkout` as any}>
                  <Button className="w-full">Checkout</Button>
                </Link>
              </div>
            )}
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default Cart;
