import CountrySelect from "@/components/common/country-select";
import { useCategories } from "@/lib/hooks/static/use-categories";
import { useRegions } from "@/lib/hooks/static/use-region";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { Link, useLocation } from "@tanstack/react-router";

const Footer = () => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const { data: categories } = useCategories({
    fields: "name,handle",
    queryParams: {
      parent_category_id: "null",
      limit: 3,
    },
  });

  const { data: regions } = useRegions({
    fields: "id, currency_code, *countries",
  });

  return (
    <footer
      className="bg-secondary-bg border-t border-secondary-border w-full"
      data-testid="footer"
    >
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 lg:flex-row items-start justify-between py-16">
          <div className="lg:w-1/3 flex flex-col gap-y-4">
            <Link
              to={baseHref || "/"}
              className="text-xlarge font-bold text-primary-text hover:text-primary-text-hover transition-colors w-fit"
            >
              Medusa Store
            </Link>
            <p className="text-secondary-text max-w-md text-base font-medium">
              Your modern ecommerce solution built with cutting-edge technology
              for exceptional shopping experiences.
            </p>
            <CountrySelect regions={regions ?? []} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {categories && categories.length > 0 ? (
              <FooterColumn
                title="Categories"
                links={categories.map((category) => ({
                  name: category.name,
                  url: `${baseHref}/categories/${category.handle}`,
                  isExternal: false,
                }))}
              />
            ) : (
              <div className="flex flex-col gap-y-4">
                <h3 className="text-primary-text text-sm font-medium uppercase tracking-wide">
                  Categories
                </h3>
                <p className="text-sm text-secondary-text">No categories</p>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-secondary-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-secondary-text">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link
                className="text-xs text-secondary-text hover:text-secondary-text-hover transition-colors"
                to={"/"}
              >
                Privacy Policy
              </Link>
              <Link
                className="text-xs text-secondary-text hover:text-secondary-text-hover transition-colors"
                to={"/"}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: {
    name: string;
    url: string;
    isExternal: boolean;
  }[];
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="text-primary-text text-sm font-medium uppercase tracking-wide">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.url} className="text-sm">
            {link.isExternal ? (
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-secondary-text hover:text-secondary-text-hover transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                to={link.url}
                className="text-secondary-text hover:text-secondary-text-hover transition-colors"
              >
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
