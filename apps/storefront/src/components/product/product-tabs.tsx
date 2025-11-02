import ProductShippingInfo from "@/components/product/product-shipping-info";
import { HttpTypes } from "@medusajs/types";
import { clsx } from "clsx";
import { useState, useMemo, memo } from "react";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for product information tabs in the storefront
 * - Product detail pages: organize product information in tabs
 * - Product showcases: display product details and specifications
 * - Mobile commerce: mobile-optimized product information
 * - Product comparisons: show detailed product information
 * - SEO pages: organized product information for search engines
 *
 * ECOMMERCE CONTEXT:
 * - Critical for product information organization
 * - Essential for user experience and product understanding
 * - Important for SEO and search engine optimization
 * - Required for product comparison and selection
 * - Used in product recommendation systems
 * - Important for mobile commerce experience
 *
 * TAB FEATURES:
 * - Product information organization in tabs
 * - Tab navigation and switching
 * - Product details and specifications
 * - Shipping information and policies
 * - Responsive design for mobile/desktop
 * - Professional product presentation
 *
 * TAB TYPES:
 * - Details: product specifications and information
 * - Shipping: shipping information and policies
 * - Reviews: customer reviews and ratings
 * - Specifications: technical specifications
 * - Care: product care instructions
 *
 * COMMON PATTERNS:
 * - Product detail tabs
 * - Mobile product tabs
 * - Product information tabs
 * - Product specification tabs
 * - Product review tabs
 *
 * EXAMPLES:
 * - <ProductTabs product={product} />
 * - Product detail page with tabs
 * - Mobile product tabs
 * - Product information tabs
 */

type ProductTabsProps = {
  product: HttpTypes.StoreProduct;
};

const ProductTabs = memo(function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("details");

  const tabs = useMemo(
    () => [
      {
        id: "details",
        label: "Details",
        component: <ProductInfoTab product={product} />,
      },
      {
        id: "shipping",
        label: "Shipping",
        component: <ProductShippingInfo />,
      },
    ],
    [product]
  );

  return (
    <div className="w-full">
      {/* Minimal tab headers */}
      <div className="flex border-b border-secondary-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={clsx(
              "px-4 py-3 text-sm font-medium transition-colors relative",
              {
                "text-primary-text": activeTab === tab.id,
                "text-secondary-text hover:text-secondary-text-hover":
                  activeTab !== tab.id,
              }
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-text" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
});

ProductTabs.displayName = "ProductTabs";

const ProductInfoTab = memo(function ProductInfoTab({ product }: ProductTabsProps) {
  const details = [
    { label: "Material", value: product.material },
    { label: "Origin", value: product.origin_country },
    { label: "Type", value: product.type?.value },
    { label: "Weight", value: product.weight ? `${product.weight}g` : null },
    {
      label: "Dimensions",
      value:
        product.length && product.width && product.height
          ? `${product.length}×${product.width}×${product.height}`
          : null,
    },
  ].filter((item) => item.value); // Only show items that have values

  if (details.length === 0) {
    return (
      <div className="text-secondary-text text-sm">
        No additional product details available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {details.map((detail, index) => (
        <div key={index} className="flex justify-between items-center py-1">
          <span className="text-secondary-text text-sm">{detail.label}</span>
          <span className="text-primary-text text-sm">{detail.value}</span>
        </div>
      ))}
    </div>
  );
});

ProductInfoTab.displayName = "ProductInfoTab";

export default ProductTabs;
