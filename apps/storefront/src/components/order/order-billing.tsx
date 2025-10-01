import { HttpTypes } from "@medusajs/types"
import Address from "@/components/common/address"
import PaymentMethodInfo from "@/components/common/payment-method-info"
import { isPaidWithGiftCard } from "@/lib/utils/checkout/is-paid-with-gift-card"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying billing information in the storefront
 * - Order confirmation pages: show billing address and payment method
 * - Order history pages: display past order billing information
 * - Order tracking pages: show billing details for orders
 * - Mobile commerce: mobile-optimized billing display
 * - Customer service: billing information for support
 *
 * ECOMMERCE CONTEXT:
 * - Critical for order confirmation and customer trust
 * - Essential for billing transparency and verification
 * - Important for customer service and support
 * - Required for order history and management
 * - Used in payment method verification
 * - Important for mobile commerce experience
 *
 * BILLING INFORMATION FEATURES:
 * - Billing address display and formatting
 * - Payment method information and display
 * - Gift card payment indication
 * - Professional billing presentation
 * - Responsive design for mobile/desktop
 * - Clear billing information layout
 *
 * BILLING DETAILS:
 * - Billing address: formatted address display
 * - Payment method: payment provider information
 * - Gift card payments: special payment indication
 * - Billing verification: address and payment confirmation
 *
 * COMMON PATTERNS:
 * - Order confirmation billing
 * - Order history billing
 * - Mobile billing display
 * - Payment method verification
 * - Customer service billing
 *
 * EXAMPLES:
 * - <OrderBilling order={order} />
 * - Order confirmation billing
 * - Mobile billing display
 * - Payment method verification
 */
type OrderBillingProps = {
  order: HttpTypes.StoreOrder;
}

const OrderBilling = ({ order }: OrderBillingProps) => {
  const paidByGiftcard = isPaidWithGiftCard(order)

  return (
    <div>
      <h3 className="mb-4">
        Billing Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="txt-medium-plus text-primary-text mb-2">Billing Address</span>
          <div className="txt-small text-secondary-text">
            {order.billing_address ? (
              <Address address={order.billing_address} />
            ) : (
              <span>Same as shipping address</span>
            )}
          </div>
        </div>
        <div>
          <span className="txt-medium-plus text-primary-text mb-2">Payment Method</span>
          <div className="txt-small text-secondary-text">
            {order.payment_collections?.[0].payment_sessions?.[0] && (
              <PaymentMethodInfo provider_id={order.payment_collections[0].payment_sessions[0].provider_id} />
            )}
            {paidByGiftcard && <span>Gift Card</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderBilling