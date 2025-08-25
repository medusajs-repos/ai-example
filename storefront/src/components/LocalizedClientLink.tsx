import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@lib/util/regions"
import { ReactNode } from "react"

interface LocalizedClientLinkProps {
  href: string
  children: ReactNode
  className?: string
}

const LocalizedClientLink = ({ href, children, className }: LocalizedClientLinkProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const localizedHref = countryCode ? `/${countryCode}${href}` : href

  return (
    <Link to={localizedHref} className={className}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink