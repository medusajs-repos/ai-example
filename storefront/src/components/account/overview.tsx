import { useCustomerOrders } from "@/lib/hooks/static/use-orders"
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { HttpTypes } from "@medusajs/types"
import { Link, useLocation } from "@tanstack/react-router"
import AccountContainer from "@/components/account/account-container"
import { Price } from "@/components/common/price"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for customer account overview in the storefront
 * - Account dashboard: main customer account information and stats
 * - Customer profile: profile completion and account summary
 * - Order history: recent orders and order management
 * - Mobile commerce: mobile-optimized account overview
 * - Customer engagement: encourage profile completion and engagement
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for customer account management
 * - Essential for customer engagement and retention
 * - Important for order history and tracking
 * - Required for profile completion and data collection
 * - Used in customer service and support
 * - Important for mobile commerce experience
 * 
 * OVERVIEW FEATURES:
 * - Account summary with profile completion
 * - Saved addresses count and management
 * - Recent orders display and tracking
 * - Order status and fulfillment information
 * - Quick access to account sections
 * - Responsive design for mobile/desktop
 * 
 * ACCOUNT STATS:
 * - Profile completion percentage
 * - Saved addresses count
 * - Recent orders display
 * - Order status tracking
 * - Quick navigation to account sections
 * 
 * COMMON PATTERNS:
 * - Customer account dashboard
 * - Mobile account overview
 * - Order history display
 * - Profile completion tracking
 * - Account management interface
 * 
 * EXAMPLES:
 * - <Overview customer={customer} />
 * - Mobile account dashboard
 * - Customer profile overview
 * - Order history dashboard
 */

interface OverviewProps {
  customer: HttpTypes.StoreCustomer;
}

const Overview = ({ customer }: OverviewProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const { data: orders } = useCustomerOrders()
  const profileCompletion = getProfileCompletion(customer)
  const addressCount = customer.addresses?.length || 0
  const recentOrders = orders?.slice(0, 5) || []

  return (
    <AccountContainer
      title={`Profile`}
      description={`Manage your profile, view orders, and update your preferences all in one place. Signed in as ${customer.email}`}
    >
      {/* Account Stats */}
      <div className="border-b border-primary-border pb-8">
        <h3 className="txt-large-plus text-primary-text mb-4">
          Account Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-secondary-bg p-6 border border-primary-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="txt-small-plus text-secondary-text mb-1">
                  Profile Completion
                </h4>
                <div className="flex items-baseline gap-x-2">
                  <span className="text-2xl font-light text-primary-text">
                    {profileCompletion}%
                  </span>
                  <span className="txt-small text-secondary-text">Complete</span>
                </div>
              </div>
              <Link
                to={`${baseHref}/account/profile` as any}
                className="text-accent-text hover:text-accent-text-hover txt-small-plus"
              >
                Edit profile
              </Link>
            </div>
          </div>

          <div className="bg-secondary-bg p-6 border border-primary-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="txt-small-plus text-secondary-text mb-1">
                  Saved Addresses
                </h4>
                <div className="flex items-baseline gap-x-2">
                  <span className="text-2xl font-light text-primary-text">
                    {addressCount}
                  </span>
                  <span className="txt-small text-secondary-text">
                    {addressCount === 1 ? "Address" : "Addresses"}
                  </span>
                </div>
              </div>
              <Link
                to={`${baseHref}/account/addresses` as any}
                className="text-accent-text hover:text-accent-text-hover txt-small-plus"
              >
                Manage
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border-b border-primary-border pb-8 last:border-b-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="txt-large-plus text-primary-text">Recent Orders</h3>
          <Link
            to={`${baseHref}/account/orders` as any}
            className="text-accent-text hover:text-accent-text-hover txt-small-plus"
          >
            View all orders
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <RecentOrderItem
                key={order.id}
                order={order}
                baseHref={baseHref}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-secondary-bg border border-primary-border">
            <div className="w-12 h-12 mx-auto mb-4 bg-secondary-bg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-secondary-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="txt-medium text-secondary-text mb-4">No orders yet</p>
            <Link
              to={`${baseHref}/store` as any}
              className="text-accent-text hover:text-accent-text-hover txt-small-plus"
            >
              Start shopping
            </Link>
          </div>
        )}
      </div>
    </AccountContainer>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer): number => {
  let filledFields = 0
  const totalFields = 5

  // Email (always exists for registered users)
  if (customer.email) filledFields++

  // Full name
  if (customer.first_name && customer.last_name) filledFields++

  // Phone number
  if (customer.phone) filledFields++

  // Billing address
  if (
    customer.addresses?.length
  ) {
    filledFields++
  }

  return Math.round((filledFields / totalFields) * 100)
}

const RecentOrderItem = ({
  order,
  baseHref,
}: {
  order: HttpTypes.StoreOrder;
  baseHref: string;
}) => {
  const getOrderStatus = () => {
    if (order.fulfillment_status === "shipped")
      return { label: "Shipped", color: "text-accent-text" }
    if (order.fulfillment_status === "delivered")
      return { label: "Delivered", color: "text-success-text" }
    if (order.payment_status === "captured")
      return { label: "Processing", color: "text-orange-400" }
    return { label: "Confirmed", color: "text-primary-text" }
  }

  const status = getOrderStatus()
  const numberOfItems =
    order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <Link
      to={`${baseHref}/account/orders/details/${order.id}` as any}
      className="block bg-primary-bg border border-primary-border p-4 hover:shadow-sm transition-shadow group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-x-3">
          <span className="text-medium-plus text-primary-text">
            Order #{order.display_id}
          </span>
          <span className={`txt-xsmall-plus ${status.color}`}>
            {status.label}
          </span>
        </div>
        <span className="text-accent-text group-hover:text-accent-text-hover txt-small-plus">
          View details →
        </span>
      </div>

      <div className="flex items-center justify-between txt-small text-secondary-text">
        <span>
          {new Date(order.created_at!).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <div className="flex items-center gap-x-4">
          <span>
            {numberOfItems} {numberOfItems === 1 ? "item" : "items"}
          </span>
          <Price
            price={order.total}
            currencyCode={order.currency_code}
            textSize="small"
          />
        </div>
      </div>
    </Link>
  )
}

export default Overview
