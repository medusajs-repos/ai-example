import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/regions/regions"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <Link
            to={`${baseHref}/collections/${product.collection.handle}` as any}
            className="txt-medium text-secondary-text hover:text-secondary-text-hover"
          >
            {product.collection.title}
          </Link>
        )}
        <Heading
          level="h2"
          className="txt-xlarge-plus text-primary-text"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="txt-medium text-secondary-text whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo