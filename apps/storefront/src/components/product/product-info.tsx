import { HttpTypes } from "@medusajs/types";
import { memo } from "react";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying product information in the storefront
 * - Product detail pages: show product title and description
 * - Product showcases: highlight product features and benefits
 * - Mobile commerce: mobile-optimized product information
 * - SEO pages: optimized product information for search engines
 * - Product comparisons: display product details for comparison
 *
 * ECOMMERCE CONTEXT:
 * - Critical for product information and specifications
 * - Essential for SEO and search engine optimization
 * - Important for user experience and product understanding
 * - Required for product comparison and selection
 * - Used in product recommendation systems
 * - Important for mobile commerce experience
 *
 * PRODUCT INFO FEATURES:
 * - Product title display and formatting
 * - Product description with proper formatting
 * - SEO-friendly product information
 * - Responsive design for mobile/desktop
 * - Professional product presentation
 * - Clear product identification
 *
 * PRODUCT INFORMATION:
 * - Product title: clear and descriptive
 * - Product description: detailed product information
 * - SEO optimization: search engine friendly
 * - Mobile optimization: responsive design
 *
 * COMMON PATTERNS:
 * - Product detail information
 * - Mobile product information
 * - SEO product pages
 * - Product comparison information
 * - Product showcase information
 *
 * EXAMPLES:
 * - <ProductInfo product={product} />
 * - Product detail page information
 * - Mobile product information
 * - SEO-optimized product pages
 */

type ProductInfoProps = {
  product: HttpTypes.StoreProduct;
};

const ProductInfo = memo(({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        <h2
          className="text-xlarge font-bold text-primary-text"
          data-testid="product-title"
        >
          {product.title}
        </h2>

        <span
          className="text-base font-medium text-secondary-text whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </span>
      </div>
    </div>
  );
});

ProductInfo.displayName = "ProductInfo";

export default ProductInfo;
