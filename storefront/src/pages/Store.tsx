import Pagination from "@components/Pagination";
import ProductCard from "@components/ProductCard";
import RefinementList from "@components/RefinementList";
import { type SortOptions } from "@components/SortProducts";
import { useLoaderData } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@lib/data/products";
import { useMemo, useState } from "react";

const PRODUCTS_PER_PAGE = 12;

const Store = () => {
  const [sortBy, setSortBy] = useState<SortOptions>("created_at");
  const [currentPage, setCurrentPage] = useState(1);

  // Access the loader data from the route - this works with SSR
  const { region: defaultRegion, regions, countryCode } = useLoaderData({
    from: "/$countryCode/store"
  });

  // Use the pre-fetched data with useQuery for client-side updates
  const { data, isLoading: productsLoading } = useQuery({
    queryKey: ['products', { limit: 1000 }, defaultRegion?.id],
    queryFn: ({ pageParam = 1 }) =>
      listProducts({
        pageParam,
        queryParams: { limit: 1000 },
        regionId: defaultRegion?.id,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!defaultRegion?.id,
  });

  const allProducts = data?.pages?.flatMap((page) => page.products) || data?.products || [];

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    const products = [...allProducts];

    switch (sortBy) {
      case "price_asc":
        return products.sort((a, b) => {
          const aPrice =
            a.variants?.[0]?.calculated_price?.calculated_amount ||
            a.variants?.[0]?.prices?.[0]?.amount ||
            0;
          const bPrice =
            b.variants?.[0]?.calculated_price?.calculated_amount ||
            b.variants?.[0]?.prices?.[0]?.amount ||
            0;
          return aPrice - bPrice;
        });
      case "price_desc":
        return products.sort((a, b) => {
          const aPrice =
            a.variants?.[0]?.calculated_price?.calculated_amount ||
            a.variants?.[0]?.prices?.[0]?.amount ||
            0;
          const bPrice =
            b.variants?.[0]?.calculated_price?.calculated_amount ||
            b.variants?.[0]?.prices?.[0]?.amount ||
            0;
          return bPrice - aPrice;
        });
      case "created_at":
      default:
        return products.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  }, [allProducts, sortBy]);

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const setQueryParams = (name: string, value: SortOptions) => {
    if (name === "sortBy") {
      setSortBy(value);
      setCurrentPage(1); // Reset to first page when sorting changes
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Remove regionsLoading check since data comes from SSR loader

  if (!defaultRegion) {
    return (
      <div className="content-container py-8">
        <div className="text-center text-red-600">
          No regions available. Please check your Medusa backend connection.
        </div>
      </div>
    );
  }

  return (
    <div
      className="content-container flex flex-col lg:flex-row gap-6 py-6"
      data-testid="store-container"
    >
      {/* Left Column - Filters & Refinements */}
      <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
        <RefinementList sortBy={sortBy} setQueryParams={setQueryParams} />
      </div>

      {/* Center Column - Product Grid */}
      <div className="flex-1">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        {productsLoading && allProducts.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            <p className="text-xl mb-4">No products available</p>
            <p>Make sure your Medusa backend is running and has products.</p>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-6 gap-y-8"
              data-testid="products-list"
            >
              {paginatedProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} region={defaultRegion} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                data-testid="product-pagination"
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Store;
