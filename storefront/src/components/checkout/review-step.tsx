import { HttpTypes } from "@medusajs/types"
import { CheckCircleSolid, ShoppingBag } from "@medusajs/icons"
import { Button, Heading, Text } from "@medusajs/ui"
import { useMemo } from "react"
import { paymentInfoMap } from "@/lib/constants/constants"
import PaymentButton from "@/components/checkout/payment-button"
import { Price } from "@/components/common/price"
import Address from "@/components/common/address"
import CartLineItem from "@/components/cart/cart-line-item"
import CartSummary from "@/components/cart/cart-summary"

interface ReviewStepProps {
  cart: HttpTypes.StoreCart
  onBack: () => void
}

const ReviewStep = ({ cart, onBack }: ReviewStepProps) => {
  const paidByGiftcard = (cart as any)?.gift_cards && 
    (cart as any)?.gift_cards?.length > 0 && 
    (cart as any)?.total === 0

  const previousStepsCompleted = useMemo(() => {
    return Boolean(
      cart?.shipping_address &&
      (cart?.shipping_methods?.length || 0) > 0 &&
      (cart?.payment_collection?.payment_sessions?.length || paidByGiftcard)
    )
  }, [cart, paidByGiftcard])

  if (!previousStepsCompleted) {
    return (
      <div className="bg-white p-8 rounded-lg border border-ui-border-base">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="text-ui-fg-base" />
          <Heading level="h2">Review</Heading>
        </div>
        <div className="text-center py-8">
          <Text className="text-ui-fg-subtle mb-4">
            Please complete all previous steps before reviewing your order.
          </Text>
          <Button variant="secondary" onClick={onBack}>
            ← Back to Payment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-ui-border-base">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row txt-xlarge-plus-regular gap-x-2 items-center"
        >
          Review Order
          <CheckCircleSolid className="text-green-500" />
        </Heading>
      </div>

      <div className="space-y-8">
        {/* Order Summary */}
        <div>
          <Heading level="h3" className="txt-large-plus mb-4">
            Order Summary
          </Heading>
          <div className="space-y-4">
            {cart.items?.map((item) => (
              <CartLineItem key={item.id} item={item} cart={cart} type="display" />
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        {cart.shipping_address && (
          <div>
            <Heading level="h3" className="txt-large-plus mb-4">
              Delivery Information
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Text className="txt-medium-plus text-ui-fg-base mb-2">Shipping Address</Text>
                <Address address={cart.shipping_address} />
              </div>
              
              {cart.shipping_methods?.[0] && (
                <div>
                  <Text className="txt-medium-plus text-ui-fg-base mb-2">Shipping Method</Text>
                  <div className="txt-small text-ui-fg-subtle">
                    <div>{cart.shipping_methods[0].name}</div>
                    <Price
                      price={cart.shipping_methods[0].amount}
                      currencyCode={cart.currency_code}
                      textClassName="txt-medium-plus"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div>
          <Heading level="h3" className="txt-large-plus mb-4">
            Payment Information
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text className="txt-medium-plus text-ui-fg-base mb-2">Payment Method</Text>
              <div className="txt-small text-ui-fg-subtle">
                {cart.payment_collection?.payment_sessions?.[0] && (
                  <div className="flex items-center gap-2">
                    <span>{paymentInfoMap[cart.payment_collection?.payment_sessions[0].provider_id]?.title || cart.payment_collection?.payment_sessions[0].provider_id}</span>
                    {paymentInfoMap[cart.payment_collection?.payment_sessions[0].provider_id]?.icon}
                  </div>
                )}
                {paidByGiftcard && <span>Gift Card</span>}
              </div>
            </div>
            
            <div>
              <Text className="txt-medium-plus text-ui-fg-base mb-2">Billing Address</Text>
              <div className="txt-small text-ui-fg-subtle">
                {cart.billing_address ? (
                  <Address address={cart.billing_address} />
                ) : (
                  <span>Same as shipping address</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cart Totals */}
        <CartSummary cart={cart} />

        {/* Terms and Conditions */}
        <div className="bg-ui-bg-subtle p-4 rounded border">
          <Text className="txt-small text-ui-fg-base">
            By clicking "Place Order" below, you confirm that you have read, understand and accept our{" "}
            <span className="text-ui-fg-interactive hover:underline cursor-pointer">Terms of Use</span>,{" "}
            <span className="text-ui-fg-interactive hover:underline cursor-pointer">Terms of Sale</span> and{" "}
            <span className="text-ui-fg-interactive hover:underline cursor-pointer">Returns Policy</span> and{" "}
            acknowledge that you have read our{" "}
            <span className="text-ui-fg-interactive hover:underline cursor-pointer">Privacy Policy</span>.
          </Text>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="secondary" onClick={onBack}>
            ← Back to Payment
          </Button>
          
          <PaymentButton cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default ReviewStep