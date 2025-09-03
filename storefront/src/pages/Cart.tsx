import CartItem from "@components/CartItem";
import CartSummary from "@components/CartSummary";
import { useCart, useCreateCart } from "@lib/hooks/useCart";
import { useRegions } from "@lib/hooks/useProducts";
import { Link } from "@tanstack/react-router";

const Cart = () => {
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: regions } = useRegions();
  const createCart = useCreateCart();

  const defaultRegion = regions?.[0];

  // Auto-create cart if none exists and we have a region
  if (!cart && !cartLoading && defaultRegion && !createCart.isPending) {
    createCart.mutate(defaultRegion.id);
  }

  if (cartLoading) {
    return (
      <div className="content-container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-fg-subtle">Loading cart...</div>
        </div>
      </div>
    );
  }

  if (!defaultRegion) {
    return (
      <div className="content-container py-8">
        <div className="text-center text-red-600">
          No regions available. Please check your Medusa backend connection.
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="content-container py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-fg-subtle mb-4">
            Shopping Cart
          </h1>
          <p className="text-fg-subtle mb-6">Unable to load cart</p>
          <Link
            to="/store"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-bg-subtle"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
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
