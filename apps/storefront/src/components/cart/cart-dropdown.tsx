import CartLineItem from "@/components/cart/cart-line-item";
import { Button } from "@/components/common/button";
import { Price } from "@/components/common/price";
import { useCart } from "@/lib/hooks/dynamic/use-cart";
import { sortCartItems } from "@/lib/utils/cart/sort-cart-items";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { XMarkMini } from "@medusajs/icons";
import { Link, useLocation } from "@tanstack/react-router";
import { useCartDrawer } from "@/lib/context/cart";

export const DEFAULT_CART_DROPDOWN_FIELDS =
  "id, *items, total, currency_code, item_subtotal";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for cart dropdown in the storefront navigation
 * - Header navigation: quick cart preview and access
 * - Mobile commerce: mobile cart dropdown interface
 * - Desktop navigation: hover cart preview
 * - Quick cart access: without leaving current page
 * - Cart item management: quick cart operations
 *
 * ECOMMERCE CONTEXT:
 * - Critical for cart visibility and access
 * - Essential for quick cart management
 * - Important for user experience and conversion
 * - Required for cart abandonment prevention
 * - Used in navigation and header components
 * - Important for mobile commerce experience
 *
 * DROPDOWN FEATURES:
 * - Hover-triggered cart preview
 * - Cart item count display
 * - Quick cart item viewing
 * - Subtotal display
 * - Direct navigation to full cart
 * - Empty cart state handling
 *
 * CART DISPLAY:
 * - Shows cart item count in navigation
 * - Displays cart items in compact format
 * - Shows subtotal and pricing
 * - Provides quick access to full cart
 * - Handles empty cart gracefully
 *
 * COMMON PATTERNS:
 * - Header cart dropdown
 * - Mobile cart preview
 * - Desktop hover cart
 * - Quick cart access
 * - Cart item management
 *
 * EXAMPLES:
 * - <CartDropdown /> // In header navigation
 * - Mobile cart dropdown
 * - Desktop hover cart preview
 * - Quick cart access from any page
 */

const CartDropdown = () => {
  const { isOpen, openCart, closeCart } = useCartDrawer();
  const { data: cart } = useCart({
    fields: DEFAULT_CART_DROPDOWN_FIELDS,
  });
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const sortedItems = sortCartItems(cart?.items || []);
  const itemCount =
    sortedItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={openCart}
        className="text-secondary-text hover:text-secondary-text-hover h-full"
      >
        Cart ({itemCount})
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-primary-bg shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-primary-border">
            <h2 className="text-large text-primary-text">Shopping Cart</h2>
            <button
              onClick={closeCart}
              className="text-secondary-text hover:text-secondary-text-hover"
              aria-label="Close cart"
            >
              <XMarkMini />
            </button>
          </div>

          {/* Empty Cart */}
          {(!cart || itemCount === 0) && (
            <div className="flex flex-col items-center justify-center flex-1 p-6">
              <span className="text-base font-medium text-secondary-text mb-4">
                Your cart is empty
              </span>
              <Link
                to={`${baseHref}/store` as any}
                onClick={closeCart}
              >
                <Button variant="secondary" size="fit">
                  Explore products
                </Button>
              </Link>
            </div>
          )}

          {/* Cart Items */}
          {cart && itemCount > 0 && (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {sortedItems?.map((item) => (
                  <CartLineItem
                    key={item.id}
                    item={item}
                    cart={cart}
                    type="compact"
                    fields={DEFAULT_CART_DROPDOWN_FIELDS}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-primary-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-medium text-secondary-text">
                    Subtotal
                  </span>
                  <Price
                    price={cart.item_subtotal}
                    currencyCode={cart.currency_code}
                  />
                </div>

                <Link
                  to={`${baseHref}/cart` as any}
                  onClick={closeCart}
                >
                  <Button className="w-full" variant="primary">
                    Go to cart
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDropdown;
