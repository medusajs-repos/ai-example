import { HttpTypes } from "@medusajs/types"
import { useProducts } from "@lib/hooks/useProducts"
import ProductCard from "./ProductCard"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function RelatedProducts({
  product,
  region,
}: RelatedProductsProps) {
  // Build query params for related products
  const queryParams: any = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const { data: allProducts, isLoading } = useProducts(queryParams)

  // Filter out the current product
  const relatedProducts = allProducts?.filter(
    (relatedProduct) => relatedProduct.id !== product.id
  )

  if (isLoading) {
    return (
      <div className="product-page-constraint">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-base-regular text-ui-fg-muted mb-6">
            Related products
          </span>
          <p className="text-2xl-regular text-ui-fg-base max-w-lg">
            You might also want to check out these products.
          </p>
        </div>
        <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full h-64 bg-ui-bg-subtle animate-pulse rounded-rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (!relatedProducts?.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-ui-fg-muted mb-6">
          Related products
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          You might also want to check out these products.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {relatedProducts.slice(0, 8).map((relatedProduct) => (
          <li key={relatedProduct.id}>
            <ProductCard product={relatedProduct} region={region} />
          </li>
        ))}
      </ul>
    </div>
  )
}