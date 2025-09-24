import { useLogout } from "@/lib/hooks/dynamic/use-auth"
import { getCountryCodeFromPath } from "@/lib/utils/regions/regions"
import { MapPin, ShoppingCart, User } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Link, useLocation } from "@tanstack/react-router"
import { useState } from "react"

const AccountNav = () => {
  const location = useLocation()
  const logout = useLogout()
  const [isOpen, setIsOpen] = useState(false)

  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const handleLogout = () => {
    logout.mutate()
  }

  const route = location.pathname.split("/").pop()

  const navigation = [
    {
      name: "Overview",
      href: `${baseHref}/account`,
      icon: User,
      current: route === "account" || !route,
    },
    {
      name: "Profile",
      href: `${baseHref}/account/profile`,
      icon: User,
      current: route === "profile",
    },
    {
      name: "Addresses",
      href: `${baseHref}/account/addresses`,
      icon: MapPin,
      current: route === "addresses",
    },
    {
      name: "Orders",
      href: `${baseHref}/account/orders`,
      icon: ShoppingCart,
      current: route === "orders",
    },
  ]

  return (
    <div>
      {/* Mobile menu button */}
      <div className="small:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-x-2 txt-small py-2"
        >
          <User />
          <span>Account</span>
        </button>
      </div>

      {/* Navigation */}
      <div className={clx("small:block", { hidden: !isOpen })}>
        <div className="pb-12 small:pb-0">
          <h3 className="txt-medium-plus text-primary-text mb-4 small:mb-8">
            Account
          </h3>
          <div className="txt-medium">
            <ul className="mb-8 gap-y-4 flex flex-col">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={clx(
                      "flex items-center justify-between py-2 border-l pl-8 border-transparent",
                      {
                        "text-primary-text border-accent-text txt-medium-plus":
                          item.current,
                        "text-secondary-text hover:text-primary-text":
                          !item.current,
                      }
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="txt-small">
              <button
                type="button"
                className="flex items-center justify-between py-2 border-l pl-8 border-transparent text-secondary-text hover:text-secondary-text-hover"
                onClick={handleLogout}
                disabled={logout.isPending}
              >
                {logout.isPending ? "Logging out..." : "Log out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountNav
