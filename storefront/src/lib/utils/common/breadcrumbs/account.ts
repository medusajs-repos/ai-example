import { BreadcrumbItem } from "@/components/common/breadcrumbs"

/**
 * Generates breadcrumb navigation items for account-related pages.
 * Creates a hierarchical navigation structure starting from the account page.
 * 
 * @param page - The current page identifier (e.g., "profile", "orders", "addresses")
 * @param countryCode - Optional country code for localized URLs
 * @returns Array of breadcrumb items for navigation
 * 
 * @example
 * ```typescript
 * // For account/profile page
 * const breadcrumbs = generateAccountBreadcrumbs("profile", "us");
 * // Returns: [{ label: "Account", href: "/us/account" }, { label: "Profile", current: true }]
 * 
 * // For main account page
 * const breadcrumbs = generateAccountBreadcrumbs("account");
 * // Returns: [{ label: "Account", href: "/account" }]
 * ```
 */
export const generateAccountBreadcrumbs = (
  page: string,
  countryCode?: string
): BreadcrumbItem[] => {
  const baseHref = countryCode ? `/${countryCode}` : ""
  
  const items: BreadcrumbItem[] = [
    {
      label: "Account",
      href: `${baseHref}/account`,
    },
  ]

  // Add specific page breadcrumb if not the main account page
  if (page !== "account") {
    items.push({
      label: page.charAt(0).toUpperCase() + page.slice(1),
      current: true,
    })
  }

  return items
}