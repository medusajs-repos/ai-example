/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for displaying shipping information in the storefront
 * - Product detail pages: show shipping policies and information
 * - Product tabs: shipping information in product tabs
 * - Mobile commerce: mobile-optimized shipping information
 * - Customer service: shipping information for support
 * - Product information: comprehensive product details
 *
 * ECOMMERCE CONTEXT:
 * - Critical for customer trust and transparency
 * - Essential for shipping policy communication
 * - Important for customer service and support
 * - Required for order fulfillment and delivery
 * - Used in customer education and information
 * - Important for mobile commerce experience
 *
 * SHIPPING INFO FEATURES:
 * - Delivery timeframes and policies
 * - Return and exchange policies
 * - Shipping cost information
 * - Contact information for support
 * - Professional policy presentation
 * - Responsive design for mobile/desktop
 *
 * SHIPPING POLICIES:
 * - Delivery: shipping timeframes and methods
 * - Returns: return policy and timeframes
 * - Exchanges: exchange policy and options
 * - Contact: customer service information
 *
 * COMMON PATTERNS:
 * - Product shipping information
 * - Mobile shipping info
 * - Customer service shipping info
 * - Product policy information
 * - Shipping policy display
 *
 * EXAMPLES:
 * - <ProductShippingInfo />
 * - Product detail page shipping info
 * - Mobile shipping information
 * - Customer service shipping info
 */

const ProductShippingInfo = () => {
  const policies = [
    { label: "Delivery", value: "3-5 business days" },
    { label: "Returns", value: "30 days free returns" },
    { label: "Exchanges", value: "Size exchanges available" },
  ];

  return (
    <div className="space-y-3">
      {policies.map((policy, index) => (
        <div key={index} className="flex justify-between items-center py-1">
          <span className="text-secondary-text text-sm">{policy.label}</span>
          <span className="text-primary-text text-sm">{policy.value}</span>
        </div>
      ))}

      <div className="pt-4 mt-6 border-t border-secondary-border">
        <p className="text-secondary-text text-sm">
          Questions about shipping or returns?{" "}
          <a href="/contact" className="text-accent-text hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProductShippingInfo;
