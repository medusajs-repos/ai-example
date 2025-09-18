import { HttpTypes } from "@medusajs/types"
import { CheckCircleSolid } from "@medusajs/icons"
import { Heading, Text } from "@medusajs/ui"
import { useState, useCallback, useMemo } from "react"
import { initiatePaymentSession, setPaymentMethod } from "@/lib/data/cart"

interface PaymentStepProps {
  cart: HttpTypes.StoreCart
  isActive: boolean
  onComplete?: () => void
}

const PaymentStep = ({ cart, isActive, onComplete }: PaymentStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<string>(
    cart.payment_sessions?.[0]?.provider_id || "stripe"
  )

  const isCompleted = useMemo(() => {
    return Boolean(cart?.payment_sessions?.length)
  }, [cart?.payment_sessions])

  const handleEdit = () => {
    if (onComplete) {
      onComplete()
    }
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProvider) return

    setIsSubmitting(true)
    setError(null)
    
    try {
      // First initiate payment session if not exists
      if (!cart.payment_sessions?.length) {
        await initiatePaymentSession(selectedProvider)
      }
      
      // Then set the payment method
      await setPaymentMethod(selectedProvider)
      
      if (onComplete) {
        onComplete()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedProvider, cart.payment_sessions, onComplete])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row txt-xlarge-plus-regular gap-x-2 items-baseline"
        >
          Payment
          {isCompleted && <CheckCircleSolid />}
        </Heading>
        {!isActive && cart?.payment_sessions?.length && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>

      {isActive ? (
        <div>
          {!cart.shipping_address || !cart.shipping_methods?.length ? (
            <div className="pb-8">
              <Text className="text-ui-fg-subtle">
                Please complete delivery details before selecting payment method.
              </Text>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="pb-8">
                <div className="flex flex-col gap-4">
                  {/* Stripe Payment Option */}
                  <label className="flex items-center justify-between p-4 border border-ui-border-base rounded hover:border-ui-border-interactive cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_provider"
                        value="stripe"
                        checked={selectedProvider === "stripe"}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="text-ui-fg-interactive"
                      />
                      <div>
                        <div className="txt-medium-regular text-ui-fg-base">
                          Credit Card
                        </div>
                        <div className="txt-smallall-regular text-ui-fg-subtle">
                          Pay with credit or debit card
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="txt-xsmall bg-ui-bg-subtle px-2 py-1 rounded">VISA</span>
                      <span className="txt-xsmall bg-ui-bg-subtle px-2 py-1 rounded">MC</span>
                    </div>
                  </label>

                  {/* PayPal Option (if available) */}
                  <label className="flex items-center justify-between p-4 border border-ui-border-base rounded hover:border-ui-border-interactive cursor-pointer opacity-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_provider"
                        value="paypal"
                        disabled
                        className="text-ui-fg-interactive"
                      />
                      <div>
                        <div className="txt-medium-regular text-ui-fg-base">
                          PayPal
                        </div>
                        <div className="txt-smallall-regular text-ui-fg-subtle">
                          Coming soon
                        </div>
                      </div>
                    </div>
                    <span className="txt-xsmall bg-ui-bg-subtle px-2 py-1 rounded">PayPal</span>
                  </label>
                </div>

                {/* Payment Form - For now just a placeholder */}
                {selectedProvider === "stripe" && (
                  <div className="mt-6 p-4 border border-ui-border-base rounded">
                    <div className="txt-smallall-regular text-ui-fg-subtle mb-4">
                      Payment details will be collected securely on the next step.
                    </div>
                    
                    {/* Placeholder for Stripe Elements */}
                    <div className="space-y-3">
                      <div className="h-10 bg-ui-bg-subtle rounded animate-pulse"></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-10 bg-ui-bg-subtle rounded animate-pulse"></div>
                        <div className="h-10 bg-ui-bg-subtle rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedProvider}
                    className="bg-ui-bg-interactive text-white px-8 py-3 txt-medium-regular hover:bg-ui-bg-interactive-hover disabled:opacity-50"
                    data-testid="submit-payment-button"
                  >
                    {isSubmitting ? "Processing..." : "Continue to review"}
                  </button>
                </div>

                {error && (
                  <div className="text-red-500 txt-small mt-4" data-testid="payment-error-message">
                    {error}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      ) : (
        <div>
          <div className="txt-smallall-regular">
            {cart && cart.payment_sessions?.length ? (
              <div className="flex flex-col gap-y-2">
                {cart.payment_sessions.map((session) => (
                  <div key={session.id} className="flex justify-between" data-testid="payment-method-summary">
                    <Text className="txt-medium text-ui-fg-base">
                      {session.provider_id === "stripe" ? "Credit Card" : session.provider_id}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {session.status}
                    </Text>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ui-fg-base" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-ui-border-base mt-8" />
    </div>
  )
}

export default PaymentStep