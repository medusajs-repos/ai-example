import { HttpTypes } from "@medusajs/types"
import { lazy, Suspense, useMemo, useState } from "react"
import sortProducts, { type ProductSortOptions } from "../../lib/utils/products/sort-products"
import { useProducts } from "../../lib/hooks/static/use-products";
import { Loading } from "../common";
import ProductCard from "@/components/product/product-card";
import ProductListingLoading from "@/components/product/product-listing-loading";

const RefinementList = lazy(() => import("@/components/product/refinement-list"));
const Pagination = lazy(() => import("@/components/common/pagination"));

const PRODUCTS_PER_PAGE = 12;

type ProductListProps = {
  region: HttpTypes.StoreRegion
  title: string
  queryParams?: Record<string, string>
}

const ProductListing = ({ region, title, queryParams }: ProductListProps) => {
  const [sortBy, setSortBy] = useState<ProductSortOptions>("created_at");
   
  const { 
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    hasPreviousPage,
  } = useProducts({
    region_id: region.id,
    query_params: {
      ...queryParams,
      limit: PRODUCTS_PER_PAGE,
    },
  });

  const setQueryParams = (name: string, value: ProductSortOptions) => {
    if (name === "sortBy") {
      setSortBy(value);
    }
  };

  const handlePageChange = (page: number) => {
    if (page > (data?.pages.length || 0)) {
      fetchNextPage();
    } else if (page < (data?.pages.length || 0)) {
      fetchPreviousPage();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortedData = useMemo(() => {
    return sortProducts({
      products: data?.pages.flatMap((page) => page.products) || [],
      sortBy,
    });
  }, [data?.pages, sortBy]);

  if (isFetching) {
    return <ProductListingLoading />
  }

  return (
    <div
      className="content-container flex flex-col lg:flex-row gap-6 py-6"
      data-testid="products-container"
    >
      {/* Left Column - Filters & Refinements */}
      <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
        <Suspense fallback={<Loading />}>
          <RefinementList sortBy={sortBy} setQueryParams={setQueryParams} />
        </Suspense>
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
          <p className="text-ui-fg-subtle">{sortedData.length} items</p>
        </div>
        {sortedData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-ui-fg-subtle">No products available</div>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-6 gap-y-8"
              data-testid="products-list"
            >
              {sortedData.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} region={region} />
                </div>
              ))}
            </div>
            {(hasNextPage || hasPreviousPage) && (
              <Suspense fallback={<Loading />}>
                <Pagination
                  data-testid="products-pagination"
                  page={sortedData.length || 1}
                  totalPages={sortedData.length || 1}
                  onPageChange={handlePageChange}
                />
              </Suspense>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductListing;