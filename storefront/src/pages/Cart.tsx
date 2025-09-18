import CartItem from "@/components/cart-item";
import CartSummary from "@/components/cart-summary";
import { useCart, useCreateCart } from "@/lib/hooks/use-cart";
import { Link, useLoaderData } from "@tanstack/react-router";
import { useRegions } from "@/lib/hooks/use-region";
import { Loading } from "@/components/common";

const Cart = () => {
  const { region } = useLoaderData({
    from: "/$countryCode/cart"
  });
  const { data: cart, isLoading: cartLoading } = useCart();
  const createCart = useCreateCart();

  // Auto-create cart if none exists and we have a region
  if (!cart && !cartLoading && region && !createCart.isPending) {
    createCart.mutate(region.id);
  }

  if (cartLoading || !cart) {
    // TODO replace with loading skeleton
    return (
      <Loading />
    );
  }

  const cartItems = cart.items || [];

  return (
    <div className="content-container py-12 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-ui-fg-base">Cart</h1>
        <Link
          to="/store"
          className="text-ui-fg-muted hover:text-ui-fg-base txt-small underline"
        >
          Continue shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-lg font-medium text-ui-fg-base mb-2">
            Your cart is empty
          </h2>
          <p className="text-ui-fg-muted mb-8">Start by adding some products</p>
          <Link
            to="/store"
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
                <CartItem item={item} cart={cart} region={defaultRegion} />
                {index < cartItems.length - 1 && (
                  <hr className="border-ui-border-base mt-6" />
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-ui-border-base pt-8">
            <CartSummary cart={cart} region={defaultRegion} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
