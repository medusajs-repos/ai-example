import { ChevronRight } from "@medusajs/icons"
import { Text, clx } from "@medusajs/ui"
import { Link } from "@tanstack/react-router"
import { ReactNode } from "react"

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

/**
 * Breadcrumbs component for navigation
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
    <ChevronRight className="text-ui-fg-muted" />
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
                  className="text-ui-fg-subtle hover:text-ui-fg-base transition-colors duration-200"
                >
                  <Text className="txt-small">{item.label}</Text>
                </Link>
              ) : (
                <Text
                  className={clx(
                    isCurrent
                      ? "text-ui-fg-base txt-small-plus"
                      : "text-ui-fg-subtle txt-small"
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.label}
                </Text>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
