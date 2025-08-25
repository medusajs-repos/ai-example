import { useLogout } from "@lib/hooks/useAuth";
import { getCountryCodeFromPath } from "@lib/util/regions";
import { MapPin, ShoppingCart, User } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { clx } from "@medusajs/ui";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";

interface AccountNavProps {
  customer: HttpTypes.StoreCustomer;
}

const AccountNav = ({ customer }: AccountNavProps) => {
  const location = useLocation();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const handleLogout = () => {
    logout.mutate();
  };

  const route = location.pathname.split("/").pop();

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
  ];

  return (
    <div>
      {/* Mobile menu button */}
      <div className="small:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-x-2 text-small-regular py-2"
        >
          <User />
          <span>Account</span>
        </button>
      </div>

      {/* Navigation */}
      <div className={clx("small:block", { hidden: !isOpen })}>
        <div className="pb-12 small:pb-0">
          <h3 className="text-base-semi text-ui-fg-base mb-4 small:mb-8">
            Account
          </h3>
          <div className="text-base-regular">
            <ul className="mb-8 gap-y-4 flex flex-col">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={clx(
                      "flex items-center justify-between py-2 border-l pl-8 border-transparent",
                      {
                        "text-ui-fg-base font-semibold border-ui-fg-interactive":
                          item.current,
                        "text-ui-fg-subtle hover:text-ui-fg-base":
                          !item.current,
                      }
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="text-small-regular">
              <button
                type="button"
                className="flex items-center justify-between py-2 border-l pl-8 border-transparent text-ui-fg-subtle hover:text-ui-fg-base"
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
  );
};

export default AccountNav;
