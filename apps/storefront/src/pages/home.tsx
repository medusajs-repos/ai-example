import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"

/**
 * Home Page Pattern
 *
 * Demonstrates:
 * - Basic page structure
 * - Navigation to store
 */
const Home = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const storeHref = countryCode ? `/${countryCode}/store` : "/store"

  return (
    <div className="content-container py-12">
      <h1 className="text-2xl mb-4">Welcome</h1>
      <p className="text-secondary-text mb-6">
        Browse our products in the store.
      </p>
      <Link to={storeHref as string} className="text-accent-text underline">
        Go to Store →
      </Link>
    </div>
  )
}

export default Home
