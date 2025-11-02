import { formatOrderId } from "@/lib/utils/order/format-order-id";
import { HttpTypes } from "@medusajs/types";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying order information in the storefront
 * - Order confirmation pages: show order details and status
 * - Order history pages: display past order information
 * - Order tracking pages: show order status and details
 * - Mobile commerce: mobile-optimized order information
 * - Customer service: order information for support
 *
 * ECOMMERCE CONTEXT:
 * - Critical for order confirmation and customer trust
 * - Essential for order tracking and status updates
 * - Important for customer service and support
 * - Required for order history and management
 * - Used in order fulfillment and tracking
 * - Important for mobile commerce experience
 *
 * ORDER INFO FEATURES:
 * - Order ID display with formatting
 * - Order date and creation information
 * - Order status and fulfillment status
 * - Customer email and contact information
 * - Professional order presentation
 * - Responsive design for mobile/desktop
 *
 * ORDER DETAILS:
 * - Order ID: formatted order identification
 * - Order date: creation date and time
 * - Order status: fulfillment and processing status
 * - Customer email: contact information
 *
 * COMMON PATTERNS:
 * - Order confirmation information
 * - Order history display
 * - Mobile order information
 * - Order tracking details
 * - Customer service order info
 *
 * EXAMPLES:
 * - <OrderInfo order={order} />
 * - Order confirmation information
 * - Mobile order information
 * - Order tracking details
 */
type OrderInfoProps = {
  order: HttpTypes.StoreOrder;
};

const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-medium-plus">Order Details</h3>
      <div className="flex gap-2 items-center">
        <span className="text-base font-medium-plus text-primary-text">
          Order ID:
        </span>
        <span className="text-sm text-secondary-text">
          {formatOrderId(`${order.display_id || order.id}`)}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-base font-medium-plus text-primary-text">
          Order Date:
        </span>
        <span className="text-sm text-secondary-text">
          {new Date(order.created_at!).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-base font-medium-plus text-primary-text">
          Order Status:
        </span>
        <span className="text-sm text-secondary-text">{order.status}</span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-base font-medium-plus text-primary-text">
          Order Email:
        </span>
        <span className="text-sm text-secondary-text">
          {order.customer?.email || order.email}
        </span>
      </div>
    </div>
  );
};

export default OrderInfo;
