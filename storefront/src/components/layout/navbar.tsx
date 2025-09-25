import { NavbarLink } from "@/components/layout/navbar-link"
import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/regions/get-country-code-from-path"
import CartDropdown from "@/components/cart/cart-dropdown"

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
              to={"/"}
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