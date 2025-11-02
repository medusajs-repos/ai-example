import { Button } from "@/components/common/button";
import Loading from "@/components/common/loading";
import ProductCard from "@/components/product/product-card";
import { useLatestProducts } from "@/lib/hooks/static/use-products";
import { useRegion } from "@/lib/hooks/static/use-region";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { ChevronRight } from "@medusajs/icons";
import { Link, useLocation } from "@tanstack/react-router";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for showcasing featured products on homepage and landing pages
 * - Homepage sections: highlight latest products and new arrivals
 * - Marketing campaigns: promote specific product collections
 * - Category pages: show featured products within categories
 * - Mobile commerce: mobile-optimized product showcases
 * - SEO pages: featured products for search engine optimization
 *
 * ECOMMERCE CONTEXT:
 * - Critical for product discovery and conversion
 * - Essential for marketing campaigns and promotions
 * - Important for homepage engagement and retention
 * - Required for new product launches and announcements
 * - Used in recommendation systems and personalization
 * - Important for mobile commerce experience
 *
 * FEATURED PRODUCT FEATURES:
 * - Latest products display with grid layout
 * - Product cards with images, titles, and prices
 * - Call-to-action button to view all products
 * - Loading states for better user experience
 * - Responsive design for mobile/desktop
 * - Performance optimization with lazy loading
 *
 * LAYOUT STRUCTURE:
 * - Section header with title and description
 * - Product grid (1-4 columns based on screen size)
 * - Loading skeleton during data fetching
 * - Call-to-action button for navigation
 *
 * COMMON PATTERNS:
 * - Homepage featured products section
 * - Category featured products
 * - New arrivals showcase
 * - Mobile product browsing
 * - Marketing campaign highlights
 *
 * EXAMPLES:
 * - Homepage with latest products
 * - Category page with featured items
 * - Mobile-optimized product showcase
 * - Marketing campaign product highlights
 */

const FeaturedProducts = () => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const { data: region } = useRegion({ country_code: countryCode || "" });
  const { data: latestProducts, isLoading } = useLatestProducts({
    region_id: region?.id,
  });

  return (
    <section className="bg-primary-bg content-container flex flex-col gap-y-16">
      <div className="text-center">
        <h2 className="text-xlarge font-bold text-primary-text mb-4">
          Latest Products
        </h2>
        <p className="text-large text-secondary-text max-w-2xl mx-auto">
          Discover our newest arrivals, carefully curated just for you
        </p>
      </div>
      {isLoading && <Loading rows={10} columns={4} />}
      {!isLoading &&
      (!latestProducts?.products || latestProducts.products.length === 0) ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-xlarge text-secondary-text">No products yet</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestProducts?.products.map((product) => (
              <div
                key={product.id}
                className="transform transition-transform duration-300 w-full"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/$countryCode/store"
              params={{ countryCode: countryCode || "" }}
            >
              <Button variant="transparent">
                View All Products
                <ChevronRight />
              </Button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedProducts;
