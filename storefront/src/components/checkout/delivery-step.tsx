import {
  useSetShippingMethod,
  useShippingOptions,
} from "@/lib/hooks/dynamic/use-shipping";
import { MapPin, TruckFast } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Button, Heading, Text } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment";
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
  const setShippingMethod = useSetShippingMethod();
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    cart.shipping_methods?.[0]?.shipping_option_id || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, number>>({});

  useEffect(() => {
    // Auto-select first option if none selected and options are available
    if (!selectedOptionId && shippingOptions && shippingOptions.length > 0) {
      setSelectedOptionId(shippingOptions[0].id);
    }
  }, [shippingOptions, selectedOptionId]);

  // Calculate prices for calculated shipping options
  useEffect(() => {
    if (!shippingOptions?.length) return;


    const calculatedOptions = shippingOptions.filter(
      (option) => option.price_type === "calculated"
    );

    if (calculatedOptions.length === 0) {
      return;
    }

    const promises = calculatedOptions.map((option) =>
      calculatePriceForShippingOption({ option_id: option.id, cart_id: cart.id })
    );

    Promise.allSettled(promises).then((results) => {
      const pricesMap: Record<string, number> = {};
      results
        .filter((result) => result.status === "fulfilled" && result.value)
        .forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            pricesMap[result.value.id] = result.value.amount || 0;
          }
        });

      setCalculatedPricesMap(pricesMap);
    });
  }, [shippingOptions, cart.id]);

  const handleSubmit = async () => {
    if (!selectedOptionId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await setShippingMethod.mutateAsync({ shipping_option_id: selectedOptionId });
      onNext();
    } catch (error) {
      console.error("Failed to set shipping method:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-ui-border-base">
      <div className="flex items-center gap-3 mb-6">
        <TruckFast className="text-ui-fg-base" />
        <Heading level="h2">Choose delivery method</Heading>
      </div>

      <div className="space-y-3 mb-8">
        {shippingOptions?.map((option) => (
          <ShippingItemSelector
            key={option.id}
            shippingOption={option}
            isSelected={selectedOptionId === option.id}
            handleSelect={setSelectedOptionId}
            currencyCode={cart.currency_code}
            calculatedPrice={calculatedPricesMap[option.id]}
          />
        ))}
      </div>

      {/* Shipping Address Summary */}
      {cart.shipping_address && (
        <div className="mb-8 p-4 bg-ui-bg-subtle rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-ui-fg-subtle" />
            <Text className="txt-small-plus text-ui-fg-base">
              Delivering to:
            </Text>
          </div>
          <Address address={cart.shipping_address} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
          ← Back to Address
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedOptionId || isSubmitting}
          isLoading={isSubmitting}
          className="min-w-[180px]"
        >
          {isSubmitting ? "Saving..." : "Continue to Payment →"}
        </Button>
      </div>
    </div>
  );
};

export default DeliveryStep;
