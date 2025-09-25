import { useLogout } from "@/lib/hooks/dynamic/use-auth"
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { MapPin, ShoppingCart, User } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { useState } from "react"

const AccountNav = () => {
  const location = useLocation()
  const logout = useLogout()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate({
          to: `/${countryCode}/login` as any,
        })
      },
    })
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
      <div className="sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-x-2 txt-small py-2"
        >
          <User />
          <span>Account</span>
        </button>
      </div>

      {/* Navigation */}
      <div className={clx("sm:block", { hidden: !isOpen })}>
        <ul className="mb-8 gap-y-4 flex flex-col">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={clx(
                  "flex items-center justify-between",
                  {
                    "text-primary-text hover:text-primary-text-hover txt-medium-plus":
                      item.current,
                    "text-secondary-text hover:text-secondary-text-hover txt-medium":
                      !item.current,
                  }
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="flex items-center justify-between text-secondary-text hover:text-secondary-text-hover cursor-pointer txt-medium"
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AccountNav
