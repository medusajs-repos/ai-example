import { ChevronRight } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Link } from "@tanstack/react-router"
import { ReactNode } from "react"

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for navigation breadcrumbs in the storefront
 * - Product pages: show navigation path to current product
 * - Category pages: display category hierarchy
 * - Search results: show search context and filters
 * - Account pages: indicate current account section
 * - Checkout pages: show checkout progress and steps
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for user navigation and orientation
 * - Essential for SEO and search engine optimization
 * - Important for user experience and site structure
 * - Required for deep linking and bookmarking
 * - Used in product discovery and browsing
 * - Important for mobile commerce navigation
 * 
 * BREADCRUMB FEATURES:
 * - Hierarchical navigation display
 * - Clickable links for navigation
 * - Current page indication
 * - Custom separators and styling
 * - Home link inclusion option
 * - Accessible navigation structure
 * 
 * COMMON PATTERNS:
 * - Product page breadcrumbs (Home > Category > Product)
 * - Category navigation (Home > Category > Subcategory)
 * - Search result breadcrumbs (Home > Search > Results)
 * - Account section navigation (Home > Account > Profile)
 * - Checkout progress breadcrumbs
 * 
 * EXAMPLES:
 * - <Breadcrumbs items={[{label: "Home", href: "/"}, {label: "Store", href: "/store"}, {label: "Product", current: true}]} />
 * - <Breadcrumbs items={categoryPath} showHome={false} />
 * - <Breadcrumbs items={searchBreadcrumbs} separator={<span>/</span>} />
 * 
 * @example
 * // Basic usage
 * <Breadcrumbs items={[
 *   { label: "Home", href: "/" },
 *   { label: "Store", href: "/store" },
 *   { label: "Product Name", current: true }
 * ]} />
 * 
 * @example
 * // With custom separator
 * <Breadcrumbs 
 *   items={breadcrumbItems}
 *   separator={<span>/</span>}
 *   showHome={false}
 * />
 */

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: ReactNode;
  showHome?: boolean;
  homeLabel?: string;
  homeHref?: string;
}

const Breadcrumbs = ({
  items,
  className,
  separator,
  showHome = true,
  homeLabel = "Home",
  homeHref = "/",
}: BreadcrumbsProps) => {
  const defaultSeparator = (
    <ChevronRight className="text-secondary-text" />
  )

  const allItems = showHome
    ? [{ label: homeLabel, href: homeHref }, ...items]
    : items

  return (
    <nav
      className={clx(
        "flex items-center space-x-2 txt-small",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const isCurrent = item.current || isLast

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2">
                  {separator || defaultSeparator}
                </span>
              )}
              
              {item.href && !isCurrent ? (
                <Link
                  to={item.href}
                  className="text-secondary-text hover:text-secondary-text-hover transition-colors duration-200"
                >
                  <span className="txt-small">{item.label}</span>
                </Link>
              ) : (
                <span
                  className={clx(
                    isCurrent
                      ? "text-primary-text txt-small-plus"
                      : "text-secondary-text txt-small"
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
