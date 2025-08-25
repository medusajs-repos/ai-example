import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@lib/util/regions"

const Footer = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ''

  return (
    <footer
      className="bg-gray-50 border-t border-gray-200 w-full mt-16"
      data-testid="footer"
    >
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 lg:flex-row items-start justify-between py-16">
          <div className="lg:w-1/3">
            <Link
              to={baseHref || '/' as any}
              className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              Medusa Store
            </Link>
            <p className="mt-4 text-gray-600 max-w-md">
              Your modern ecommerce solution built with cutting-edge technology for exceptional shopping experiences.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-col gap-y-4">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                Collections
              </h3>
              <ul className="space-y-3" data-testid="footer-collections">
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    to={`${baseHref}/collections/merch` as any}
                  >
                    Merch
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-4">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                Categories
              </h3>
              <ul className="space-y-3" data-testid="footer-categories">
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    to={`${baseHref}/categories/shirts` as any}
                  >
                    Shirts
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    to={`${baseHref}/categories/sweatshirts` as any}
                  >
                    Sweatshirts
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    to={`${baseHref}/categories/pants` as any}
                  >
                    Pants
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    to={`${baseHref}/categories/merch` as any}
                  >
                    Merch
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-4">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://github.com/medusajs"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/medusajs/nextjs-starter-medusa"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Source code
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-gray-500">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                to="/privacy-policy"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                to="/terms-of-service"
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