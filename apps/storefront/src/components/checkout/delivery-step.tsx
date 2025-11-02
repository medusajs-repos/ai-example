import ShippingItemSelector from "@/components/checkout/shipping-item-selector";
import { Button } from "@/components/common/button";
import {
  useSetCartShippingMethod,
  useShippingOptions,
} from "@/lib/hooks/dynamic/checkout/use-shipping";
import { HttpTypes } from "@medusajs/types";
import { useEffect, useState } from "react";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for shipping method selection in the checkout flow
 * - Checkout pages: shipping method selection and configuration
 * - Mobile commerce: mobile-optimized shipping selection
 * - International commerce: shipping options for different regions
 * - Shipping calculation: display shipping costs and options
 * - Delivery options: express, standard, and economy shipping
 *
 * ECOMMERCE CONTEXT:
 * - Essential in the checkout flow to choose a shipping method
 * - Critical for shipping cost calculation and display
 * - Important for international shipping and compliance
 * - Used in shipping cost optimization
 * - Important for mobile commerce experience
 *
 * DELIVERY STEP FEATURES:
 * - Shipping method selection and display
 * - Shipping cost calculation and display
 * - Shipping method validation and error handling
 * - Responsive design for mobile/desktop
 *
 * COMMON PATTERNS:
 * - Checkout shipping selection
 * - Mobile shipping selection
 * - International shipping options
 * - Shipping cost display
 * - Delivery time estimation
 *
 * EXAMPLES:
 * - <DeliveryStep cart={cart} onNext={handleNext} onBack={handleBack} />
 * - Checkout shipping selection
 * - Mobile shipping options
 * - International shipping handling
 */

interface DeliveryStepProps {
  cart: HttpTypes.StoreCart;
  onNext: () => void;
  onBack: () => void;
}

const DeliveryStep = ({ cart, onNext, onBack }: DeliveryStepProps) => {
  const { data: shippingOptions } = useShippingOptions({ cart_id: cart.id });
  const setShippingMethodMutation = useSetCartShippingMethod();
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    cart.shipping_methods?.[0]?.shipping_option_id || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Auto-select first option if none selected and options are available
    if (!selectedOptionId && shippingOptions && shippingOptions.length > 0) {
      setSelectedOptionId(shippingOptions[0].id);
    }
  }, [shippingOptions, selectedOptionId]);

  const handleSubmit = async () => {
    if (!selectedOptionId || isSubmitting) return;

    setIsSubmitting(true);
    await setShippingMethodMutation.mutateAsync(
      {
        shipping_option_id: selectedOptionId,
      },
      {
        onSuccess: () => {
          onNext();
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
        onError: (error) => {
          console.error("Failed to set shipping method:", error);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        {shippingOptions?.map((option) => (
          <ShippingItemSelector
            key={option.id}
            shippingOption={option}
            isSelected={selectedOptionId === option.id}
            handleSelect={setSelectedOptionId}
            cart={cart}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedOptionId || isSubmitting}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DeliveryStep;
