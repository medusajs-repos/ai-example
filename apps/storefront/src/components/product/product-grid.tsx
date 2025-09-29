import { HttpTypes } from "@medusajs/types"
import ProductCard from "@/components/product/product-card"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for displaying products in grid layouts in the storefront
 * - Product listings: show products in category and search results
 * - Homepage: display featured products and recommendations
 * - Related products: show similar or complementary products
 * - Mobile commerce: mobile-optimized product grids
 * - Product showcases: highlight specific product collections
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for product discovery and browsing
 * - Essential for conversion optimization and sales
 * - Important for user experience and engagement
 * - Required for product comparison and selection
 * - Used in recommendation systems and personalization
 * - Important for mobile commerce experience
 * 
 * GRID FEATURES:
 * - Responsive grid layout (1-4 columns based on screen size)
 * - Product cards with images, titles, and prices
 * - Consistent spacing and alignment
 * - Mobile-optimized grid layout
 * - Professional product presentation
 * - Easy product comparison and selection
 * 
 * GRID LAYOUT:
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3-4 columns
 * - Large screens: 4 columns
 * - Consistent spacing and alignment
 * 
 * COMMON PATTERNS:
 * - Product category grids
 * - Search result grids
 * - Featured product grids
 * - Mobile product grids
 * - Product showcase grids
 * 
 * EXAMPLES:
 * - <ProductGrid products={featuredProducts} />
 * - <ProductGrid products={searchResults} />
 * - <ProductGrid products={categoryProducts} />
 */

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