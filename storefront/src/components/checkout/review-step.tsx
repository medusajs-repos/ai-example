import { HttpTypes } from "@medusajs/types"
import { Button } from "@/components/common/button"
import PaymentButton from "@/components/checkout/payment-button"
import { Price } from "@/components/common/price"
import { isPaidWithGiftCard } from "@/lib/utils/checkout/is-paid-with-gift-card"
import { getActivePaymentSession } from "@/lib/utils/checkout/get-active-payment-session"
import { lazy } from "react"

const PaymentMethodInfo = lazy(() => import("../common/payment-method-info"))
const Address = lazy(() => import("@/components/common/address"))

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for checkout review step in the storefront
 * - Checkout pages: final order review before payment
 * - Order confirmation: review order details and information
 * - Mobile commerce: mobile-optimized order review
 * - User experience: final order verification
 * - Checkout completion: order review and confirmation
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for checkout completion and conversion
 * - Essential for order review and verification
 * - Important for user confidence and trust
 * - Required for final order confirmation
 * - Used in checkout optimization and conversion
 * - Important for mobile commerce experience
 * 
 * REVIEW STEP FEATURES:
 * - Order details review and display
 * - Shipping address and method confirmation
 * - Billing address and payment method confirmation
 * - Order summary and pricing review
 * - Final order placement and payment
 * - Responsive design for mobile/desktop
 * 
 * ORDER REVIEW:
 * - Shipping address: delivery information
 * - Shipping method: delivery method and cost
 * - Billing address: payment information
 * - Payment method: payment provider and details
 * - Order summary: final pricing and totals
 * 
 * COMMON PATTERNS:
 * - Checkout order review
 * - Mobile order review
 * - Order confirmation review
 * - Final order verification
 * - Checkout completion review
 * 
 * EXAMPLES:
 * - <ReviewStep cart={cart} onBack={handleBack} />
 * - Checkout order review
 * - Mobile order review
 * - Order confirmation review
 */

interface ReviewStepProps {
  cart: HttpTypes.StoreCart
  onBack: () => void
}

const ReviewStep = ({ cart, onBack }: ReviewStepProps) => {
  const paidByGiftcard = isPaidWithGiftCard(cart)
  const activeSession = getActivePaymentSession(cart)

  return (
    <div className="flex flex-col gap-8">
      {/* Delivery Information */}
      {cart.shipping_address && (
        <>
          <div className="flex flex-col gap-2">
            <h3 className="text-primary-text !txt-medium-plus">Shipping Address</h3>
            <Address address={cart.shipping_address} />
          </div>
            
          {cart.shipping_methods?.[0] && (
            <div className="flex flex-col gap-2">
              <h3 className="text-primary-text !txt-medium-plus">Shipping Method</h3>
              <div className="txt-small text-secondary-text flex items-center gap-2">
                <div>{cart.shipping_methods[0].name}</div>
                <Price
                  price={cart.shipping_methods[0].amount}
                  currencyCode={cart.currency_code}
                  textWeight="plus"
                  className="text-secondary-text"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment Information */}
      <div className="flex flex-col gap-2">
        <h3 className="text-primary-text !txt-medium-plus">Billing Address</h3>
        <div className="txt-small text-secondary-text">
          {cart.billing_address ? (
            <Address address={cart.billing_address} />
          ) : (
            <span>Same as shipping address</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-primary-text !txt-medium-plus">Payment Method</h3>
        <div className="txt-small text-secondary-text flex items-center gap-2">
          {activeSession && (
            <PaymentMethodInfo provider_id={activeSession.provider_id} />
          )}
          {paidByGiftcard && <span>Gift Card</span>}
        </div>
      </div>

      <p className="txt-small text-secondary-text">
        When you place your order, your payment will be authorized and we'll start processing your order.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        
        <PaymentButton cart={cart} />
      </div>
    </div>
  )
}

export default ReviewStep