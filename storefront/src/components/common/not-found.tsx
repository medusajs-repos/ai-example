import { Heading } from "@medusajs/ui"
import { Button } from "@/components/common/button"
import { Link, useLocation } from "@tanstack/react-router"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for 404 error pages in the storefront
 * - Missing pages: display when users navigate to non-existent URLs
 * - Product pages: show when products are not found or removed
 * - Category pages: display when categories don't exist
 * - Search results: show when no results are found
 * - Account pages: display when account sections are not found
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for user experience and navigation
 * - Essential for SEO and search engine optimization
 * - Important for maintaining user engagement
 * - Required for proper error handling
 * - Used in product catalog management
 * - Important for customer retention
 * 
 * 404 PAGE FEATURES:
 * - Clear 404 error indication
 * - User-friendly error messaging
 * - Navigation back to homepage
 * - Current path display for debugging
 * - Professional error presentation
 * - Responsive design for mobile/desktop
 * 
 * ERROR HANDLING:
 * - Displays current path for reference
 * - Provides clear navigation options
 * - Maintains brand consistency
 * - Offers alternative navigation paths
 * 
 * COMMON PATTERNS:
 * - Product not found pages
 * - Category not found pages
 * - Search no results pages
 * - Account section not found
 * - General 404 error pages
 * 
 * EXAMPLES:
 * - <NotFound /> // Generic 404 page
 * - Product not found with search suggestions
 * - Category not found with similar categories
 * - Search no results with alternative suggestions
 */

const NotFound = () => {
  const location = useLocation()

  return (
    <div className="content-container py-12">
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <div className="max-w-md space-y-6">
          {/* Large 404 */}
          <h1 className="text-8xl font-light text-primary-text">404</h1>
          
          {/* Main message */}
          <div className="space-y-2">
            <Heading
              level="h1"
              className="txt-xlarge-plus text-primary-text"
            >
              Page not found
            </Heading>
            <p className="text-secondary-text">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Current path */}
          <div className="px-4 py-2 bg-secondary-bg font-mono txt-small text-secondary-text">
            {location.pathname}
          </div>

          {/* Action button */}
          <Link to="/">
            <Button className="px-6 py-3" variant="primary">
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound