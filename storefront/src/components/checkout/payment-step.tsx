import PaymentContainer from "@/components/checkout/payment-container"
import StripeCardContainer from "@/components/checkout/stripe-card-container"
import { isStripe as isStripeFunc } from "@/lib/utils/checkout/check-payment-method"
import { 
  useInitiateCartPaymentSession, 
  useCartPaymentMethods
} from "@/lib/hooks/dynamic/checkout/use-payment"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@/components/common/button"
import { useCallback, useEffect, useState } from "react"
import { getActivePaymentSession } from "@/lib/utils/checkout/get-active-payment-session"
import { isPaidWithGiftCard } from "@/lib/utils/checkout/is-paid-with-gift-card"

interface PaymentStepProps {
  cart: HttpTypes.StoreCart;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep = ({ cart, onNext, onBack }: PaymentStepProps) => {
  const {
    data: availablePaymentMethods = [],
  } = useCartPaymentMethods({ region_id: cart.region?.id })
  const initiatePaymentSessionMutation = useInitiateCartPaymentSession()

  const activeSession = getActivePaymentSession(cart)

  const [error, setError] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  // Update selected payment method when payment methods are loaded
  useEffect(() => {
    if (!selectedPaymentMethod && availablePaymentMethods?.length > 0) {
      setSelectedPaymentMethod(availablePaymentMethods[0].id)
      handlePaymentMethodChange(availablePaymentMethods[0].id)
    }
  }, [availablePaymentMethods, selectedPaymentMethod])

  const isStripe = isStripeFunc(selectedPaymentMethod)

  const paidByGiftcard = isPaidWithGiftCard(cart)

  const initiatePaymentSession = useCallback(async (method: string) => {
    initiatePaymentSessionMutation.mutateAsync({ provider_id: method }, {
      onError: (error) => {
        setError(error instanceof Error ? error.message : "An error occurred")
      }
    })
  }, [initiatePaymentSessionMutation])

  const handlePaymentMethodChange = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)

    initiatePaymentSession(method)
  }

  const handleSubmit = useCallback(async () => {
    if (!selectedPaymentMethod) return

    if (!activeSession) {
      await initiatePaymentSession(selectedPaymentMethod)
    }

    onNext()
  }, [selectedPaymentMethod, activeSession, onNext, initiatePaymentSession])

  return (
    <div className="flex flex-col gap-8">
      {!paidByGiftcard && (availablePaymentMethods?.length ?? 0) > 0 && (
        <>
          {availablePaymentMethods.length === 0 && (
            <p className="txt-medium text-secondary-text">
              No payment methods available
            </p>
          )}
          {availablePaymentMethods.map((paymentMethod) => (
            <div key={paymentMethod.id}>
              <PaymentContainer
                paymentProviderId={paymentMethod.id}
                selectedPaymentOptionId={selectedPaymentMethod}
                onClick={() =>
                  handlePaymentMethodChange(paymentMethod.id)
                }
              >
                {isStripeFunc(paymentMethod.id) && (
                  <StripeCardContainer
                    paymentProviderId={paymentMethod.id}
                    selectedPaymentOptionId={selectedPaymentMethod}
                    setError={setError}
                    onSelect={() =>
                      handlePaymentMethodChange(paymentMethod.id)
                    }
                    onCardComplete={handleSubmit}
                  />
                )}
              </PaymentContainer>
            </div>
          ))}
        </>
      )}

      {paidByGiftcard && (
        <div className="flex flex-col w-1/3">
          <p className="txt-medium-plus text-primary-text mb-1">
            Payment method
          </p>
          <p
            className="txt-medium-plus text-secondary-text"
            data-testid="payment-method-summary"
          >
            Gift card
          </p>
        </div>
      )}

      {error && (
        <div
          className="text-error-text txt-small"
          data-testid="payment-method-error-message"
        >
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={onBack} disabled={initiatePaymentSessionMutation.isPending}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            (isStripe && !activeSession) ||
            (!selectedPaymentMethod && !paidByGiftcard) ||
            initiatePaymentSessionMutation.isPending
          }
          data-testid="submit-payment-button"
        >
          {!activeSession && isStripeFunc(selectedPaymentMethod) ? (
            "Enter card details"
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </div>
  )
}

export default PaymentStep
