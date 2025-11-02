import Address from "@/components/common/address";
import { Price } from "@/components/common/price";
import { HttpTypes } from "@medusajs/types";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying shipping information in the storefront
 * - Order confirmation pages: show shipping address and method
 * - Order history pages: display past order shipping information
 * - Order tracking pages: show shipping details for orders
 * - Mobile commerce: mobile-optimized shipping display
 * - Customer service: shipping information for support
 *
 * ECOMMERCE CONTEXT:
 * - Critical for order confirmation and customer trust
 * - Essential for shipping transparency and verification
 * - Important for customer service and support
 * - Required for order history and management
 * - Used in shipping method verification
 * - Important for mobile commerce experience
 *
 * SHIPPING INFORMATION FEATURES:
 * - Shipping address display and formatting
 * - Shipping method information and display
 * - Shipping cost display and pricing
 * - Professional shipping presentation
 * - Responsive design for mobile/desktop
 * - Clear shipping information layout
 *
 * SHIPPING DETAILS:
 * - Shipping address: formatted address display
 * - Shipping method: delivery method information
 * - Shipping cost: delivery pricing and costs
 * - Shipping verification: address and method confirmation
 *
 * COMMON PATTERNS:
 * - Order confirmation shipping
 * - Order history shipping
 * - Mobile shipping display
 * - Shipping method verification
 * - Customer service shipping
 *
 * EXAMPLES:
 * - <OrderShipping order={order} />
 * - Order confirmation shipping
 * - Mobile shipping display
 * - Shipping method verification
 */
type OrderShippingProps = {
  order: HttpTypes.StoreOrder;
};

const OrderShipping = ({ order }: OrderShippingProps) => {
  return (
    <div>
      <h3 className="mb-4 text-medium-plus">Delivery Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-base font-medium-plus text-primary-text mb-2">
            Shipping Address
          </span>
          {order.shipping_address && (
            <Address address={order.shipping_address} />
          )}
        </div>

        {order.shipping_methods?.[0] && (
          <div>
            <span className="text-base font-medium-plus text-primary-text mb-2">
              Shipping Method
            </span>
            <div className="text-sm text-secondary-text flex items-center justify-between">
              <div>{order.shipping_methods[0].name}</div>
              <Price
                price={order.shipping_methods[0].amount}
                currencyCode={order.currency_code}
                className="text-secondary-text"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderShipping;
