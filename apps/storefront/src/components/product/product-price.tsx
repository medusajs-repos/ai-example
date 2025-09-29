import { getProductPrice } from "@/lib/utils/price/get-product-price"
import { HttpTypes } from "@medusajs/types"
import Loading from "@/components/common/loading"
import { Price, PriceProps } from "@/components/common/price"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for displaying product pricing in the storefront
 * - Product detail pages: show current price with variant selection
 * - Product cards: display price ranges for products with variants
 * - Search results: display product pricing information
 * 
 * ECOMMERCE CONTEXT:
 * - Essential for product pricing display and comparison
 * - Critical for variant-specific pricing
 * - Important for sale/discount pricing display
 * - Required for price range display (from $X)
 * 
 * PRICING FEATURES:
 * - Variant-specific pricing when variant is selected
 * - Price range display ("From $X") when no variant selected
 * - Sale price display with original price strikethrough
 * - Discount percentage calculation and display
 * - Currency formatting based on region
 * - Loading states during price calculation
 * 
 * PRICE TYPES:
 * - "default": Standard pricing for selected variant
 * - "range": "From $X" pricing for product variants
 * - Handles sale pricing with original price display
 * 
 * EXAMPLES:
 * - <ProductPrice product={product} variant={selectedVariant} />
 * - <ProductPrice product={product} priceProps={{textSize: "large"}} />
 * - <ProductPrice product={product} variant={variant} className="text-center" />
 */

export default function ProductPrice({
  product,
  variant,
  className,
  priceProps,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  className?: string
  priceProps?: Partial<PriceProps>
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variant_id: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <Loading rows={1} />
  }

  return (
    <Price
      price={selectedPrice.calculated_price}
      currencyCode={selectedPrice.currency_code}
      type={variant ? "default" : "range"}
      className={className}
      originalPrice={selectedPrice.price_type === "sale" ? {
        price: selectedPrice.original_price,
        percentage: selectedPrice.percentage_diff,
      } : undefined}
      {...priceProps}
    />
  )
}