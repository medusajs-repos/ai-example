import ProductSort from "@/components/product/product-sort"
import { type ProductSortOptions } from "@/lib/utils/products/sort-products"

type ProductListRefinementProps = {
  sortBy: ProductSortOptions
  setQueryParams: (name: string, value: ProductSortOptions) => void
  "data-testid"?: string
}

const ProductListRefinement = ({
  sortBy,
  setQueryParams,
  "data-testid": dataTestId,
}: ProductListRefinementProps) => {
  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <ProductSort
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
    </div>
  )
}

export default ProductListRefinement