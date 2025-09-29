import { EllipseMiniSolid } from "@medusajs/icons"
import { clx } from "@medusajs/ui"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for product filtering in the storefront
 * - Product listings: filter by category, brand, price range
 * - Search results: filter search results by criteria
 * - Category pages: filter products within categories
 * - Mobile commerce: mobile-optimized filter interface
 * - Advanced search: complex filtering options
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for product discovery and browsing
 * - Essential for search result refinement
 * - Important for user experience and conversion
 * - Required for large product catalogs
 * - Used in product recommendation systems
 * - Important for mobile commerce experience
 * 
 * FILTER FEATURES:
 * - Single selection from multiple filter options
 * - Visual indication of selected option
 * - Grouped filter options with titles
 * - Accessible keyboard navigation
 * - Responsive design for mobile/desktop
 * - Integration with search and product listings
 * 
 * FILTER TYPES:
 * - Category filters (Electronics, Clothing, etc.)
 * - Brand filters (Nike, Apple, Samsung, etc.)
 * - Price range filters (Under $50, $50-$100, etc.)
 * - Rating filters (4+ stars, 3+ stars, etc.)
 * - Availability filters (In stock, On sale, etc.)
 * 
 * COMMON PATTERNS:
 * - Product category filtering
 * - Brand-based product filtering
 * - Price range filtering
 * - Rating and review filtering
 * - Availability and stock filtering
 * 
 * EXAMPLES:
 * - <FilterRadioGroup title="Category" items={categories} value={selectedCategory} onChange={setCategory} />
 * - <FilterRadioGroup title="Brand" items={brands} value={selectedBrand} onChange={setBrand} />
 * - <FilterRadioGroup title="Price Range" items={priceRanges} value={selectedPrice} onChange={setPrice} />
 */

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  onChange: (value: string) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  onChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <span className="txt-xsmall font-medium text-ui-fg-subtle">{title}</span>
      <div data-testid={dataTestId} className="flex flex-col gap-y-1">
        {items?.map((i) => (
          <div
            key={i.value}
            className={clx("flex gap-x-2 items-center", {
              "ml-[-23px]": i.value === value,
            })}
          >
            {i.value === value && <EllipseMiniSolid />}
            <label
              htmlFor={i.value}
              className={clx(
                "txt-small hover:cursor-pointer",
                {
                  "text-primary-text font-medium": i.value === value,
                  "text-secondary-text": i.value !== value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </label>
            <input
              checked={i.value === value}
              className="hidden peer"
              id={i.value}
              value={i.value}
              onChange={() => onChange(i.value)}
              type="radio"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterRadioGroup