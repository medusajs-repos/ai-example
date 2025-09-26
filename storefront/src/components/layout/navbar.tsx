import { NavbarLink } from "@/components/layout/navbar-link"
import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import CartDropdown from "@/components/cart/cart-dropdown"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use as the main navigation component for the storefront
 * - Header navigation: primary site navigation and branding
 * - Mobile commerce: responsive navigation for mobile devices
 * - Multi-region stores: country-specific navigation
 * - Brand positioning: logo and brand identity display
 * - User account access: login and account management links
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for site navigation and user experience
 * - Essential for brand identity and recognition
 * - Important for cart access and shopping flow
 * - Required for account management and authentication
 * - Used in multi-region and international commerce
 * - Important for mobile commerce experience
 * 
 * NAVIGATION FEATURES:
 * - Brand logo and store name
 * - Primary navigation links (Store, Account)
 * - Shopping cart dropdown with item count
 * - Country-specific URL handling
 * - Sticky header for persistent navigation
 * - Responsive design for mobile/desktop
 * 
 * KEY COMPONENTS:
 * - Store logo/brand link
 * - Navigation links to main sections
 * - Cart dropdown with quick access
 * - Account access for logged-in users
 * - Country code handling for international stores
 * 
 * COMMON PATTERNS:
 * - Storefront site header navigation
 * - Mobile commerce navigation
 * - Multi-region store navigation
 * - Brand-focused navigation
 * - Cart-focused navigation
 * 
 * EXAMPLES:
 * - Main site navigation with cart
 * - Mobile-optimized navigation
 * - International store navigation
 * - Brand-focused header design
 */

export const Navbar = () => {
  const location = useLocation()
  // Get country code from URL path
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto border-b duration-200 bg-primary-bg border-primary-border">
        <nav className="content-container txt-xsmall-plus text-secondary-text flex items-center justify-between w-full h-full">
          <div className="flex items-center h-full">
            <Link
              to={baseHref}
              className="txt-xlarge-plus hover:text-primary-text-hover uppercase"
              data-testid="nav-store-link"
            >
              Medusa Store
            </Link>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <NavbarLink
              to={`${baseHref}/store`}
            >
              Store
            </NavbarLink>
            <NavbarLink
              to={`${baseHref}/account`}
            >
              Account
            </NavbarLink>
            <CartDropdown />
          </div>
        </nav>
      </header>
    </div>
  )
}