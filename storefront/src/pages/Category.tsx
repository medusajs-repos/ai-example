import Pagination from "@components/Pagination";
import ProductCard from "@components/ProductCard";
import RefinementList from "@components/RefinementList";
import { type SortOptions } from "@components/SortProducts";
import { listProducts } from "@lib/data/products";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { useMemo, useState } from "react";

const PRODUCTS_PER_PAGE = 12;

const Category = () => {
  const [sortBy, setSortBy] = useState<SortOptions>("created_at");
  const [currentPage, setCurrentPage] = useState(1);

  // Access the loader data from the category route
  const loaderData = useLoaderData({
    from: "/$countryCode/categories/$handle",
  });

  const {
    region: defaultRegion,
    regions,
    countryCode,
    categoryHandle,
    categoryId,
    category,
  } = loaderData || {};

  // Use the pre-fetched data with useQuery for client-side updates
  const { data, isLoading: productsLoading } = useQuery({
    queryKey: [
      "products",
      { limit: 1000, category: categoryId },
      defaultRegion?.id,
    ],
    queryFn: ({ pageParam = 1 }) =>
      listProducts({
        pageParam,
        queryParams: {
          limit: 1000,
          category_id: [categoryId],
        },
        regionId: defaultRegion?.id,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!defaultRegion?.id,
  });

  const allProducts =
    data?.pages?.flatMap((page) => page.products) || data?.products || [];

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

  const categoryDisplayName =
    category?.name ||
    categoryHandle?.charAt(0).toUpperCase() + categoryHandle?.slice(1) ||
    "Category";

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
      data-testid="category-container"
    >
      {/* Left Column - Filters & Refinements */}
      <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
        <RefinementList sortBy={sortBy} setQueryParams={setQueryParams} />
      </div>

      {/* Center Column - Product Grid */}
      <div className="flex-1">
        <div className="mb-8">
          <h1
            data-testid="category-page-title"
            className="txt-xlarge-plus font-medium text-ui-fg-base mb-1"
          >
            {categoryDisplayName}
          </h1>
          <p className="text-ui-fg-subtle">{allProducts.length} items</p>
        </div>
        {productsLoading && allProducts.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-ui-fg-subtle">Loading products...</div>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center text-ui-fg-subtle py-16">
            <p className="txt-xlarge mb-4">
              No products found in {categoryDisplayName.toLowerCase()}
            </p>
            <p>This category doesn't have any products yet.</p>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-6 gap-y-8"
              data-testid="category-products-list"
            >
              {paginatedProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} region={defaultRegion} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                data-testid="category-pagination"
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

export default Category;
