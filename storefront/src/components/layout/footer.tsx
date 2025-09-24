import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/regions/get-country-code-from-path"

const Footer = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  // TODO retrieve categories from APIs

  return (
    <footer
      className="bg-secondary-bg border-t border-secondary-border w-full mt-16"
      data-testid="footer"
    >
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 lg:flex-row items-start justify-between py-16">
          <div className="lg:w-1/3">
            <Link
              to={baseHref || "/" as any}
              className="txt-xlarge-plus text-primary-text hover:text-primary-text-hover transition-colors"
            >
              Medusa Store
            </Link>
            <p className="mt-4 text-secondary-text max-w-md">
              Your modern ecommerce solution built with cutting-edge technology for exceptional shopping experiences.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-primary-text txt-medium-plus uppercase tracking-wide">
                Collections
              </h3>
              <ul className="space-y-3" data-testid="footer-collections">
                <li>
                  <Link
                    className="text-secondary-text hover:text-secondary-text-hover transition-colors"
                    to={`${baseHref}/collections/merch` as any}
                  >
                    Merch
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-4">
              <h3 className="text-primary-text txt-medium-plus uppercase tracking-wide">
                Categories
              </h3>
              <ul className="space-y-3" data-testid="footer-categories">
                <li>
                  <Link
                    className="text-secondary-text hover:text-secondary-text-hover transition-colors"
                    to={`${baseHref}/categories/shirts` as any}
                  >
                    Shirts
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-secondary-text hover:text-secondary-text-hover transition-colors"
                    to={`${baseHref}/categories/sweatshirts` as any}
                  >
                    Sweatshirts
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-secondary-text hover:text-secondary-text-hover transition-colors"
                    to={`${baseHref}/categories/pants` as any}
                  >
                    Pants
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-secondary-text hover:text-secondary-text-hover transition-colors"
                    to={`${baseHref}/categories/merch` as any}
                  >
                    Merch
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-4">
              <h3 className="text-primary-text txt-medium-plus uppercase tracking-wide">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://github.com/medusajs"
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-text hover:text-secondary-text-hover transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-text hover:text-secondary-text-hover transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/medusajs/nextjs-starter-medusa"
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-text hover:text-secondary-text-hover transition-colors"
                  >
                    Source code
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary-border pt-8 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="txt-small text-secondary-text">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link
                className="txt-small text-secondary-text hover:text-secondary-text-hover transition-colors"
                to={"/privacy-policy" as any}
              >
                Privacy Policy
              </Link>
              <Link
                className="txt-small text-secondary-text hover:text-secondary-text-hover transition-colors"
                to={"/terms-of-service" as any}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer