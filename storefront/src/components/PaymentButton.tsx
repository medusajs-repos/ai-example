import { completeCart } from "@/lib/data/cart";
import { isManual, isStripe } from "@lib/constants";
import { useCompleteOrder } from "@lib/hooks/useCart";
import { getCountryCodeFromPath } from "@lib/util/regions";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart;
};

const PaymentButton = ({ cart }: PaymentButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);

  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1;

  const paymentSession =
    cart.payment_collection?.payment_sessions?.[0] ||
    cart.payment_sessions?.[0];

  // For now, we'll implement a simple payment button that works with manual payments
  // In production, you'd want to integrate with Stripe Elements for card payments
  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return <StripePaymentButton notReady={notReady} cart={cart} />;
    case isManual(paymentSession?.provider_id):
      return <ManualPaymentButton notReady={notReady} cart={cart} />;
    default:
      return <Button disabled>Select a payment method</Button>;
  }
};

const StripePaymentButton = ({
  cart,
  notReady,
}: {
  cart: HttpTypes.StoreCart;
  notReady: boolean;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const completeOrder = useCompleteOrder();

  const handlePayment = async () => {
    setErrorMessage(null);

    try {
      // For demo purposes, we'll complete the order directly
      // In production, you'd integrate with Stripe's confirmCardPayment
      const order = await completeOrder.mutateAsync();

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
        disabled={notReady}
        onClick={handlePayment}
        size="large"
        isLoading={completeOrder.isPending}
        className="min-w-[200px]"
        data-testid="place-order-button"
      >
        Place Order
      </Button>
      {errorMessage && (
        <div className="text-red-500 txt-small mt-2">{errorMessage}</div>
      )}
    </>
  );
};

const ManualPaymentButton = ({
  cart,
  notReady,
}: {
  cart: HttpTypes.StoreCart;
  notReady: boolean;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);

  const handlePayment = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const order = await completeCart();

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
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        className="min-w-[200px]"
        data-testid="place-order-button"
      >
        Place Order
      </Button>
      {errorMessage && (
        <div className="text-red-500 txt-small mt-2">{errorMessage}</div>
      )}
    </>
  );
};

export default PaymentButton;
