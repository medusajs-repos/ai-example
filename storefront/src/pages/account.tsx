import AccountLayout from "@/components/account/account-layout"
import Overview from "@/components/account/overview"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import { Navigate, useParams } from "@tanstack/react-router"
import Loading from "@/components/common/loading"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for customer account pages in the storefront
 * - Account pages: customer account management and overview
 * - User dashboard: personalized customer experience
 * - Account management: profile and preference management
 * - Mobile commerce: mobile-optimized account experience
 * - Customer service: account-related customer support
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for customer account management
 * - Essential for personalized shopping experiences
 * - Important for customer retention and loyalty
 * - Required for order history and tracking
 * - Used in customer service and support
 * - Important for mobile commerce experience
 * 
 * ACCOUNT FEATURES:
 * - Customer authentication and authorization
 * - Account overview and dashboard
 * - Order history and tracking
 * - Address book management
 * - Profile and preference settings
 * - Security and privacy controls
 * 
 * AUTHENTICATION:
 * - Redirects to login if not authenticated
 * - Customer data loading and validation
 * - Secure account access control
 * - Session management
 * 
 * LAYOUT STRUCTURE:
 * - Account layout with navigation
 * - Customer overview dashboard
 * - Responsive design for mobile/desktop
 * - Loading states during data fetching
 * 
 * COMMON PATTERNS:
 * - Customer account dashboard
 * - Mobile account optimization
 * - Account security features
 * - Customer service integration
 * - Personalization and preferences
 * 
 * EXAMPLES:
 * - Customer account dashboard
 * - Mobile-optimized account page
 * - Account with order history
 * - Account with address management
 */

const Account = () => {
  const { countryCode } = useParams({
    from: "/$countryCode/account/"
  })
  const { data: customer, isLoading } = useCustomer({
    retry: false
  })

  if (isLoading) {
    return <Loading className="max-w-sm mx-auto py-8" />
  }

  if (!customer) {
    return <Navigate to={`/${countryCode}/login` as any} />
  }

  return (
    <AccountLayout customer={customer}>
      <Overview customer={customer} />
    </AccountLayout>
  )
}

export default Account