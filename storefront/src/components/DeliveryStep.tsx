import {
  useSetShippingMethod,
  useShippingOptions,
} from "@lib/hooks/useShipping";
import { Clock, MapPin, TruckFast, Loader } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Badge, Button, Heading, Text } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { convertToLocale } from "@lib/util/money";
import { calculatePriceForShippingOption } from "@lib/data/fulfillment";

interface DeliveryStepProps {
  cart: HttpTypes.StoreCart;
  onNext: () => void;
  onBack: () => void;
}

const DeliveryStep = ({ cart, onNext, onBack }: DeliveryStepProps) => {
  const {
    data: shippingOptions,
    isLoading,
    error,
  } = useShippingOptions(cart.id);
  const setShippingMethod = useSetShippingMethod();
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    cart.shipping_methods?.[0]?.shipping_option_id || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
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

    setIsLoadingPrices(true);

    const calculatedOptions = shippingOptions.filter(
      (option) => option.price_type === "calculated"
    );

    if (calculatedOptions.length === 0) {
      setIsLoadingPrices(false);
      return;
    }

    const promises = calculatedOptions.map((option) =>
      calculatePriceForShippingOption(option.id, cart.id)
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
      setIsLoadingPrices(false);
    });
  }, [shippingOptions, cart.id]);

  const handleSubmit = async () => {
    if (!selectedOptionId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await setShippingMethod.mutateAsync(selectedOptionId);
      onNext();
    } catch (error) {
      console.error("Failed to set shipping method:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (option: HttpTypes.StoreCartShippingOption) => {
    if (option.price_type === "flat") {
      return convertToLocale({
        amount: option.amount || 0,
        currency_code: cart.currency_code || "USD",
      });
    } else if (option.price_type === "calculated") {
      if (calculatedPricesMap[option.id] !== undefined) {
        return convertToLocale({
          amount: calculatedPricesMap[option.id],
          currency_code: cart.currency_code || "USD",
        });
      } else if (isLoadingPrices) {
        return <Loader className="w-4 h-4" />;
      } else {
        return "-";
      }
    }
    return "-";
  };

  const getShippingIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("express") || lowerName.includes("fast")) {
      return <Clock className="w-5 h-5 text-orange-500" />;
    }
    return <TruckFast className="w-5 h-5 text-blue-500" />;
  };

  const getDeliveryTime = (option: any) => {
    // Extract delivery time from option data or name
    if (option.data?.estimated_delivery) {
      return option.data.estimated_delivery;
    }

    const name = option.name.toLowerCase();
    if (name.includes("express")) return "1-2 business days";
    if (name.includes("standard")) return "3-5 business days";
    if (name.includes("overnight")) return "Next business day";
    if (name.includes("same day")) return "Same day";
    return "3-7 business days";
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-ui-border-base">
        <div className="flex items-center gap-3 mb-6">
          <TruckFast className="w-6 h-6 text-ui-fg-base" />
          <Heading level="h2">Delivery Options</Heading>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border border-ui-border-base rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-ui-bg-subtle rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-ui-bg-subtle rounded w-24"></div>
                    <div className="h-3 bg-ui-bg-subtle rounded w-32"></div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-ui-bg-subtle rounded w-16"></div>
                  <div className="h-3 bg-ui-bg-subtle rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg border border-ui-border-base">
        <div className="flex items-center gap-3 mb-6">
          <TruckFast className="w-6 h-6 text-ui-fg-base" />
          <Heading level="h2">Delivery Options</Heading>
        </div>
        <div className="text-center py-8">
          <Text className="text-ui-fg-error mb-4">
            Failed to load shipping options. Please try again.
          </Text>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!shippingOptions || shippingOptions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border border-ui-border-base">
        <div className="flex items-center gap-3 mb-6">
          <TruckFast className="w-6 h-6 text-ui-fg-base" />
          <Heading level="h2">Delivery Options</Heading>
        </div>
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-ui-fg-subtle mx-auto mb-4" />
          <Text className="text-ui-fg-subtle mb-4">
            No shipping options available for your location.
          </Text>
          <Text className="text-sm text-ui-fg-muted">
            Please check your shipping address or contact support.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-ui-border-base">
      <div className="flex items-center gap-3 mb-6">
        <TruckFast className="w-6 h-6 text-ui-fg-base" />
        <Heading level="h2">Choose delivery method</Heading>
      </div>

      <div className="space-y-3 mb-8">
        {shippingOptions.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isDisabled = 
            option.price_type === "calculated" &&
            !isLoadingPrices &&
            typeof calculatedPricesMap[option.id] !== "number";
          const isFree = option.price_type === "flat" && (option.amount || 0) === 0;

          return (
            <label
              key={option.id}
              className={`block transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-ui-fg-interactive ring-opacity-50"
                  : ""
              } ${
                isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              <div
                className={`flex items-center justify-between p-5 border rounded-lg hover:border-ui-border-strong transition-colors ${
                  isSelected
                    ? "border-ui-fg-interactive bg-ui-bg-subtle"
                    : "border-ui-border-base"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="radio"
                      name="shipping_option"
                      value={option.id}
                      checked={isSelected}
                      onChange={(e) => setSelectedOptionId(e.target.value)}
                      disabled={isDisabled}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-ui-fg-interactive bg-ui-fg-interactive"
                          : "border-ui-border-base bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {getShippingIcon(option.name)}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Text className="font-semibold text-ui-fg-base">
                        {option.name}
                      </Text>
                      {isFree && (
                        <Badge size="small" color="green">
                          Free
                        </Badge>
                      )}
                    </div>
                    <Text className="text-sm text-ui-fg-subtle">
                      {getDeliveryTime(option)}
                    </Text>
                    {option.data?.description && (
                      <Text className="text-xs text-ui-fg-muted mt-1">
                        {option.data.description}
                      </Text>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <Text className="font-semibold text-lg">
                    {formatPrice(option)}
                  </Text>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Shipping Address Summary */}
      {cart.shipping_address && (
        <div className="mb-8 p-4 bg-ui-bg-subtle rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-ui-fg-subtle" />
            <Text className="text-sm font-medium text-ui-fg-base">
              Delivering to:
            </Text>
          </div>
          <Text className="text-sm text-ui-fg-subtle">
            {cart.shipping_address.first_name} {cart.shipping_address.last_name}
            <br />
            {cart.shipping_address.address_1}
            {cart.shipping_address.address_2 &&
              `, ${cart.shipping_address.address_2}`}
            <br />
            {cart.shipping_address.city}, {cart.shipping_address.postal_code}
            <br />
            {cart.shipping_address.country_code?.toUpperCase()}
          </Text>
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
