import { useCart, useCreateCart } from "@/lib/hooks/dynamic/use-cart";
import { Link, useLoaderData } from "@tanstack/react-router";
import CartDetailsLoading from "@/components/cart/cart-details-loading";
import { lazy, Suspense } from "react";

const CartItem = lazy(() => import("@/components/cart/cart-item"));
const CartSummary = lazy(() => import("@/components/cart/cart-summary"));

const Cart = () => {
  const { region, countryCode } = useLoaderData({
    from: "/$countryCode/cart"
  });
  const { data: cart, isLoading: cartLoading } = useCart();
  const createCartMutation = useCreateCart();

  // Auto-create cart if none exists
  if (!cart && !cartLoading && !createCartMutation.isPending) {
    createCartMutation.mutate(region.id);
  }

  const cartItems = cart?.items || [];

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
          <div className="text-center py-16">
            <h2 className="text-lg font-medium text-ui-fg-base mb-2">
              Your cart is empty
            </h2>
            <p className="text-ui-fg-muted mb-8">Start by adding some products</p>
            <Link
              to={`/${countryCode}/store` as any}
              className="bg-ui-fg-base text-ui-fg-on-color px-6 py-3 rounded txt-small hover:bg-ui-fg-subtle transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  <CartItem item={item} cart={cart!} region={region} />
                  {index < cartItems.length - 1 && (
                    <hr className="border-ui-border-base mt-6" />
                  )}
                </div>
              ))}
            </div>

            {cart && (
              <div className="border-t border-ui-border-base pt-8">
                <CartSummary cart={cart} region={region} countryCode={countryCode} />
              </div>
            )}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default Cart;
