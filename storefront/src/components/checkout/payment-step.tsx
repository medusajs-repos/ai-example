import PaymentContainer from "@/components/checkout/payment-container"
import StripeCardContainer from "@/components/checkout/stripe-card-container"
import { isStripe as isStripeFunc } from "@/lib/constants/constants"
import { 
  useInitiateCartPaymentSession, 
  useCartPaymentMethods
} from "@/lib/hooks/dynamic/checkout/use-payment"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text } from "@medusajs/ui"
import { useCallback, useEffect, useState } from "react"
import { getActiveSession } from "@/lib/utils/checkout/get-active-session"
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

  const activeSession = getActiveSession(cart)

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
    <div>
      <Heading level="h2" className="mb-6">
        Payment
      </Heading>

      <div>
        {!paidByGiftcard && availablePaymentMethods?.length && (
          <>
            <div className="space-y-3 mb-6">
              {availablePaymentMethods.length === 0 && (
                <Text className="txt-medium text-secondary-text">
                  No payment methods available
                </Text>
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
            </div>
          </>
        )}

        {paidByGiftcard && (
          <div className="flex flex-col w-1/3 mb-6">
            <Text className="txt-medium-plus text-primary-text mb-1">
              Payment method
            </Text>
            <Text
              className="txt-medium text-secondary-text"
              data-testid="payment-method-summary"
            >
              Gift card
            </Text>
          </div>
        )}

        {error && (
          <div
            className="text-error-text txt-small mb-4"
            data-testid="payment-method-error-message"
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
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
            isLoading={initiatePaymentSessionMutation.isPending}
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeFunc(selectedPaymentMethod) ? (
              "Enter card details"
            ) : (
              "Continue to review"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentStep
