import { CartDropdown } from "@/components/cart"
import { MenuItem, Navbar } from "@/components/navbar-primitives"
import { useCategories } from "@/lib/hooks/use-categories"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useLocation } from "@tanstack/react-router"

export const NavbarContent = () => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const { data: topLevelCategories } = useCategories({
    fields: "id,name,handle,parent_category_id",
    queryParams: {
      parent_category_id: "null",
    },
  });

  const categoryLinks = [
    { id: "shop-all", name: "Shop all", to: `${baseHref}/store` },
    ...(topLevelCategories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      to: `${baseHref}/categories/${cat.handle}`,
    })) ?? []),
  ];

  return (
    <Navbar>
      <Navbar.Menu>
        <MenuItem>
          <MenuItem.Label>Store</MenuItem.Label>
          <MenuItem.Dropdown>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 py-6 lg:px-0 lg:py-0">
              <div className="flex flex-col gap-6">
                <h3 className="text-primary-text text-base font-medium uppercase">
                  Categories
                </h3>
                <div className="flex flex-col gap-3">
                  {categoryLinks.map((link) => (
                    <MenuItem.Link key={link.id} to={link.to}>
                      {link.name}
                    </MenuItem.Link>
                  ))}
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-6">
                {Array.from({ length: 2 }, (_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-secondary-bg flex items-center justify-center"
                  >
                    <span className="text-secondary-text text-sm">
                      Image Placeholder
                    </span>
                  </div>
                ))}
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
  );
};
