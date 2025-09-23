import { HttpTypes } from "@medusajs/types"
import ProductCard from "@/components/product/product-card"

interface ProductGridProps {
  products: HttpTypes.StoreProduct[]
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid