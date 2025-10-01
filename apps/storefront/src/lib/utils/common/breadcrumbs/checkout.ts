import { BreadcrumbItem } from "@/components/common/breadcrumbs"

/**
 * Generates breadcrumb navigation items for checkout flow pages.
 * Creates a navigation path from cart to the current checkout step.
 * 
 * @param step - Optional checkout step identifier (e.g., "delivery", "payment", "review")
 * @param countryCode - Optional country code for localized URLs
 * @returns Array of breadcrumb items for checkout navigation
 * 
 * @example
 * ```typescript
 * // For delivery step
 * const breadcrumbs = generateCheckoutBreadcrumbs("delivery", "us");
 * // Returns: [{ label: "Cart", href: "/us/cart" }, { label: "Delivery", current: true }]
 * 
 * // For initial checkout (no step specified)
 * const breadcrumbs = generateCheckoutBreadcrumbs();
 * // Returns: [{ label: "Cart", href: "/cart" }]
 * ```
 */
export const generateCheckoutBreadcrumbs = (
  step?: string,
  countryCode?: string
): BreadcrumbItem[] => {
  const baseHref = countryCode ? `/${countryCode}` : ""
  
  const items: BreadcrumbItem[] = [
    {
      label: "Cart",
      href: `${baseHref}/cart`,
    },
  ]

  if (step) {
    items.push({
      label: step.charAt(0).toUpperCase() + step.slice(1),
      current: true,
    })
  }

  return items
}