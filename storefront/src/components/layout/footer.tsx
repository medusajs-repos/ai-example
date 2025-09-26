import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { useCategories } from "@/lib/hooks/static/use-categories"
import { useRegions } from "@/lib/hooks/static/use-region"
import CountrySelect from "@/components/common/country-select"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for site footer in the storefront
 * - Site footer: navigation links and company information
 * - Mobile commerce: mobile-optimized footer navigation
 * - SEO pages: footer links for search engine optimization
 * - Legal pages: terms of service and privacy policy links
 * - Contact information: company details and support
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for site navigation and user experience
 * - Essential for SEO and search engine optimization
 * - Important for legal compliance and trust
 * - Required for company information and contact
 * - Used in international commerce and localization
 * - Important for mobile commerce experience
 * 
 * FOOTER FEATURES:
 * - Company branding and information
 * - Navigation links to key sections
 * - Category links for product discovery
 * - Country/region selection for international stores
 * - Legal links (privacy, terms)
 * - Responsive design for mobile/desktop
 * 
 * NAVIGATION:
 * - Category links for product discovery
 * - Resource links for documentation
 * - Legal and compliance links
 * - Country selection for international stores
 * - Company information and branding
 * 
 * COMMON PATTERNS:
 * - Ecommerce site footer
 * - Mobile footer navigation
 * - International store footer
 * - Legal compliance footer
 * - Company information footer
 * 
 * EXAMPLES:
 * - <Footer /> // Site footer
 * - Mobile-optimized footer
 * - International store footer
 * - Legal compliance footer
 */

const Footer = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const { data: categories } = useCategories({
    fields: "name,handle",
    queryParams: {
      limit: 3
    }
  })
  const { data: regions } = useRegions({
    fields: "id, *countries",
  })

  const resourceLinks = [
    {
      name: "GitHub",
      url: "https://github.com/medusajs",
      isExternal: true
    },
    {
      name: "Documentation",
      url: "https://docs.medusajs.com",
      isExternal: true
    },
    {
      name: "Source code",
      url: "https://github.com/medusajs/nextjs-starter-medusa",
      isExternal: true
    }
  ]

  return (
    <footer
      className="bg-secondary-bg border-t border-secondary-border w-full"
      data-testid="footer"
    >
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 lg:flex-row items-start justify-between py-16">
          <div className="lg:w-1/3 flex flex-col gap-y-4">
            <Link
              to={baseHref || "/" as any}
              className="txt-xlarge-plus text-primary-text hover:text-primary-text-hover transition-colors w-fit"
            >
              Medusa Store
            </Link>
            <p className="text-secondary-text max-w-md txt-medium">
              Your modern ecommerce solution built with cutting-edge technology for exceptional shopping experiences.
            </p>
            <CountrySelect regions={regions ?? []} className="w-fit" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            <FooterColumn title="Categories" links={categories?.map((category) => ({
              name: category.name,
              url: `${baseHref}/categories/${category.handle}`,
              isExternal: false
            })) || []} />
            <FooterColumn title="Resources" links={resourceLinks} />
          </div>
        </div>
        <div className="border-t border-secondary-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="txt-xsmall text-secondary-text">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link
                className="txt-xsmall text-secondary-text hover:text-secondary-text-hover transition-colors"
                to={"#" as any}
              >
                Privacy Policy
              </Link>
              <Link
                className="txt-xsmall text-secondary-text hover:text-secondary-text-hover transition-colors"
                to={"#" as any}
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
      <h3 className="text-primary-text txt-small-plus uppercase tracking-wide">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.url} className="txt-small">
            {link.isExternal ? (
              <a href={link.url} target="_blank" rel="noreferrer" className="text-secondary-text hover:text-secondary-text-hover transition-colors">
                {link.name}
              </a>
            ) : (
              <Link to={link.url} className="text-secondary-text hover:text-secondary-text-hover transition-colors">
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )

}

export default Footer