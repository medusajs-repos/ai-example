import { HttpTypes } from "@medusajs/types"
import { CheckCircleSolid, ShoppingBag } from "@medusajs/icons"
import { Button, Heading, Text } from "@medusajs/ui"
import { useState, useMemo } from "react"
import { completeCart } from "@lib/data/cart"
import { useNavigate, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@lib/util/regions"
import { convertToLocale } from "@lib/util/money"
import { isStripe, isManual, paymentInfoMap } from "@lib/constants"
import PaymentButton from "./PaymentButton"

interface ReviewStepProps {
  cart: HttpTypes.StoreCart
  onBack: () => void
}

const ReviewStep = ({ cart, onBack }: ReviewStepProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)

  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted = useMemo(() => {
    return Boolean(
      cart?.shipping_address &&
      cart?.shipping_methods?.length > 0 &&
      (cart?.payment_sessions?.length || cart?.payment_collection || paidByGiftcard)
    )
  }, [cart, paidByGiftcard])

  if (!previousStepsCompleted) {
    return (
      <div className="bg-white p-8 rounded-lg border border-ui-border-base">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-6 h-6 text-ui-fg-base" />
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
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Review Order
          <CheckCircleSolid className="text-green-500" />
        </Heading>
      </div>

      <div className="space-y-8">
        {/* Order Summary */}
        <div>
          <Heading level="h3" className="text-lg font-semibold mb-4">
            Order Summary
          </Heading>
          <div className="space-y-4">
            {cart.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b border-ui-border-base last:border-b-0">
                <div className="w-16 h-16 flex-shrink-0">
                  {item.variant?.product?.thumbnail || item.thumbnail ? (
                    <img
                      src={item.variant?.product?.thumbnail || item.thumbnail || ''}
                      alt={item.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-ui-bg-subtle rounded flex items-center justify-center">
                      <span className="text-xs text-ui-fg-muted">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Text className="font-medium text-ui-fg-base">{item.title}</Text>
                  {item.variant && item.variant.title !== "Default" && (
                    <Text className="text-sm text-ui-fg-subtle">
                      {item.variant.title}
                    </Text>
                  )}
                  <Text className="text-sm text-ui-fg-subtle">
                    Quantity: {item.quantity}
                  </Text>
                </div>
                <div className="text-right">
                  <Text className="font-medium">
                    {item.total ? (
                      convertToLocale({
                        amount: item.total,
                        currency_code: cart.currency_code || 'USD'
                      })
                    ) : (
                      convertToLocale({
                        amount: (item.unit_price || 0) * item.quantity,
                        currency_code: cart.currency_code || 'USD'
                      })
                    )}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        {cart.shipping_address && (
          <div>
            <Heading level="h3" className="text-lg font-semibold mb-4">
              Delivery Information
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Text className="font-medium text-ui-fg-base mb-2">Shipping Address</Text>
                <div className="text-sm text-ui-fg-subtle">
                  <div>{cart.shipping_address.first_name} {cart.shipping_address.last_name}</div>
                  <div>{cart.shipping_address.address_1} {cart.shipping_address.address_2}</div>
                  <div>{cart.shipping_address.postal_code}, {cart.shipping_address.city}</div>
                  <div>{cart.shipping_address.country_code?.toUpperCase()}</div>
                </div>
              </div>
              
              {cart.shipping_methods?.[0] && (
                <div>
                  <Text className="font-medium text-ui-fg-base mb-2">Shipping Method</Text>
                  <div className="text-sm text-ui-fg-subtle">
                    <div>{cart.shipping_methods[0].name}</div>
                    <div>
                      {cart.shipping_methods[0].amount ? (
                        convertToLocale({
                          amount: cart.shipping_methods[0].amount,
                          currency_code: cart.currency_code || 'USD'
                        })
                      ) : (
                        'Free'
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div>
          <Heading level="h3" className="text-lg font-semibold mb-4">
            Payment Information
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text className="font-medium text-ui-fg-base mb-2">Payment Method</Text>
              <div className="text-sm text-ui-fg-subtle">
                {cart.payment_sessions?.[0] && (
                  <div className="flex items-center gap-2">
                    <span>{paymentInfoMap[cart.payment_sessions[0].provider_id]?.title || cart.payment_sessions[0].provider_id}</span>
                    {paymentInfoMap[cart.payment_sessions[0].provider_id]?.icon}
                  </div>
                )}
                {paidByGiftcard && <span>Gift Card</span>}
              </div>
            </div>
            
            <div>
              <Text className="font-medium text-ui-fg-base mb-2">Billing Address</Text>
              <div className="text-sm text-ui-fg-subtle">
                {cart.billing_address ? (
                  <>
                    <div>{cart.billing_address.first_name} {cart.billing_address.last_name}</div>
                    <div>{cart.billing_address.address_1} {cart.billing_address.address_2}</div>
                    <div>{cart.billing_address.postal_code}, {cart.billing_address.city}</div>
                    <div>{cart.billing_address.country_code?.toUpperCase()}</div>
                  </>
                ) : (
                  <span>Same as shipping address</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Totals */}
        <div className="border-t border-ui-border-base pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ui-fg-subtle">Subtotal</span>
              <span>
                {convertToLocale({
                  amount: cart.subtotal || 0,
                  currency_code: cart.currency_code || 'USD'
                })}
              </span>
            </div>
            
            {(cart.discount_total || 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-ui-fg-subtle">Discount</span>
                <span className="text-red-500">
                  -{convertToLocale({
                    amount: cart.discount_total || 0,
                    currency_code: cart.currency_code || 'USD'
                  })}
                </span>
              </div>
            )}
            
            {(cart.shipping_total || 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-ui-fg-subtle">Shipping</span>
                <span>
                  {convertToLocale({
                    amount: cart.shipping_total || 0,
                    currency_code: cart.currency_code || 'USD'
                  })}
                </span>
              </div>
            )}
            
            {(cart.tax_total || 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-ui-fg-subtle">Taxes</span>
                <span>
                  {convertToLocale({
                    amount: cart.tax_total || 0,
                    currency_code: cart.currency_code || 'USD'
                  })}
                </span>
              </div>
            )}
            
            <div className="border-t border-ui-border-base pt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>
                  {convertToLocale({
                    amount: cart.total || 0,
                    currency_code: cart.currency_code || 'USD'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-ui-bg-subtle p-4 rounded border">
          <Text className="text-sm text-ui-fg-base">
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