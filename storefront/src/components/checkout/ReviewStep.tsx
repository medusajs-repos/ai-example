import { useCompleteOrder } from "@lib/hooks/useCart";
import { CheckCircleSolid } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Heading } from "@medusajs/ui";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

interface ReviewStepProps {
  cart: HttpTypes.StoreCart;
  isActive: boolean;
  countryCode?: string | null;
}

const ReviewStep = ({ cart, isActive, countryCode }: ReviewStepProps) => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const completeOrder = useCompleteOrder();

  const handleCompleteOrder = useCallback(async () => {
    setError(null);

    try {
      // Use the hook which will automatically clear cache on success
      const order = await completeOrder.mutateAsync(undefined, {
        context: { regionId: cart.region?.id }
      });
      
      // Navigate to order confirmation page
      const baseHref = countryCode ? `/${countryCode}` : '';
      navigate({ 
        to: `${baseHref}/order/${order.id}/confirmed` as any,
        replace: true 
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while completing your order"
      );
    }
  }, [navigate, countryCode, completeOrder, cart.region?.id]);

  const canCompleteOrder = Boolean(
    cart.shipping_address &&
      cart.shipping_methods?.length &&
      cart.payment_sessions?.length &&
      cart.items?.length
  );

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Review
          {isActive && canCompleteOrder && <CheckCircleSolid />}
        </Heading>
      </div>

      {isActive ? (
        <div>
          {!canCompleteOrder ? (
            <div className="pb-8">
              <div className="text-ui-fg-subtle text-small-regular">
                Please complete all previous steps to review your order.
              </div>

              {/* Show what's missing */}
              <div className="mt-4 space-y-2">
                {!cart.shipping_address && (
                  <div className="text-red-500 text-small-regular">
                    • Shipping address required
                  </div>
                )}
                {!cart.shipping_methods?.length && (
                  <div className="text-red-500 text-small-regular">
                    • Delivery method required
                  </div>
                )}
                {!cart.payment_sessions?.length && (
                  <div className="text-red-500 text-small-regular">
                    • Payment method required
                  </div>
                )}
                {!cart.items?.length && (
                  <div className="text-red-500 text-small-regular">
                    • Cart is empty
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="pb-8">
              <div className="text-small-regular text-ui-fg-subtle mb-6">
                By clicking "Complete order" you agree to our terms and
                conditions.
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Items */}
                <div>
                  <h3 className="text-base-semi text-ui-fg-base mb-4">Items</h3>
                  <div className="space-y-3">
                    {cart.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 flex-shrink-0">
                          {item.variant?.product?.thumbnail ||
                          item.thumbnail ? (
                            <img
                              src={
                                item.variant?.product?.thumbnail ||
                                item.thumbnail ||
                                ""
                              }
                              alt={item.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-ui-bg-subtle rounded flex items-center justify-center">
                              <span className="text-xs text-ui-fg-muted">
                                No image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-base-regular text-ui-fg-base">
                            {item.title}
                          </div>
                          {item.variant && item.variant.title !== "Default" && (
                            <div className="text-small-regular text-ui-fg-subtle">
                              {item.variant.title}
                            </div>
                          )}
                          <div className="text-small-regular text-ui-fg-subtle">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                        <div className="text-base-regular text-ui-fg-base">
                          {item.total
                            ? `$${item.total.toFixed(2)}`
                            : `$${(
                                (item.unit_price || 0) * item.quantity
                              ).toFixed(2)}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery */}
                {cart.shipping_address && (
                  <div>
                    <h3 className="text-base-semi text-ui-fg-base mb-4">
                      Delivery
                    </h3>
                    <div className="text-small-regular text-ui-fg-base">
                      <div>
                        {cart.shipping_address.first_name}{" "}
                        {cart.shipping_address.last_name}
                      </div>
                      <div>
                        {cart.shipping_address.address_1}{" "}
                        {cart.shipping_address.address_2}
                      </div>
                      <div>
                        {cart.shipping_address.postal_code},{" "}
                        {cart.shipping_address.city}
                      </div>
                      <div>
                        {cart.shipping_address.country_code?.toUpperCase()}
                      </div>
                      {cart.shipping_methods?.[0] && (
                        <div className="mt-2 text-ui-fg-subtle">
                          via {cart.shipping_methods[0].name}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment */}
                {cart.payment_sessions?.length && (
                  <div>
                    <h3 className="text-base-semi text-ui-fg-base mb-4">
                      Payment
                    </h3>
                    <div className="text-small-regular text-ui-fg-base">
                      {cart.payment_sessions[0].provider_id === "stripe"
                        ? "Credit Card"
                        : cart.payment_sessions[0].provider_id}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handleCompleteOrder}
                  disabled={completeOrder.isPending}
                  className="bg-ui-bg-interactive text-white px-8 py-3 text-base-regular hover:bg-ui-bg-interactive-hover disabled:opacity-50"
                  data-testid="complete-order-button"
                >
                  {completeOrder.isPending ? "Processing..." : "Complete order"}
                </button>
              </div>

              {error && (
                <div
                  className="text-red-500 text-sm mt-4"
                  data-testid="review-error-message"
                >
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ReviewStep;
