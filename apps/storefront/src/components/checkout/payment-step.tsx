import PaymentContainer from "@/components/checkout/payment-container";
import StripeCardContainer from "@/components/checkout/stripe-card-container";
import { Button } from "@/components/common/button";
import {
  useCartPaymentMethods,
  useInitiateCartPaymentSession,
} from "@/lib/hooks/dynamic/checkout/use-payment";
import { isStripe as isStripeFunc } from "@/lib/utils/checkout/check-payment-method";
import { getActivePaymentSession } from "@/lib/utils/checkout/get-active-payment-session";
import { isPaidWithGiftCard } from "@/lib/utils/checkout/is-paid-with-gift-card";
import { HttpTypes } from "@medusajs/types";
import { useCallback, useEffect, useState } from "react";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for payment method selection in the checkout flow
 * - Checkout pages: payment method selection and configuration
 * - Mobile commerce: mobile-optimized payment selection
 * - Payment processing: secure payment method handling
 * - International commerce: region-specific payment methods
 * - Gift card payments: gift card and promotional payment handling
 *
 * ECOMMERCE CONTEXT:
 * - Essential in the checkout flow to choose a payment method
 * - Critical for payment processing and security
 * - Important for payment method compliance and regulations
 * - Required for international payment processing
 * - Used in payment security and fraud prevention
 * - Important for mobile commerce experience
 *
 * PAYMENT STEP FEATURES:
 * - Payment method selection and display
 * - Secure payment processing integration
 * - Payment method validation and error handling
 * - International payment method support
 * - Responsive design for mobile/desktop
 *
 * COMMON PATTERNS:
 * - Checkout payment selection
 * - Mobile payment processing
 * - International payment methods
 * - Gift card payment handling
 * - Payment security and validation
 *
 * EXAMPLES:
 * - <PaymentStep cart={cart} onNext={handleNext} onBack={handleBack} />
 * - Checkout payment selection
 * - Mobile payment processing
 * - International payment handling
 */

interface PaymentStepProps {
  cart: HttpTypes.StoreCart;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep = ({ cart, onNext, onBack }: PaymentStepProps) => {
  const { data: availablePaymentMethods = [] } = useCartPaymentMethods({
    region_id: cart.region?.id,
  });
  const initiatePaymentSessionMutation = useInitiateCartPaymentSession();

  const activeSession = getActivePaymentSession(cart);

  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  );

  // Update selected payment method when payment methods are loaded
  useEffect(() => {
    if (!selectedPaymentMethod && availablePaymentMethods?.length > 0) {
      setSelectedPaymentMethod(availablePaymentMethods[0].id);
      handlePaymentMethodChange(availablePaymentMethods[0].id);
    }
  }, [availablePaymentMethods, selectedPaymentMethod]);

  const isStripe = isStripeFunc(selectedPaymentMethod);

  const paidByGiftcard = isPaidWithGiftCard(cart);

  const initiatePaymentSession = useCallback(
    async (method: string) => {
      initiatePaymentSessionMutation.mutateAsync(
        { provider_id: method },
        {
          onError: (error) => {
            setError(
              error instanceof Error ? error.message : "An error occurred"
            );
          },
        }
      );
    },
    [initiatePaymentSessionMutation]
  );

  const handlePaymentMethodChange = async (method: string) => {
    setError(null);
    setSelectedPaymentMethod(method);

    initiatePaymentSession(method);
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedPaymentMethod) return;

    if (!activeSession) {
      await initiatePaymentSession(selectedPaymentMethod);
    }

    onNext();
  }, [selectedPaymentMethod, activeSession, onNext, initiatePaymentSession]);

  return (
    <div className="flex flex-col gap-8">
      {!paidByGiftcard && (availablePaymentMethods?.length ?? 0) > 0 && (
        <>
          {availablePaymentMethods.length === 0 && (
            <p className="text-base font-medium text-secondary-text">
              No payment methods available
            </p>
          )}
          {availablePaymentMethods.map((paymentMethod) => (
            <div key={paymentMethod.id}>
              <PaymentContainer
                paymentProviderId={paymentMethod.id}
                selectedPaymentOptionId={selectedPaymentMethod}
                onClick={() => handlePaymentMethodChange(paymentMethod.id)}
              >
                {isStripeFunc(paymentMethod.id) && (
                  <StripeCardContainer
                    paymentProviderId={paymentMethod.id}
                    selectedPaymentOptionId={selectedPaymentMethod}
                    setError={setError}
                    onSelect={() => handlePaymentMethodChange(paymentMethod.id)}
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
          <p className="text-base font-medium-plus text-primary-text mb-1">
            Payment method
          </p>
          <p
            className="text-base font-medium-plus text-secondary-text"
            data-testid="payment-method-summary"
          >
            Gift card
          </p>
        </div>
      )}

      {error && (
        <div
          className="text-error-text text-sm"
          data-testid="payment-method-error-message"
        >
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={initiatePaymentSessionMutation.isPending}
        >
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
          {!activeSession && isStripeFunc(selectedPaymentMethod)
            ? "Enter card details"
            : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
