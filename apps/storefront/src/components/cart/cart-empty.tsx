import { Button } from "@/components/common/button";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { Link, useLocation } from "@tanstack/react-router";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for empty cart states in the storefront
 * - Cart pages: display when cart has no items
 * - Cart dropdowns: show when cart is empty
 * - Checkout pages: display when cart becomes empty
 * - Mobile commerce: mobile-optimized empty cart
 * - Cart recovery: encourage users to add items
 *
 * ECOMMERCE CONTEXT:
 * - Critical for cart abandonment recovery
 * - Essential for user experience and engagement
 * - Important for conversion optimization
 * - Required for cart state management
 * - Used in cart recovery strategies
 * - Important for mobile commerce experience
 *
 * EMPTY CART FEATURES:
 * - Clear empty cart messaging
 * - Call-to-action to continue shopping
 * - Encouraging user engagement
 * - Professional empty state design
 * - Responsive design for mobile/desktop
 * - Navigation to product catalog
 *
 * CART RECOVERY:
 * - Encourages users to add products
 * - Provides clear next steps
 * - Maintains user engagement
 * - Offers product discovery
 *
 * COMMON PATTERNS:
 * - Empty cart page display
 * - Cart dropdown empty state
 * - Mobile empty cart interface
 * - Cart recovery messaging
 * - Product discovery encouragement
 *
 * EXAMPLES:
 * - <CartEmpty /> // On empty cart page
 * - Empty cart dropdown state
 * - Mobile empty cart display
 * - Cart recovery with product suggestions
 */

const CartEmpty = () => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);

  return (
    <div className="text-center py-16 flex flex-col items-center justify-center gap-4">
      <h2 className="text-large-plus font-bold text-primary-text">
        Your cart is empty
      </h2>
      <p className="text-secondary-text text-base font-medium">
        Start by adding some products
      </p>
      <Link to={`/${countryCode}/store` as any}>
        <Button variant="primary" size="fit">
          Continue shopping
        </Button>
      </Link>
    </div>
  );
};

export default CartEmpty;
