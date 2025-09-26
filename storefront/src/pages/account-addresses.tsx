import { Navigate, useParams } from "@tanstack/react-router"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import AccountLayout from "@/components/account/account-layout"
import AddressesTemplate from "@/components/account/addresses-template"
import Loading from "@/components/common/loading"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for customer address management pages in the storefront
 * - Account pages: customer address book management and editing
 * - Address management: add, edit, and delete customer addresses
 * - Mobile commerce: mobile-optimized address management
 * - Checkout optimization: saved addresses for faster checkout
 * - Customer service: address management for support
 *
 * ECOMMERCE CONTEXT:
 * - Critical for customer account management
 * - Essential for checkout optimization and speed
 * - Important for customer retention and loyalty
 * - Required for address book management
 * - Used in checkout flow optimization
 * - Important for mobile commerce experience
 *
 * ADDRESS MANAGEMENT FEATURES:
 * - Address book display and management
 * - Add new addresses with form validation
 * - Edit existing addresses with pre-filled forms
 * - Delete addresses with confirmation
 * - Default billing and shipping address indication
 * - Responsive design for mobile/desktop
 *
 * PAGE STRUCTURE:
 * - Authentication check and redirect
 * - Loading states during data fetching
 * - Account layout with address management
 * - Address template with full functionality
 *
 * COMMON PATTERNS:
 * - Customer address book pages
 * - Mobile address management
 * - Checkout address optimization
 * - Account address management
 * - Customer service address management
 *
 * EXAMPLES:
 * - Account addresses page
 * - Mobile address management
 * - Customer address book
 * - Checkout address optimization
 */
const AccountAddresses = () => {
  const { countryCode } = useParams({
    from: "/$countryCode/account/addresses"
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
      <AddressesTemplate customer={customer} />
    </AccountLayout>
  )
}

export default AccountAddresses