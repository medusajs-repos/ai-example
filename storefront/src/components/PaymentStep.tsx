import PaymentContainer from "@components/checkout/PaymentContainer";
import StripeCardContainer from "@components/checkout/StripeCardContainer";
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants";
import { initiatePaymentSession } from "@lib/data/cart";
import { usePaymentMethods } from "@lib/hooks/usePayment";
import { CheckCircleSolid, CreditCard, Loader } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Button, Heading, Text } from "@medusajs/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

interface PaymentStepProps {
  cart: HttpTypes.StoreCart;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep = ({ cart, onNext, onBack }: PaymentStepProps) => {
  const queryClient = useQueryClient();

  // Fetch available payment methods from API
  const {
    data: availablePaymentMethods = [],
    isLoading: isLoadingPaymentMethods,
    error: paymentMethodsError,
  } = usePaymentMethods(cart.region?.id);

  const activeSession =
    cart.payment_collection?.payment_sessions?.find(
      (paymentSession: any) => paymentSession.status === "pending"
    ) ||
    cart.payment_sessions?.find((session: any) => session.status === "pending");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  );

  // Update selected payment method when payment methods are loaded
  useEffect(() => {
    if (!selectedPaymentMethod && availablePaymentMethods?.length > 0) {
      setSelectedPaymentMethod(availablePaymentMethods[0].id);
    }
  }, [availablePaymentMethods, selectedPaymentMethod]);

  const isStripe = isStripeFunc(selectedPaymentMethod);

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0;

  const paymentReady =
    (activeSession && cart?.shipping_methods?.length !== 0) || paidByGiftcard;

  const isCompleted = useMemo(() => {
    return Boolean(activeSession);
  }, [activeSession]);

  const handlePaymentMethodChange = async (method: string) => {
    setError(null);
    setSelectedPaymentMethod(method);

    if (isStripeFunc(method)) {
      try {
        await initiatePaymentSession(method);
        // Refresh cart data after initiating payment session
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initiate payment session"
        );
      }
    }
  };

  const handleEdit = () => {
    // This would be handled by parent component in a step-based flow
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedPaymentMethod) return;

    setIsLoading(true);
    setError(null);

    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession;
      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod;

      if (!checkActiveSession) {
        await initiatePaymentSession(selectedPaymentMethod);
        // Refresh cart data
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }

      if (!shouldInputCard) {
        // Move to next step (review)
        onNext();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPaymentMethod, activeSession, onNext, queryClient]);

  useEffect(() => {
    setError(null);
  }, []);

  // Loading state for payment methods
  if (isLoadingPaymentMethods) {
    return (
      <div className="bg-white p-8 rounded-lg border border-ui-border-base">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-ui-fg-base" />
          <Heading level="h2">Payment</Heading>
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border border-ui-border-base rounded">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-ui-bg-subtle rounded-full"></div>
                  <div className="h-4 bg-ui-bg-subtle rounded w-24"></div>
                </div>
                <div className="w-6 h-6 bg-ui-bg-subtle rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (paymentMethodsError) {
    return (
      <div className="bg-white p-8 rounded-lg border border-ui-border-base">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-ui-fg-base" />
          <Heading level="h2">Payment</Heading>
        </div>
        <div className="text-center py-8">
          <Text className="text-ui-fg-error mb-4">
            Failed to load payment methods. Please try again.
          </Text>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!cart.shipping_address || !cart.shipping_methods?.length) {
    return (
      <div className="bg-white p-8 rounded-lg border border-ui-border-base">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-ui-fg-base" />
          <Heading level="h2">Payment</Heading>
        </div>
        <div className="text-center py-8">
          <Text className="text-ui-fg-subtle mb-4">
            Please complete delivery details before selecting payment method.
          </Text>
          <Button variant="secondary" onClick={onBack}>
            ← Back to Delivery
          </Button>
        </div>
      </div>
    );
  }

  if (!availablePaymentMethods?.length) {
    return (
      <div className="bg-white p-8 rounded-lg border border-ui-border-base">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-ui-fg-base" />
          <Heading level="h2">Payment</Heading>
        </div>
        <div className="text-center py-8">
          <Text className="text-ui-fg-subtle mb-4">
            No payment methods available for your region.
          </Text>
          <Button variant="secondary" onClick={onBack}>
            ← Back to Delivery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-ui-border-base">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Payment
          {isCompleted && <CheckCircleSolid />}
        </Heading>
        {isCompleted && (
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

      <div>
        {!paidByGiftcard && availablePaymentMethods?.length && (
          <>
            <div className="space-y-3 mb-6">
              {availablePaymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.id}>
                  {isStripeFunc(paymentMethod.id) ? (
                    <StripeCardContainer
                      paymentProviderId={paymentMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                      paymentInfoMap={paymentInfoMap}
                      setCardBrand={setCardBrand}
                      setError={setError}
                      setCardComplete={setCardComplete}
                      onSelect={() =>
                        handlePaymentMethodChange(paymentMethod.id)
                      }
                    />
                  ) : (
                    <PaymentContainer
                      paymentInfoMap={paymentInfoMap}
                      paymentProviderId={paymentMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                      onClick={() =>
                        handlePaymentMethodChange(paymentMethod.id)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {paidByGiftcard && (
          <div className="flex flex-col w-1/3 mb-6">
            <Text className="txt-medium-plus text-ui-fg-base mb-1">
              Payment method
            </Text>
            <Text
              className="txt-medium text-ui-fg-subtle"
              data-testid="payment-method-summary"
            >
              Gift card
            </Text>
          </div>
        )}

        {error && (
          <div
            className="text-red-500 text-sm mb-4"
            data-testid="payment-method-error-message"
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={onBack} disabled={isLoading}>
            ← Back to Delivery
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard) ||
              isLoading
            }
            data-testid="submit-payment-button"
            className="min-w-[180px]"
          >
            {isLoading ? (
              <Loader className="w-4 h-4" />
            ) : !activeSession && isStripeFunc(selectedPaymentMethod) ? (
              "Enter card details"
            ) : (
              "Continue to review →"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
