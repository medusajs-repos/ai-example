import FilterRadioGroup from "@/components/common/filter-radio-group"
import { type ProductSortOptions } from "@/lib/utils/product/sort-products"

type SortProductsProps = {
  sortBy: ProductSortOptions
  setQueryParams: (name: string, value: ProductSortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc", 
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low", 
  },
]

const ProductSort = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: string) => {
    setQueryParams("sortBy", value as ProductSortOptions)
  }

  return (
    <FilterRadioGroup
      title="Sort by"
      items={sortOptions}
      value={sortBy}
      onChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default ProductSort