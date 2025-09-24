import { HttpTypes } from "@medusajs/types"
import ProductCard from "@/components/product/product-card"
import Loading from "@/components/common/loading"
import { useRelatedProducts } from "@/lib/hooks/static/use-products"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function RelatedProducts({
  product,
  region,
}: RelatedProductsProps) {
  const { data: relatedProducts, isLoading } = useRelatedProducts({
    product_id: product.id,
    collection_id: product.collection_id || undefined,
    tags: product.tags?.map((tag) => tag.id),
    region_id: region.id,
  })

  if (isLoading) {
    return <Loading />
  }

  if (!relatedProducts?.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="txt-xlarge text-primary-text mb-6">
          Related products
        </span>
        <p className="txt-medium text-secondary-text max-w-lg">
          You might also want to check out these products.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-8">
        {relatedProducts.slice(0, 8).map((relatedProduct) => (
          <li key={relatedProduct.id}>
            <ProductCard product={relatedProduct} />
          </li>
        ))}
      </ul>
    </div>
  )
}