import { useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { useCategories } from "@/lib/hooks/static/use-categories"
import CartDropdown from "@/components/cart/cart-dropdown"
import { Navbar, MenuItem } from "@/components/navbar"

export const NavbarContent = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const { data: topLevelCategories } = useCategories({
    fields: "id,name,handle,parent_category_id",
    queryParams: {
      parent_category_id: "null",
    },
  })

  return (
    <Navbar>
      <Navbar.Menu>
        <MenuItem>
          <MenuItem.Label>Store</MenuItem.Label>
          <MenuItem.Dropdown>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Categories */}
              <div className="flex flex-col gap-6 px-6 py-6 lg:px-0 lg:py-0">
                <h3 className="text-primary-text txt-medium uppercase">
                  Categories
                </h3>

                {topLevelCategories && topLevelCategories.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    <MenuItem.Link to={`${baseHref}/store`}>
                      Shop all
                    </MenuItem.Link>

                    {topLevelCategories.map((category) => (
                      <MenuItem.Link
                        key={category.id}
                        to={`${baseHref}/categories/${category.handle}`}
                      >
                        {category.name}
                      </MenuItem.Link>
                    ))}
                  </div>
                ) : (
                  <MenuItem.Link to={`${baseHref}/store`}>
                    Shop all
                  </MenuItem.Link>
                )}
              </div>

              {/* Right Side - Image Placeholders */}
              <div className="hidden lg:grid grid-cols-2 gap-6">
                <div className="aspect-square bg-secondary-bg flex items-center justify-center">
                  <span className="text-secondary-text txt-small">
                    Image Placeholder
                  </span>
                </div>
                <div className="aspect-square bg-secondary-bg flex items-center justify-center">
                  <span className="text-secondary-text txt-small">
                    Image Placeholder
                  </span>
                </div>
              </div>
            </div>
          </MenuItem.Dropdown>
        </MenuItem>
      </Navbar.Menu>

      <Navbar.Logo to={baseHref}>Medusa Store</Navbar.Logo>

      <Navbar.Actions>
        <CartDropdown />
      </Navbar.Actions>
    </Navbar>
  )
}
