import AccountLayout from "@/components/account/account-layout"
import OrdersTemplate from "@/components/account/orders-template"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import { Navigate, useParams } from "@tanstack/react-router"
import Loading from "@/components/common/loading"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for customer order history pages in the storefront
 * - Account pages: customer order history and tracking
 * - Order management: view and track customer orders
 * - Mobile commerce: mobile-optimized order history
 * - Order tracking: order status and fulfillment information
 * - Customer service: order information for support
 *
 * ECOMMERCE CONTEXT:
 * - Critical for customer account management
 * - Essential for order tracking and status updates
 * - Important for customer retention and loyalty
 * - Required for order history and management
 * - Used in customer service and support
 * - Important for mobile commerce experience
 *
 * ORDER HISTORY FEATURES:
 * - Order history display and management
 * - Order status tracking and indication
 * - Order details and item information
 * - Order date and pricing information
 * - Product thumbnails and quantity display
 * - Responsive design for mobile/desktop
 *
 * PAGE STRUCTURE:
 * - Authentication check and redirect
 * - Loading states during data fetching
 * - Account layout with order history
 * - Orders template with full functionality
 *
 * COMMON PATTERNS:
 * - Customer order history pages
 * - Mobile order tracking
 * - Order status display
 * - Order management interface
 * - Customer service order info
 *
 * EXAMPLES:
 * - Account orders page
 * - Mobile order history
 * - Customer order tracking
 * - Order management interface
 */
const AccountOrders = () => {
  const { countryCode } = useParams({
    from: "/$countryCode/account/orders/"
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
      <OrdersTemplate />
    </AccountLayout>
  )
}

export default AccountOrders
