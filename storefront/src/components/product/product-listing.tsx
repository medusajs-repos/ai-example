import { HttpTypes } from "@medusajs/types"
import { lazy, useMemo, useState } from "react"
import sortProducts, { type ProductSortOptions } from "../../lib/utils/products/sort-products"

const RefinementList = lazy(() => import("@/components/product/refinement-list"));
const ProductCard = lazy(() => import("@/components/product/product-card"));
const Pagination = lazy(() => import("@/components/common/pagination"));

const PRODUCTS_PER_PAGE = 12;

type ProductListProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  title: string
}

const ProductListing = ({ products, region, title }: ProductListProps) => {
  const [sortBy, setSortBy] = useState<ProductSortOptions>("created_at");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedProducts = useMemo(() => {
    return sortProducts({ products, sortBy });
  }, [products, sortBy]);

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

  return (
    <div
      className="content-container flex flex-col lg:flex-row gap-6 py-6"
      data-testid="products-container"
    >
      {/* Left Column - Filters & Refinements */}
      <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
        <RefinementList sortBy={sortBy} setQueryParams={setQueryParams} />
      </div>

      {/* Center Column - Product Grid */}
      <div className="flex-1">
        <div className="mb-8">
          <h1
            data-testid="products-page-title"
            className="txt-xlarge-plus font-medium text-ui-fg-base mb-1"
          >
            {title}
          </h1>
          <p className="text-ui-fg-subtle">{products.length} items</p>
        </div>
        {products.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-ui-fg-subtle">No products available</div>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-6 gap-y-8"
              data-testid="products-list"
            >
              {paginatedProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} region={region} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                data-testid="products-pagination"
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
}

export default ProductListing;