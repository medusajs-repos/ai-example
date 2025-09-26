import { Navigate, useParams } from "@tanstack/react-router"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import AccountLayout from "@/components/account/account-layout"
import ProfileTemplate from "@/components/account/profile-template"
import Loading from "@/components/common/loading"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for customer profile management pages in the storefront
 * - Account pages: customer profile information and editing
 * - Profile management: customer personal information updates
 * - Mobile commerce: mobile-optimized profile management
 * - Customer data: profile information display and editing
 * - User experience: clear profile information management
 *
 * ECOMMERCE CONTEXT:
 * - Critical for customer account management
 * - Essential for user experience and data management
 * - Important for customer retention and loyalty
 * - Required for profile information display and editing
 * - Used in customer service and support
 * - Important for mobile commerce experience
 *
 * PROFILE MANAGEMENT FEATURES:
 * - Customer profile information display
 * - Profile editing with form validation
 * - Name, email, and phone number management
 * - Success/error feedback and notifications
 * - Professional profile presentation
 * - Responsive design for mobile/desktop
 *
 * PAGE STRUCTURE:
 * - Authentication check and redirect
 * - Loading states during data fetching
 * - Account layout with profile management
 * - Profile template with full functionality
 *
 * COMMON PATTERNS:
 * - Customer profile management pages
 * - Mobile profile editing
 * - Profile information display
 * - Customer data management
 * - Account profile interface
 *
 * EXAMPLES:
 * - Account profile page
 * - Mobile profile management
 * - Customer profile editing
 * - Account profile interface
 */
const AccountProfile = () => {
  const { countryCode } = useParams({
    from: "/$countryCode/account/profile"
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
      <ProfileTemplate customer={customer} />
    </AccountLayout>
  )
}

export default AccountProfile