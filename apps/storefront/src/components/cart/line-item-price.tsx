import { getPricePercentageDiff } from "@/lib/utils/price/get-price-precentage-diff"
import { HttpTypes } from "@medusajs/types"
import { Price } from "@/components/common/price"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for displaying line item pricing in the storefront
 * - Cart items: show individual item prices with discounts
 * - Order items: display order line item pricing
 * - Mobile commerce: mobile-optimized price display
 * - Price comparison: show original and discounted prices
 * - Discount display: highlight savings and discounts
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for price transparency and trust
 * - Essential for discount display and savings
 * - Important for user experience and decision making
 * - Required for price comparison and validation
 * - Used in promotional campaigns and discounts
 * - Important for mobile commerce experience
 * 
 * PRICE DISPLAY FEATURES:
 * - Current price display with currency formatting
 * - Original price display for discounts
 * - Discount percentage calculation and display
 * - Price comparison and savings highlighting
 * - Professional price presentation
 * - Responsive design for mobile/desktop
 * 
 * PRICE TYPES:
 * - Current price: actual price to be charged
 * - Original price: price before discounts
 * - Discount percentage: savings percentage
 * - Price comparison: original vs current
 * 
 * COMMON PATTERNS:
 * - Cart item pricing
 * - Order item pricing
 * - Mobile price display
 * - Discount price display
 * - Price comparison display
 * 
 * EXAMPLES:
 * - <LineItemPrice item={cartItem} currencyCode="USD" />
 * - <LineItemPrice item={orderItem} currencyCode="EUR" />
 * - Cart item with discount pricing
 * - Mobile price display
 */

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem;
  currencyCode: string;
  className?: string;
};

const LineItemPrice = ({
  item,
  currencyCode,
  className,
}: LineItemPriceProps) => {
  const { total, original_total } = item
  const originalPrice = original_total
  const currentPrice = total
  const hasReducedPrice = currentPrice < originalPrice

  return (
    <Price
      price={currentPrice}
      currencyCode={currencyCode}
      originalPrice={hasReducedPrice ? {
        price: originalPrice,
        percentage: getPricePercentageDiff(originalPrice, currentPrice || 0),
      } : undefined}
      className={className}
    />
  )
}

export default LineItemPrice
