import { Button } from "@/components/common/button";
import { useCompleteCartOrder } from "@/lib/hooks/dynamic/checkout/use-complete-cart";
import { isManual, isStripe } from "@/lib/utils/checkout/check-payment-method";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { HttpTypes } from "@medusajs/types";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for payment processing in the checkout flow
 * - Checkout pages: final payment submission and order completion
 * - Payment processing: secure payment method handling
 * - Order completion: final step in the checkout process
 * - Mobile commerce: mobile-optimized payment processing
 * - Payment validation: ensure all required information is collected
 *
 * ECOMMERCE CONTEXT:
 * - Critical for order completion and conversion
 * - Essential for payment processing and security
 * - Important for user experience and checkout flow
 * - Required for order fulfillment and tracking
 * - Used in payment method validation
 * - Important for mobile commerce experience
 *
 * PAYMENT BUTTON FEATURES:
 * - Payment method detection (Stripe, Manual, etc.)
 * - Order completion and processing
 * - Error handling and user feedback
 * - Loading states during payment processing
 * - Navigation to order confirmation
 * - Payment validation and requirements
 *
 * PAYMENT METHODS:
 * - Stripe payments: secure card processing
 * - Manual payments: alternative payment methods
 * - Payment validation: ensure all required fields
 *
 * COMMON PATTERNS:
 * - Checkout payment processing
 * - Mobile payment processing
 * - Payment method selection
 * - Order completion
 * - Payment error handling
 *
 * EXAMPLES:
 * - <PaymentButton cart={cart} />
 * - <PaymentButton cart={cart} className="w-full" />
 * - Checkout payment processing
 * - Mobile payment processing
 */
type PaymentButtonProps = {
  cart: HttpTypes.StoreCart;
  className?: string;
};

const PaymentButton = ({ cart, className }: PaymentButtonProps) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1;

  const paymentSession = cart.payment_collection?.payment_sessions?.[0];

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return <StripePaymentButton notReady={notReady} className={className} />;
    case isManual(paymentSession?.provider_id):
      return <ManualPaymentButton notReady={notReady} className={className} />;
    default:
      return <Button disabled>Select a payment method</Button>;
  }
};

const StripePaymentButton = ({
  notReady,
  className,
}: {
  notReady: boolean;
  className?: string;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const completeOrderMutation = useCompleteCartOrder();

  const handlePayment = async () => {
    setErrorMessage(null);

    try {
      // For demo purposes, we'll complete the order directly
      // In production, you'd integrate with Stripe's confirmCardPayment
      const order = await completeOrderMutation.mutateAsync();

      // Navigate to order confirmation
      navigate({
        to: `/${countryCode}/order/${order.id}/confirmed` as any,
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Payment failed"
      );
    }
  };

  return (
    <>
      <Button
        disabled={notReady || completeOrderMutation.isPending}
        onClick={handlePayment}
        data-testid="place-order-button"
        className={className}
      >
        Place Order
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
    </>
  );
};

const ManualPaymentButton = ({
  notReady,
  className,
}: {
  notReady: boolean;
  className?: string;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const completeOrderMutation = useCompleteCartOrder();

  const handlePayment = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const order = await completeOrderMutation.mutateAsync();

      // Navigate to order confirmation
      navigate({
        to: `/${countryCode}/order/${order.id}/confirmed` as any,
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to place order"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        disabled={notReady || submitting}
        onClick={handlePayment}
        data-testid="place-order-button"
        className={className}
      >
        Place Order
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
    </>
  );
};

export default PaymentButton;
