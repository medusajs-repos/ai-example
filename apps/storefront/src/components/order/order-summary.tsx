import { HttpTypes } from "@medusajs/types"
import { Price } from "@/components/common/price"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for displaying order pricing summary in the storefront
 * - Order confirmation pages: show final order totals
 * - Order history pages: display past order pricing
 * - Order tracking pages: show order cost breakdown
 * - Mobile commerce: mobile-optimized order summary
 * - Customer service: order pricing information for support
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for order confirmation and customer trust
 * - Essential for order pricing transparency
 * - Important for customer service and support
 * - Required for order history and management
 * - Important for mobile commerce experience
 * 
 * ORDER SUMMARY FEATURES:
 * - Detailed pricing breakdown (subtotal, shipping, tax, discount)
 * - Clear total calculation and display
 * - Currency formatting and display
 * - Professional order presentation
 * - Responsive design for mobile/desktop
 * - Order cost transparency
 * 
 * PRICING BREAKDOWN:
 * - Subtotal: item prices before taxes and shipping
 * - Shipping: delivery and handling costs
 * - Discount: promotional discounts and savings
 * - Tax: applicable taxes and fees
 * - Total: final amount charged
 * 
 * COMMON PATTERNS:
 * - Order confirmation pricing
 * - Order history pricing
 * - Mobile order summary
 * - Order tracking pricing
 * - Customer service order pricing
 * 
 * EXAMPLES:
 * - <OrderSummary order={order} />
 * - Order confirmation pricing
 * - Mobile order summary
 * - Order tracking pricing
 */

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder;
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  return (
    <div className="space-y-4">
      <h3 className="mb-4 text-medium-plus">
        Summary
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Subtotal</span>
          <Price
            price={order.subtotal}
            currencyCode={order.currency_code}
            className="text-secondary-text"
          />
        </div>
        
        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Shipping</span>
          <Price
            price={order.shipping_total}
            currencyCode={order.currency_code}
            className="text-secondary-text"
          />
        </div>

        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Discount</span>
          <Price
            price={order.discount_total}
            currencyCode={order.currency_code}
            type="discount"
            className="text-secondary-text"
          />
        </div>
        
        <div className="flex justify-between txt-small">
          <span className="text-secondary-text">Tax</span>
          <Price
            price={order.tax_total}
            currencyCode={order.currency_code}
          className="text-secondary-text"
          />
        </div>
      </div>
      
      <hr className="bg-primary-border" />
      
      <div className="flex justify-between">
        <span className="text-primary-text txt-small">Total</span>
        <Price
          price={order.total}
          currencyCode={order.currency_code}
        />
      </div>
    </div>
  )
}

export default OrderSummary