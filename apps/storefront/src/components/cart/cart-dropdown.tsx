import {
  useCart,
} from "@/lib/hooks/dynamic/use-cart"
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { ShoppingCart } from "@medusajs/icons"
import { Button } from "@/components/common/button"
import { Link, useLocation } from "@tanstack/react-router"
import { NavbarLink } from "@/components/layout/navbar-link"
import { Price } from "@/components/common/price"
import CartLineItem from "@/components/cart/cart-line-item"
import { sortCartItems } from "@/lib/utils/cart/sort-cart-items"

export const DEFAULT_CART_DROPDOWN_FIELDS = "id, *items, total, currency_code, item_subtotal"

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
  const { data: cart } = useCart({
    fields: DEFAULT_CART_DROPDOWN_FIELDS
  })
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const sortedItems = sortCartItems(cart?.items || [])
  const itemCount =
    sortedItems?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <div className="relative group">
      <NavbarLink
        to={`${baseHref}/cart`}
      >
        Cart ({itemCount})
      </NavbarLink>

      <div className="absolute top-full right-0 z-50 pt-2 group-hover:block hidden">
        <div className="bg-primary-bg shadow-elevation-flyout w-[420px] max-h-[402px] overflow-hidden">
          {(!cart || itemCount === 0) && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-secondary-text mb-4">
                <ShoppingCart />
              </div>
              <span className="txt-smallall-regular text-secondary-text">
                Your cart is empty
              </span>
              <div className="mt-4">
                <Link to={`${baseHref}/store` as any}>
                  <Button variant="secondary" size="fit">
                    Explore products
                  </Button>
                </Link>
              </div>
            </div> 
          )}
          {cart && itemCount > 0 && (
            <>
              <div className="max-h-[250px] overflow-y-auto p-4 space-y-3">
                {sortedItems?.map((item) => (
                  <CartLineItem key={item.id} item={item} cart={cart} type="compact" fields={DEFAULT_CART_DROPDOWN_FIELDS} />
                ))}
              </div>

              <div className="p-4 border-t border-secondary-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="txt-medium text-secondary-text">Subtotal</span>
                  <Price
                    price={cart.item_subtotal}
                    currencyCode={cart.currency_code}
                  />
                </div>

                <Link to={`${baseHref}/cart` as any}>
                  <Button className="w-full" variant="primary">
                    Go to cart
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartDropdown
