import { BreadcrumbItem } from "@/components/common/breadcrumbs"

/**
 * Generates breadcrumb navigation items for order-related pages.
 * Creates a hierarchical path from account to orders to specific order details.
 * 
 * @param orderId - Optional order ID for specific order detail pages
 * @param countryCode - Optional country code for localized URLs
 * @returns Array of breadcrumb items for order navigation
 * 
 * @example
 * ```typescript
 * // For specific order page
 * const breadcrumbs = generateOrderBreadcrumbs("order_123", "us");
 * // Returns: [
 * //   { label: "Account", href: "/us/account" },
 * //   { label: "Orders", href: "/us/account/orders" },
 * //   { label: "Order order_123", current: true }
 * // ]
 * 
 * // For orders list page
 * const breadcrumbs = generateOrderBreadcrumbs();
 * // Returns: [
 * //   { label: "Account", href: "/account" },
 * //   { label: "Orders", href: "/account/orders" }
 * // ]
 * ```
 */
export const generateOrderBreadcrumbs = (
  orderId?: string,
  countryCode?: string
): BreadcrumbItem[] => {
  const baseHref = countryCode ? `/${countryCode}` : ""
  
  const items: BreadcrumbItem[] = [
    {
      label: "Account",
      href: `${baseHref}/account`,
    },
    {
      label: "Orders",
      href: `${baseHref}/account/orders`,
    },
  ]

  if (orderId) {
    items.push({
      label: `Order ${orderId}`,
      current: true,
    })
  }

  return items
}