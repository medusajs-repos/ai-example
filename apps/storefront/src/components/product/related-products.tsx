import Loading from "@/components/common/loading";
import ProductCard from "@/components/product/product-card";
import { useRelatedProducts } from "@/lib/hooks/static/use-products";
import { HttpTypes } from "@medusajs/types";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying related products in the storefront
 * - Product detail pages: show similar or complementary products
 * - Product recommendations: suggest products based on current product
 * - Cross-selling: display products that go well together
 * - Mobile commerce: mobile-optimized product recommendations
 * - Product discovery: help users find related products
 *
 * ECOMMERCE CONTEXT:
 * - Critical for cross-selling and upselling
 * - Essential for product discovery and browsing
 * - Important for conversion optimization and sales
 * - Required for product recommendation systems
 * - Used in personalization and user engagement
 * - Important for mobile commerce experience
 *
 * RELATED PRODUCTS FEATURES:
 * - Product recommendations based on current product
 * - Cross-selling and upselling opportunities
 * - Product discovery and browsing
 * - Loading states for better user experience
 * - Responsive design for mobile/desktop
 * - Professional product presentation
 *
 * RECOMMENDATION TYPES:
 * - Similar products: same category or type
 * - Complementary products: products that go together
 * - Popular products: trending or popular items
 * - Recently viewed: customer's browsing history
 * - Cross-selling: products that enhance the purchase
 *
 * COMMON PATTERNS:
 * - Product detail page recommendations
 * - Mobile product recommendations
 * - Cross-selling product displays
 * - Product discovery sections
 * - Recommendation carousels
 *
 * EXAMPLES:
 * - <RelatedProducts product={currentProduct} region={region} />
 * - Product detail page with recommendations
 * - Mobile product recommendations
 * - Cross-selling product display
 */

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
};

export default function RelatedProducts({
  product,
  region,
}: RelatedProductsProps) {
  // TanStack Query will automatically use cached/prefetched data from SSR if available
  // The prefetchQuery in the loader populates the cache, so this will use cached data
  const { data: relatedProducts, isLoading } = useRelatedProducts({
    product_id: product.id,
    collection_id: product.collection_id || undefined,
    tags: product.tags?.map((tag) => tag.id),
    region_id: region.id,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!relatedProducts?.length) {
    return null;
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-xlarge text-primary-text mb-6">
          Related products
        </span>
        <p className="text-base font-medium text-secondary-text max-w-lg">
          You might also want to check out these products.
        </p>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
        {relatedProducts.slice(0, 8).map((relatedProduct) => (
          <li key={relatedProduct.id}>
            <ProductCard product={relatedProduct} />
          </li>
        ))}
      </ul>
    </div>
  );
}
