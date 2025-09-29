import { BreadcrumbItem } from "@/components/common/breadcrumbs"

/**
 * Generates breadcrumb navigation items for product category pages.
 * Creates a simple navigation path from store to the specific category.
 * 
 * @param category - Category object containing name and handle
 * @param countryCode - Optional country code for localized URLs
 * @returns Array of breadcrumb items for category navigation
 * 
 * @example
 * ```typescript
 * const category = { name: "T-Shirts", handle: "t-shirts" };
 * const breadcrumbs = generateProductCategoryBreadcrumbs(category, "us");
 * // Returns: [
 * //   { label: "Store", href: "/us/store" },
 * //   { label: "T-Shirts", current: true }
 * // ]
 * ```
 */
export const generateProductCategoryBreadcrumbs = (
  category: { name: string; handle: string },
  countryCode?: string
): BreadcrumbItem[] => {
  const baseHref = countryCode ? `/${countryCode}` : ""
  
  return [
    {
      label: "Store",
      href: `${baseHref}/store`,
    },
    {
      label: category.name,
      current: true,
    },
  ]
}