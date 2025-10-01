import { paymentMethodsData } from "@/lib/constants/payment-methods"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying payment method information in the storefront
 * - Checkout pages: show selected payment method details
 * - Order confirmations: display payment method used
 * - Order history: show payment methods from past orders
 * - Mobile commerce: mobile-optimized payment method display
 * - Customer service: payment method information for support
 *
 * ECOMMERCE CONTEXT:
 * - Critical for payment transparency and trust
 * - Essential for order confirmation and verification
 * - Important for customer service and support
 * - Required for payment method identification
 * - Used in order history and management
 * - Important for mobile commerce experience
 *
 * PAYMENT METHOD FEATURES:
 * - Payment provider name and identification
 * - Payment method icons and visual indicators
 * - Professional payment method presentation
 * - Responsive design for mobile/desktop
 * - Clear payment method identification
 * - Consistent payment method display
 *
 * PAYMENT DISPLAY:
 * - Provider name: payment provider identification
 * - Provider icon: visual payment method indicator
 * - Payment method title: clear payment identification
 * - Professional presentation: consistent styling
 *
 * COMMON PATTERNS:
 * - Checkout payment method display
 * - Order confirmation payment info
 * - Mobile payment method display
 * - Order history payment info
 * - Customer service payment info
 *
 * EXAMPLES:
 * - <PaymentMethodInfo provider_id="stripe" />
 * - <PaymentMethodInfo provider_id="paypal" />
 * - Checkout payment method display
 * - Mobile payment method info
 */
type PaymentMethodInfoProps = {
  provider_id: string;
}

const PaymentMethodInfo = ({ provider_id }: PaymentMethodInfoProps) => {
  return (
    <div className="flex items-center gap-2">
      <span>{paymentMethodsData[provider_id]?.title || provider_id}</span>
      {paymentMethodsData[provider_id]?.icon}
    </div>
  )
}

export default PaymentMethodInfo