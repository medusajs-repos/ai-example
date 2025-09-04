import { Link, useLocation } from "@tanstack/react-router"
import { HttpTypes } from "@medusajs/types"
import { getProductHandle, getProductImageUrl } from "@lib/util/product"
import { getProductPrice } from "@lib/util/get-product-price"
import { getCountryCodeFromPath } from "@lib/util/regions"
import { Text } from "@medusajs/ui"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const ProductCard = ({ product, region }: ProductCardProps) => {
  const { cheapestPrice } = getProductPrice({ product, region })
  const handle = getProductHandle(product)
  const imageUrl = getProductImageUrl(product)
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ''

  return (
    <Link
      to={`${baseHref}/products/${handle}` as any}
      className="group flex flex-col w-full"
      data-testid="product-wrapper"
    >
      <div className="aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle shadow-elevation-card-rest group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150 rounded-large relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title || "Product image"}
            className="absolute inset-0 object-cover object-center group-hover:scale-105 transition-transform duration-300 w-full h-full"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ui-fg-subtle">
            <span className="txt-smallall-regular">No image</span>
          </div>
        )}
      </div>
      
      <div className="flex txt-compact-medium mt-4 justify-between">
        <Text className="text-ui-fg-subtle" data-testid="product-title">
          {product.title}
        </Text>
        {cheapestPrice && (
          <div className="flex items-center gap-x-2">
            <Text className="text-ui-fg-muted" data-testid="product-price">
              {cheapestPrice.calculated_price}
            </Text>
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard