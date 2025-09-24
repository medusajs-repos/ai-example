import { Link, useLocation } from "@tanstack/react-router"
import { HttpTypes } from "@medusajs/types"
import { getCountryCodeFromPath } from "@/lib/utils/regions/regions"
import { Text } from "@medusajs/ui"
import ProductPrice from "@/components/product/product-price"
import { Thumbnail } from "@/components/common/thumbnail"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
}

const ProductCard = ({ product }: ProductCardProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  return (
    <Link
      to={`${baseHref}/products/${product.handle}` as any}
      className="group flex flex-col w-full"
    >
      <div className="aspect-[29/34] w-full overflow-hidden bg-secondary-bg shadow-elevation-card-rest group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150 rounded relative">
        <Thumbnail thumbnail={product.thumbnail} alt={product.title} className="absolute inset-0 object-cover object-center group-hover:scale-105 transition-transform duration-300 w-full h-full" />
      </div>
      
      <div className="flex txt-compact-medium mt-4 justify-between">
        <Text className="text-secondary-text">
          {product.title}
        </Text>
        <ProductPrice 
          product={product} 
          variant={product.variants?.[0]} 
          className="text-secondary-text"
        />
      </div>
    </Link>
  )
}

export default ProductCard