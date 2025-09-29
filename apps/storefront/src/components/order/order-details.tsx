import { HttpTypes } from "@medusajs/types"
import OrderLineItem from "@/components/order/order-line-item"
import OrderShipping from "@/components/order/order-shipping"
import OrderBilling from "@/components/order/order-billing"
import OrderSummary from "@/components/order/order-summary"
import OrderInfo from "@/components/order/order-info"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for displaying complete order information in the storefront
 * - Order confirmation pages: show order details after purchase
 * - Order history pages: display past order information
 * - Order tracking pages: show order status and details
 * - Mobile commerce: mobile-optimized order display
 * - Customer service: order information for support
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for order confirmation and customer trust
 * - Essential for order tracking and status updates
 * - Important for customer service and support
 * - Required for order history and management
 * - Important for mobile commerce experience
 * 
 * ORDER DETAILS FEATURES:
 * - Complete order information display
 * - Order items with quantities and prices
 * - Shipping and billing address information
 * - Order summary with totals and taxes
 * - Order status
 * - Responsive design for mobile/desktop
 * 
 * ORDER INFORMATION:
 * - Order items: products, quantities, prices
 * - Shipping address: delivery information
 * - Billing address: payment information
 * - Order summary: totals, taxes, discounts
 * - Order status: fulfillment and tracking
 * 
 * COMMON PATTERNS:
 * - Order confirmation display
 * - Order history pages
 * - Mobile order details
 * - Order tracking pages
 * - Customer service order information
 * 
 * EXAMPLES:
 * - <OrderDetails order={order} />
 * - Order confirmation page
 * - Mobile order details
 * - Order tracking page
 */

interface OrderDetailsProps {
  order: HttpTypes.StoreOrder;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {

  return (
    <div>
      <div className="flex flex-col gap-8">
        <OrderInfo order={order} />

        <hr className="bg-primary-border" />
      
        <div className="flex flex-col gap-4">
          <h3 className="mb-4 text-medium-plus">Items</h3>
          {order.items?.map((item) => (
            <OrderLineItem key={item.id} item={item} order={order} />
          ))}
        </div>

        <hr className="bg-primary-border" />

        <OrderShipping order={order} />

        <hr className="bg-primary-border" />

        <OrderBilling order={order} />

        <hr className="bg-primary-border" />

        <OrderSummary order={order} />
      </div>
    </div>
  )
}

export default OrderDetails
