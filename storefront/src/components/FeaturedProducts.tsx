import { listProducts } from "@lib/data/products";
import { useQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "@tanstack/react-router";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const loaderData = useLoaderData({
    from: "/$countryCode/",
  });

  const { region, countryCode, latestProducts } = loaderData || {};

  console.log("Debug - Region:", region);
  console.log("Debug - Country code:", countryCode);
  console.log("Debug - Latest products:", latestProducts);

  // Use the pre-fetched data with useQuery for client-side updates
  const { data: productsData } = useQuery({
    queryKey: ["latest-products", 4, region?.id],
    queryFn: () =>
      listProducts({
        queryParams: {
          limit: 4,
          order: "-created_at",
        },
        regionId: region?.id,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!region?.id,
    initialData: latestProducts, // Use SSR data as initial data
  });

  if (!region) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white mb-16">
        <div className="content-container">
          <div className="text-center text-red-600">
            No region available. Please check your Medusa backend connection.
          </div>
        </div>
      </section>
    );
  }

  const products = productsData?.products || [];

  if (products.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white mb-16">
        <div className="content-container">
          <div className="text-center text-yellow-600">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Latest Products
            </h2>
            <p>No products available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white mb-16">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Latest Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our newest arrivals, carefully curated just for you
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <ProductCard product={product} region={region} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={`/${countryCode}/store`}
            className="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors duration-200 group"
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
