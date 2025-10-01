import { HttpTypes } from "@medusajs/types"
import { Thumbnail } from "@/components/common/thumbnail"
import { Price } from "@/components/common/price"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for displaying individual order items in the storefront
 * - Order confirmation pages: show purchased items
 * - Order history pages: display past order items
 * - Order tracking pages: show order item details
 * - Mobile commerce: mobile-optimized order item display
 * - Customer service: order item information for support
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for order confirmation and customer trust
 * - Essential for order tracking and item verification
 * - Important for customer service and support
 * - Required for order history and management
 * - Used in order fulfillment and tracking
 * - Important for mobile commerce experience
 * 
 * ORDER LINE ITEM FEATURES:
 * - Product thumbnail display
 * - Product title and variant information
 * - Quantity and pricing information
 * - Order item status and tracking
 * - Responsive design for mobile/desktop
 * - Professional order presentation
 * 
 * ITEM INFORMATION:
 * - Product thumbnail: visual product identification
 * - Product title: product name and identification
 * - Variant information: size, color, material, etc.
 * - Quantity: number of items ordered
 * - Price: item price and total cost
 * 
 * COMMON PATTERNS:
 * - Order confirmation items
 * - Order history items
 * - Mobile order items
 * - Order tracking items
 * - Customer service order items
 * 
 * EXAMPLES:
 * - <OrderLineItem item={orderItem} order={order} />
 * - Order confirmation item display
 * - Mobile order item display
 * - Order tracking item display
 */

type OrderLineItemProps = {
  item: HttpTypes.StoreOrderLineItem;
  order: HttpTypes.StoreOrder;
}

const OrderLineItem = ({ item, order }: OrderLineItemProps) => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-primary-border last:border-b-0">
      <Thumbnail thumbnail={item.thumbnail} alt={item.product_title || item.title} className="w-16 h-16" />
      <div className="flex-1 flex flex-col gap-y-1">
        <span className="txt-medium-plus text-primary-text">{item.product_title}</span>
        {item.variant_title && item.variant_title !== "Default Variant" && (
          <span className="txt-small text-secondary-text">
            {item.variant_title}
          </span>
        )}
        <span className="txt-small text-secondary-text">
          Quantity: {item.quantity}
        </span>
      </div>
      <div className="text-right">
        <Price
          price={item.total}
          currencyCode={order.currency_code}
          className="text-secondary-text"
        />
      </div>
    </div>
  )
}

export default OrderLineItem