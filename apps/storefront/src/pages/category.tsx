import ProductCard from "@/components/product/product-card";
import ProductListing from "@/components/product/product-listing";
import { useCategories } from "@/lib/hooks/static/use-categories";
import { useProducts } from "@/lib/hooks/static/use-products";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { Link, useLoaderData, useLocation } from "@tanstack/react-router";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for category product listing pages in the storefront
 * - Category pages: product listings by category
 * - Product catalog: category-based product browsing
 * - Mobile commerce: mobile-optimized category browsing
 * - SEO pages: optimized category pages for search engines
 * - Product discovery: category-based product exploration
 *
 * ECOMMERCE CONTEXT:
 * - Critical for product discovery and browsing
 * - Essential for SEO and search engine optimization
 * - Important for user experience and navigation
 * - Required for product catalog organization
 * - Used in marketing campaigns and promotions
 * - Important for mobile commerce experience
 *
 * CATEGORY PAGE FEATURES:
 * - Category-specific product listings
 * - Product grid with responsive layout
 * - Category name and information display
 * - Product filtering and sorting
 * - SEO-optimized category pages
 * - Mobile-optimized category browsing
 *
 * PAGE STRUCTURE:
 * - Category data loading and display
 * - Product listing with category filtering
 * - Responsive product grid layout
 * - Category-specific product discovery
 *
 * COMMON PATTERNS:
 * - Category product listings
 * - Mobile category browsing
 * - SEO category pages
 * - Product catalog browsing
 * - Category-based product discovery
 *
 * EXAMPLES:
 * - Category page for electronics
 * - Mobile category browsing
 * - SEO-optimized category pages
 * - Product catalog by category
 */
const SubcategorySection = ({
  subcategory,
  region,
  baseHref,
}: {
  subcategory: any;
  region: any;
  baseHref: string;
}) => {
  const { data } = useProducts({
    region_id: region.id,
    query_params: {
      category_id: subcategory.id,
      limit: 4,
    },
  });

  const products = data?.pages?.[0]?.products || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-primary-text text-large">{subcategory.name}</h3>
        <Link
          to={`${baseHref}/categories/${subcategory.handle}` as any}
          className="text-secondary-text hover:text-secondary-text-hover text-base font-medium transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} region={region} />
        ))}
      </div>
    </div>
  );
};

const Category = () => {
  const { category, region } = useLoaderData({
    from: "/$countryCode/categories/$handle",
  });

  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const categoryDisplayName = category?.name || "Category";

  // Fetch child categories - only when we have a category ID
  const { data: childCategories } = useCategories({
    fields: "id,name,handle,parent_category_id",
    queryParams: {
      parent_category_id: category?.id,
    },
    enabled: !!category?.id,
  });

  return (
    <div>
      <ProductListing
        region={region}
        title={categoryDisplayName}
        queryParams={{
          category_id: category?.id,
        }}
      />

      {childCategories && childCategories.length > 0 && (
        <div className="content-container py-12">
          {childCategories.map((subcategory) => (
            <SubcategorySection
              key={subcategory.id}
              subcategory={subcategory}
              region={region}
              baseHref={baseHref}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
