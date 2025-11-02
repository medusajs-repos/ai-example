import { Thumbnail } from "@/components/common/thumbnail";
import ProductPrice from "@/components/product/product-price";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { HttpTypes } from "@medusajs/types";
import { Link, useLocation } from "@tanstack/react-router";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying products in grid layouts throughout the storefront
 * - Product listings: show products in category and search results
 * - Homepage: display featured products and recommendations
 * - Related products: show similar or complementary products
 * - Recently viewed: display customer's browsing history
 * - Wishlist/favorites: show saved products
 * - Cross-selling: display products that go well together
 *
 * ECOMMERCE CONTEXT:
 * - Essential for product discovery and browsing
 * - Critical for conversion optimization and sales
 * - Used in recommendation systems and personalization
 * - Important for cross-selling and upselling
 * - Required for product comparison and selection
 * - Used in marketing campaigns and promotions
 *
 * DESIGN FEATURES:
 * - Product image with aspect ratio [29/34] for consistent layout
 * - Product title for identification
 * - Price display with currency formatting
 * - Clickable link to product detail page
 * - Hover effects for better user interaction
 * - Responsive design for mobile/desktop
 *
 * COMMON PATTERNS:
 * - Product grid layouts (3-4 columns on desktop)
 * - Featured product sections
 * - Related product recommendations
 * - Search result listings
 * - Category browsing
 * - Recently viewed products
 *
 * EXAMPLES:
 * - <ProductCard product={featuredProduct} />
 * - <ProductCard product={searchResult} />
 * - <ProductCard product={relatedItem} />
 */

interface ProductCardProps {
  product: HttpTypes.StoreProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  return (
    <Link
      to={`${baseHref}/products/${product.handle}` as any}
      className="group flex flex-col w-full"
    >
      <div className="aspect-[29/34] w-full overflow-hidden bg-secondary-bg relative">
        <Thumbnail
          thumbnail={product.thumbnail}
          alt={product.title}
          className="absolute inset-0 object-cover object-center w-full h-full"
        />
      </div>

      <div className="flex text-base font-medium mt-4 justify-between">
        <span className="text-primary-text">{product.title}</span>
        <ProductPrice
          product={product}
          variant={product.variants?.[0]}
          className="text-secondary-text"
        />
      </div>
    </Link>
  );
};

export default ProductCard;
