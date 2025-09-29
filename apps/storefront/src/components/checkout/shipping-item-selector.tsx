import { HttpTypes } from "@medusajs/types"
import { Price } from "@/components/common/price"
import Loading from "@/components/common/loading"
import { useEffect, useState } from "react"
import { calculatePriceForShippingOption } from "@/lib/data/checkout/shipping"
import Radio from "@/components/common/radio"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for shipping method selection in the storefront
 * - Checkout pages: shipping method selection and configuration
 * - Delivery options: shipping method display and selection
 * - Mobile commerce: mobile-optimized shipping selection
 * - Shipping calculation: display shipping costs and options
 * - International commerce: shipping options for different regions
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for shipping cost calculation and display
 * - Essential for delivery time estimation and communication
 * - Important for international shipping and compliance
 * - Required for order fulfillment and tracking
 * - Used in shipping cost optimization
 * - Important for mobile commerce experience
 * 
 * SHIPPING SELECTOR FEATURES:
 * - Shipping method display and selection
 * - Shipping cost calculation and display
 * - Delivery time estimation and communication
 * - International shipping options
 * - Shipping method validation and error handling
 * - Responsive design for mobile/desktop
 * 
 * SHIPPING OPTIONS:
 * - Standard shipping: regular delivery times
 * - Express shipping: faster delivery options
 * - Economy shipping: cost-effective delivery
 * - International shipping: cross-border delivery
 * - Free shipping: promotional shipping options
 * 
 * COMMON PATTERNS:
 * - Checkout shipping selection
 * - Mobile shipping selection
 * - International shipping options
 * - Shipping cost display
 * - Delivery time estimation
 * 
 * EXAMPLES:
 * - <ShippingItemSelector shippingOption={option} cart={cart} isSelected={selected} handleSelect={handleSelect} />
 * - Checkout shipping selection
 * - Mobile shipping options
 * - International shipping handling
 */

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
  const [calculatedPrice, setCalculatedPrice] = useState<number | undefined>(undefined)
  const isDisabled = 
    shippingOption.price_type === "calculated" &&
    typeof calculatedPrice !== "number"
  const price = shippingOption.price_type === "calculated" ? calculatedPrice : shippingOption.amount

  useEffect(() => {
    if (shippingOption.price_type !== "calculated") {
      return
    }

    calculatePriceForShippingOption({ 
      option_id: shippingOption.id, 
    }).then((option) => {
      setCalculatedPrice(option.amount)
    })
  }, [shippingOption.price_type])

  return (
    <label
      className={`block transition-all duration-200 ${
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <div
        className={`flex items-center justify-between p-5 border transition-colors ${
          isSelected
            ? "border-primary-text bg-secondary-bg"
            : "border-primary-border hover:border-primary-border-strong"
        }`}
      >
        <div className="flex items-center gap-4">
          <Radio 
            checked={isSelected}
            onChange={() => handleSelect(shippingOption.id)}
            disabled={isDisabled}
          />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="txt-medium-plus text-primary-text">
                {shippingOption.name}
              </p>
            </div>
            {shippingOption.data?.description !== undefined && (
              <p className="txt-xsmall text-secondary-text mt-1">
                {shippingOption.data.description as string}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          {price ? 
            <Price
              price={price} 
              currencyCode={cart.currency_code} 
              textWeight="plus"
            /> : <Loading className="w-4 h-4" rows={1} />}
        </div>
      </div>
    </label>
  )
}

export default ShippingItemSelector