import { Link, useLocation } from "@tanstack/react-router";
import ProductCard from "@/components/product/product-card";
import { useLatestProducts } from "../lib/hooks/static/use-products";
import { getCountryCodeFromPath } from "@/lib/utils/regions";
import { useRegion } from "@/lib/hooks/static/use-region";

const FeaturedProducts = () => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const { data: region } = useRegion({ country_code: countryCode || "" });
  const { data: latestProducts } = useLatestProducts({
    region_id: region?.id,
  });

  if (!latestProducts?.products.length) {
    return <></>
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white mb-16">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-ui-fg-base mb-4 tracking-tight">
            Latest Products
          </h2>
          <p className="text-lg text-ui-fg-subtle max-w-2xl mx-auto">
            Discover our newest arrivals, carefully curated just for you
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProducts.products.map((product) => (
            <div
              key={product.id}
              className="transform transition-transform duration-300"
            >
              {region && <ProductCard product={product} region={region} />}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={`/${countryCode}/store` as any}
            className="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-black/80 transition-colors duration-200 group"
          >
            View All Products
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
