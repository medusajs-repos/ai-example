import { HttpTypes } from "@medusajs/types"
import { Badge, Text } from "@medusajs/ui"
import { Price } from "@/components/common/price"
import { Loading } from "@/components/common"
import { getShippingIcon } from "@/lib/utils/checkout/get-shipping-icon"
import { useEffect, useState } from "react"
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment"

type ShippingItemSelectorProps = {
  shippingOption: HttpTypes.StoreCartShippingOption
  cart: HttpTypes.StoreCart
  isSelected: boolean
  handleSelect: (optionId: string) => void
}

const ShippingItemSelector = ({ 
  shippingOption, 
  cart,
  isSelected, 
  handleSelect, 
}: ShippingItemSelectorProps) => {
  const [calculatedPrice, setCalculatedPrice] = useState<number | undefined>(undefined);
  const isDisabled = 
    shippingOption.price_type === "calculated" &&
    typeof calculatedPrice !== "number";
  const isFree = shippingOption.price_type === "flat" && (shippingOption.amount || 0) === 0;
  const price = shippingOption.price_type === "calculated" ? calculatedPrice : shippingOption.amount;

  useEffect(() => {
    if (shippingOption.price_type !== "calculated") {
      return
    }

    calculatePriceForShippingOption({ 
      option_id: shippingOption.id, 
      cart_id: cart.id
    }).then((option) => {
      setCalculatedPrice(option.amount);
    });
  }, [shippingOption.price_type]);

  return (
    <label
      className={`block transition-all duration-200 rounded-lg ${
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
              value={shippingOption.id}
              checked={isSelected}
              onChange={() => handleSelect(shippingOption.id)}
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

          {getShippingIcon(shippingOption)}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Text className="txt-medium-plus text-ui-fg-base">
                {shippingOption.name}
              </Text>
              {isFree && (
                <Badge size="small" color="green">
                  Free
                </Badge>
              )}
            </div>
            {shippingOption.data?.description !== undefined && (
              <Text className="txt-xsmall text-ui-fg-muted mt-1">
                {shippingOption.data.description as string}
              </Text>
            )}
          </div>
        </div>

        <div className="text-right">
          {price ? 
            <Price
              price={price} 
              currencyCode={cart.currency_code} 
              textClassName="txt-medium-plus"
            /> : <Loading className="w-4 h-4" rows={1} />}
        </div>
      </div>
    </label>
  );
}

export default ShippingItemSelector