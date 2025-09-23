import { getProductPrice } from "@/lib/utils/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { Loading } from "../common"
import { Price } from "../common/price"

export default function ProductPrice({
  product,
  variant,
  className,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  className?: string
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
    />
  )
}