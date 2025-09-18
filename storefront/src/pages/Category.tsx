import Pagination from "@/components/common/pagination";
import ProductCard from "@/components/product/product-card";
import RefinementList from "@/components/product/refinement-list";
import { useLoaderData } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import sortProducts, { type ProductSortOptions } from "@/lib/utils/products/sort-products";

const PRODUCTS_PER_PAGE = 12;

const Category = () => {
  const [sortBy, setSortBy] = useState<ProductSortOptions>("created_at");
  const [currentPage, setCurrentPage] = useState(1);

  // Access the loader data from the category route
  const loaderData = useLoaderData({
    from: "/$countryCode/categories/$handle",
  });

  const {
    category,
    products,
    region
  } = loaderData || {};

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    return sortProducts({ products, sortBy });
  }, [products, sortBy]);

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const setQueryParams = (name: string, value: ProductSortOptions) => {
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
    "Category";

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
          <p className="text-ui-fg-subtle">{products.length} items</p>
        </div>
        {products.length === 0 ? (
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
                  <ProductCard product={product} region={region} />
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
