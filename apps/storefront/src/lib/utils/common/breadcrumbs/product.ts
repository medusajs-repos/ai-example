import { HttpTypes } from "@medusajs/types"
import { BreadcrumbItem } from "@/components/common/breadcrumbs"

/**
 * Generates breadcrumb navigation items for product detail pages.
 * Creates a hierarchical path from store to collection (if applicable) to product.
 * 
 * @param product - The product object containing title, collection, and other details
 * @param countryCode - Optional country code for localized URLs
 * @returns Array of breadcrumb items for product navigation
 * 
 * @example
 * ```typescript
 * const product = {
 *   title: "Classic T-Shirt",
 *   collection: { title: "Summer Collection", handle: "summer" }
 * };
 * const breadcrumbs = generateProductBreadcrumbs(product, "us");
 * // Returns: [
 * //   { label: "Store", href: "/us/store" },
 * //   { label: "Summer Collection", href: "/us/collections/summer" },
 * //   { label: "Classic T-Shirt", current: true }
 * // ]
 * 
 * // For product without collection
 * const breadcrumbs = generateProductBreadcrumbs(productWithoutCollection);
 * // Returns: [
 * //   { label: "Store", href: "/store" },
 * //   { label: "Classic T-Shirt", current: true }
 * // ]
 * ```
 */
export const generateProductBreadcrumbs = (
  product: HttpTypes.StoreProduct,
  countryCode?: string
): BreadcrumbItem[] => {
  const baseHref = countryCode ? `/${countryCode}` : ""
  const items: BreadcrumbItem[] = []

  // Add store breadcrumb
  items.push({
    label: "Store",
    href: `${baseHref}/store`,
  })

  // Add collection breadcrumb if product has a collection
  if (product.collection) {
    items.push({
      label: product.collection.title,
      href: `${baseHref}/collections/${product.collection.handle}`,
    })
  }

  // Add product breadcrumb (current page)
  items.push({
    label: product.title,
    current: true,
  })

  return items
}