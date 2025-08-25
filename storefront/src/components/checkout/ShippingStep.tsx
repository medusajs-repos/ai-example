import { setShippingMethod } from "@lib/data/cart";
import { CheckCircleSolid } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Heading, Text } from "@medusajs/ui";
import { useCallback, useMemo, useState } from "react";

interface ShippingStepProps {
  cart: HttpTypes.StoreCart;
  isActive: boolean;
  onComplete?: () => void;
}

const ShippingStep = ({ cart, isActive, onComplete }: ShippingStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>(
    cart.shipping_methods?.[0]?.shipping_option_id || ""
  );

  const isCompleted = useMemo(() => {
    return Boolean(cart?.shipping_methods?.length);
  }, [cart?.shipping_methods]);

  const handleEdit = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedOption) return;

      setIsSubmitting(true);
      setError(null);

      try {
        await setShippingMethod(selectedOption);
        if (onComplete) {
          onComplete();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedOption, onComplete]
  );

  const availableShippingOptions = cart.shipping_options || [];

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Delivery
          {isCompleted && <CheckCircleSolid />}
        </Heading>
        {!isActive && cart?.shipping_methods?.length && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-delivery-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>

      {isActive ? (
        <div>
          {!cart.shipping_address ? (
            <div className="pb-8">
              <Text className="text-ui-fg-subtle">
                Please provide a shipping address before selecting delivery
                options.
              </Text>
            </div>
          ) : availableShippingOptions.length === 0 ? (
            <div className="pb-8">
              <Text className="text-ui-fg-subtle">
                No delivery options available for your address.
              </Text>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="pb-8">
                <div className="flex flex-col gap-4">
                  {availableShippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between p-4 border border-ui-border-base rounded hover:border-ui-border-interactive cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_option"
                          value={option.id}
                          checked={selectedOption === option.id}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          className="text-ui-fg-interactive"
                        />
                        <div>
                          <div className="text-base-regular text-ui-fg-base">
                            {option.name}
                          </div>
                          {option.data?.description && (
                            <div className="text-small-regular text-ui-fg-subtle">
                              {option.data.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-base-regular text-ui-fg-base">
                        {option.amount
                          ? `$${option.amount.toFixed(2)}`
                          : "Free"}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedOption}
                    className="bg-ui-bg-interactive text-white px-8 py-3 text-base-regular hover:bg-ui-bg-interactive-hover disabled:opacity-50"
                    data-testid="submit-delivery-button"
                  >
                    {isSubmitting ? "Processing..." : "Continue to payment"}
                  </button>
                </div>

                {error && (
                  <div
                    className="text-red-500 text-sm mt-4"
                    data-testid="delivery-error-message"
                  >
                    {error}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_methods?.length ? (
              <div className="flex flex-col gap-y-2">
                {cart.shipping_methods.map((method) => (
                  <div
                    key={method.id}
                    className="flex justify-between"
                    data-testid="delivery-option-summary"
                  >
                    <Text className="txt-medium text-ui-fg-base">
                      {method.name}
                    </Text>
                    <Text className="txt-medium text-ui-fg-base">
                      {method.amount ? `$${method.amount.toFixed(2)}` : "Free"}
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
  );
};

export default ShippingStep;
