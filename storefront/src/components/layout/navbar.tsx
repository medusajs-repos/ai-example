import SideMenu from "@/components/layout/side-menu"
import { NavbarLink } from "@/components/layout/navbar-link"
import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/regions/regions"
import { useRegions } from "@/lib/hooks/static/use-region"
import CartDropdown from "@/components/cart/cart-dropdown"

export const Navbar = () => {
  const location = useLocation()
  const { data: regions } = useRegions()
  // Get country code from URL path
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto border-b duration-200 bg-primary-bg border-primary-border">
        <nav className="content-container txt-xsmall-plus text-secondary-text flex items-center justify-between w-full h-full">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions || []} />
            </div>
          </div>

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
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <NavbarLink
                to={`${baseHref}/account`}
              >
                Account
              </NavbarLink>
            </div>
            <CartDropdown />
          </div>
        </nav>
      </header>
    </div>
  )
}