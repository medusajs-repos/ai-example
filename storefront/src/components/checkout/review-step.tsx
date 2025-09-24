import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text } from "@medusajs/ui"
import PaymentButton from "@/components/checkout/payment-button"
import { Price } from "@/components/common/price"
import { isPaidWithGiftCard } from "@/lib/utils/checkout/is-paid-with-gift-card"
import { getActiveSession } from "@/lib/utils/checkout/get-active-session"
import { lazy } from "react"

const PaymentMethodInfo = lazy(() => import("../common/payment-method-info"))
const Address = lazy(() => import("@/components/common/address"))

interface ReviewStepProps {
  cart: HttpTypes.StoreCart
  onBack: () => void
}

const ReviewStep = ({ cart, onBack }: ReviewStepProps) => {
  const paidByGiftcard = isPaidWithGiftCard(cart)
  const activeSession = getActiveSession(cart)

  return (
    <div>
      <Heading level="h2" className="mb-6">
        Review
      </Heading>

      <div className="space-y-8">

        {/* Delivery Information */}
        {cart.shipping_address && (
          <div>
            <Heading level="h3" className="mb-4">
              Delivery Information
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Text className="txt-medium-plus text-primary-text mb-2">Shipping Address</Text>
                <Address address={cart.shipping_address} />
              </div>
              
              {cart.shipping_methods?.[0] && (
                <div>
                  <Text className="txt-medium-plus text-primary-text mb-2">Shipping Method</Text>
                  <div className="txt-small text-secondary-text flex items-center justify-between">
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
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div>
          <Heading level="h3" className="mb-4">
            Billing Information
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text className="txt-medium-plus text-primary-text mb-2">Billing Address</Text>
              <div className="txt-small text-secondary-text">
                {cart.billing_address ? (
                  <Address address={cart.billing_address} />
                ) : (
                  <span>Same as shipping address</span>
                )}
              </div>
            </div>
            <div>
              <Text className="txt-medium-plus text-primary-text mb-2">Payment Method</Text>
              <div className="txt-small text-secondary-text">
                {activeSession && (
                  <PaymentMethodInfo provider_id={activeSession.provider_id} />
                )}
                {paidByGiftcard && <span>Gift Card</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="secondary" onClick={onBack}>
            Back to Payment
          </Button>
          
          <PaymentButton cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default ReviewStep