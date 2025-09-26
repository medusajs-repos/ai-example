import { HttpTypes } from "@medusajs/types"
import { lazy, Suspense, useMemo } from "react"
import { useProducts } from "@/lib/hooks/static/use-products"
import Loading from "@/components/common/loading"
import ProductCard from "@/components/product/product-card"
import ProductListingLoading from "@/components/product/product-listing-loading"

const Pagination = lazy(() => import("@/components/common/pagination"))

const PRODUCTS_PER_PAGE = 12

type ProductListProps = {
  region: HttpTypes.StoreRegion
  title: string
  queryParams?: Record<string, string>
}

const ProductListing = ({ region, title, queryParams }: ProductListProps) => {   
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
  })

  const handlePageChange = (page: number) => {
    if (page > (data?.pages.length || 0)) {
      fetchNextPage()
    } else if (page < (data?.pages.length || 0)) {
      fetchPreviousPage()
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.products) || []
  }, [data?.pages])

  if (isFetching) {
    return <ProductListingLoading />
  }

  return (
    <div
      className="content-container flex flex-col lg:flex-row gap-6 py-6"
      data-testid="products-container"
    >
      <div className="flex-1">
        <div className="mb-8">
          <h1
            data-testid="products-page-title"
            className="txt-xlarge-plus text-primary-text mb-1"
          >
            {title}
          </h1>
          <p className="text-secondary-text">{products.length} items</p>
        </div>
        {products.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="txt-xlarge text-secondary-text">No products available</div>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-6 gap-y-8"
              data-testid="products-list"
            >
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {(hasNextPage || hasPreviousPage) && (
              <Suspense fallback={<Loading />}>
                <Pagination
                  data-testid="products-pagination"
                  page={products.length || 1}
                  totalPages={products.length || 1}
                  onPageChange={handlePageChange}
                />
              </Suspense>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductListing