import {
  useSetShippingMethod,
  useShippingOptions,
} from "@/lib/hooks/dynamic/use-shipping";
import { MapPin, TruckFast } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Button, Heading, Text, toast } from "@medusajs/ui";
import { useEffect, useState } from "react";
import ShippingItemSelector from "./shipping-item-selector";
import Address from "../common/address";

interface DeliveryStepProps {
  cart: HttpTypes.StoreCart;
  onNext: () => void;
  onBack: () => void;
}

const DeliveryStep = ({ cart, onNext, onBack }: DeliveryStepProps) => {
  const {
    data: shippingOptions,
  } = useShippingOptions({ cart_id: cart.id });
  const setShippingMethodMutation = useSetShippingMethod();
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
    await setShippingMethodMutation.mutateAsync({ 
      shipping_option_id: selectedOptionId
    }, {
      onSuccess: () => {
        onNext();
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
      onError: (error) => {
        console.error("Failed to set shipping method:", error);
        toast.error("Failed to set shipping method. Please try again.");
      }
    });
  };

  return (
    <div>
    <Heading level="h2" className="mb-6">
      Delivery
    </Heading>

      <div className="space-y-3 mb-8">
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

      {/* Shipping Address Summary */}
      {cart.shipping_address && (
        <div className="mb-8 p-4 bg-ui-bg-subtle rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-ui-fg-subtle" />
            <Text className="txt-small-plus text-ui-fg-base">
              Delivering to:
            </Text>
          </div>
          <Address address={cart.shipping_address} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedOptionId || isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Continue to Payment →"}
        </Button>
      </div>
    </div>
  );
};

export default DeliveryStep;
