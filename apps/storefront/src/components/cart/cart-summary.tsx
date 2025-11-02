import Loading from "@/components/common/loading";
import { Price } from "@/components/common/price";
import { HttpTypes } from "@medusajs/types";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying cart pricing breakdown in the storefront
 * - Cart pages: show detailed cart pricing information
 * - Checkout pages: display order summary and totals
 * - Cart dropdowns: show cart subtotal and pricing
 * - Mobile commerce: mobile-optimized cart summary
 * - Order review: display final pricing before placing order
 *
 * ECOMMERCE CONTEXT:
 * - Critical for price transparency and trust
 * - Essential for checkout flow and conversion
 * - Important for user experience and decision making
 * - Required for order confirmation and review
 * - Used in cart management and updates
 * - Important for mobile commerce experience
 *
 * SUMMARY FEATURES:
 * - Detailed pricing breakdown (subtotal, shipping, tax, discount)
 * - Clear total calculation and display
 * - Currency formatting and display
 * - Loading states for price calculations
 * - Responsive design for mobile/desktop
 * - Professional pricing presentation
 *
 * PRICING BREAKDOWN:
 * - Subtotal: item prices before taxes and shipping
 * - Shipping: delivery and handling costs
 * - Discount: promotional discounts and savings
 * - Tax: applicable taxes and fees
 * - Total: final amount to be charged
 *
 * COMMON PATTERNS:
 * - Cart page pricing summary
 * - Checkout order summary
 * - Mobile cart pricing display
 * - Order review pricing
 * - Cart dropdown pricing
 *
 * EXAMPLES:
 * - <CartSummary cart={cart} />
 * - Cart page with pricing breakdown
 * - Checkout order summary
 * - Mobile cart pricing display
 */

interface CartSummaryProps {
  cart: HttpTypes.StoreCart;
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  if ("isOptimistic" in cart && cart.isOptimistic) {
    return <Loading />;
  }
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-secondary-text">Subtotal</span>
          <Price
            price={cart.subtotal}
            currencyCode={cart.currency_code}
            className="text-secondary-text"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-secondary-text">Shipping</span>
          <Price
            price={cart.shipping_total}
            currencyCode={cart.currency_code}
            className="text-secondary-text"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-secondary-text">Discount</span>
          <Price
            price={cart.discount_total}
            currencyCode={cart.currency_code}
            type="discount"
            className="text-secondary-text"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-secondary-text">Tax</span>
          <Price
            price={cart.tax_total}
            currencyCode={cart.currency_code}
            className="text-secondary-text"
          />
        </div>
      </div>

      <hr className="bg-primary-border" />

      <div className="flex justify-between text-sm">
        <span className="text-primary-text">Total</span>
        <Price
          price={cart.total}
          currencyCode={cart.currency_code}
          className="text-primary-text"
        />
      </div>
    </div>
  );
};

export default CartSummary;
