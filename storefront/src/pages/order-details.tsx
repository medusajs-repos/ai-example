import AccountLayout from "@/components/account/account-layout"
import OrderDetails from "@/components/order/order-details"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import { Navigate, useLoaderData } from "@tanstack/react-router"
import AccountContainer from "@/components/account/account-container"
import Loading from "@/components/common/loading"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for detailed order information pages in the storefront
 * - Order details: comprehensive order information and tracking
 * - Order management: detailed order view and status
 * - Mobile commerce: mobile-optimized order details
 * - Customer service: order information for support
 * - Order tracking: detailed order status and fulfillment
 *
 * ECOMMERCE CONTEXT:
 * - Critical for order tracking and customer satisfaction
 * - Essential for order details and status updates
 * - Important for customer service and support
 * - Required for order history and management
 * - Used in order fulfillment and tracking
 * - Important for mobile commerce experience
 *
 * ORDER DETAILS FEATURES:
 * - Complete order information display
 * - Order status and fulfillment tracking
 * - Order items and pricing details
 * - Shipping and billing information
 * - Professional order presentation
 * - Responsive design for mobile/desktop
 *
 * PAGE STRUCTURE:
 * - Authentication check and redirect
 * - Loading states during data fetching
 * - Account layout with order details
 * - Complete order information display
 *
 * COMMON PATTERNS:
 * - Order details pages
 * - Mobile order tracking
 * - Order management interface
 * - Customer service order info
 * - Order fulfillment tracking
 *
 * EXAMPLES:
 * - Order details page
 * - Mobile order tracking
 * - Order management interface
 * - Customer service order info
 */
const OrderDetailsPage = () => {
  const { countryCode, order } = useLoaderData({
    from: "/$countryCode/account/orders/details/$id"
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
      <AccountContainer
        title={`Order #${order.display_id}`}
        description={`Placed ${new Date(order.created_at!).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )} • ${order.status}`}
        backLink={{
          href: `/${countryCode}/account/orders`,
          label: "Back to orders",
        }}
      >
        <OrderDetails order={order} />
      </AccountContainer>
    </AccountLayout>
  )
}

export default OrderDetailsPage
