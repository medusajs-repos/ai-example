import { useCustomerOrders } from "@lib/hooks/useOrders";
import { getCountryCodeFromPath } from "@lib/util/regions";
import { HttpTypes } from "@medusajs/types";
import { Link, useLocation } from "@tanstack/react-router";
import AccountContainer from "./AccountContainer";

interface OverviewProps {
  customer: HttpTypes.StoreCustomer;
}

const Overview = ({ customer }: OverviewProps) => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";
  const { data: orders } = useCustomerOrders();
  const profileCompletion = getProfileCompletion(customer);
  const addressCount = customer.addresses?.length || 0;
  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <AccountContainer
      title={`Hello ${customer.first_name}`}
      description={`Welcome back to your account. Manage your profile, view orders, and update your preferences all in one place. Signed in as ${customer.email}`}
    >
      {/* Account Stats */}
      <div className="border-b border-ui-border-base pb-8">
        <h3 className="text-lg font-medium text-ui-fg-base mb-4">
          Account Summary
        </h3>
        <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
          <div className="bg-ui-bg-subtle/50 rounded-lg p-6 border border-ui-border-base">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="txt-small font-medium text-ui-fg-subtle mb-1">
                  Profile Completion
                </h4>
                <div className="flex items-baseline gap-x-2">
                  <span className="text-2xl font-light text-ui-fg-base">
                    {profileCompletion}%
                  </span>
                  <span className="txt-small text-ui-fg-subtle">Complete</span>
                </div>
              </div>
              <Link
                to={`${baseHref}/account/profile`}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover txt-small font-medium"
              >
                Edit profile
              </Link>
            </div>
          </div>

          <div className="bg-ui-bg-subtle/50 rounded-lg p-6 border border-ui-border-base">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="txt-small font-medium text-ui-fg-subtle mb-1">
                  Saved Addresses
                </h4>
                <div className="flex items-baseline gap-x-2">
                  <span className="text-2xl font-light text-ui-fg-base">
                    {addressCount}
                  </span>
                  <span className="txt-small text-ui-fg-subtle">
                    {addressCount === 1 ? "Address" : "Addresses"}
                  </span>
                </div>
              </div>
              <Link
                to={`${baseHref}/account/addresses`}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover txt-small font-medium"
              >
                Manage
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border-b border-ui-border-base pb-8 last:border-b-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-ui-fg-base">Recent Orders</h3>
          <Link
            to={`${baseHref}/account/orders`}
            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover txt-small font-medium"
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
          <div className="text-center py-8 bg-ui-bg-subtle/30 rounded-lg border border-ui-border-base">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-ui-bg-subtle flex items-center justify-center">
              <svg
                className="w-5 h-5 text-ui-fg-muted"
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
            <p className="text-ui-fg-subtle txt-small mb-4">No orders yet</p>
            <Link
              to={`${baseHref}/store`}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover txt-small font-medium"
            >
              Start shopping
            </Link>
          </div>
        )}
      </div>
    </AccountContainer>
  );
};

const getProfileCompletion = (customer: HttpTypes.StoreCustomer): number => {
  let filledFields = 0;
  const totalFields = 5;

  // Email (always exists for registered users)
  if (customer.email) filledFields++;

  // Full name
  if (customer.first_name && customer.last_name) filledFields++;

  // Phone number
  if (customer.phone) filledFields++;

  // Billing address
  if (
    customer.billing_address &&
    customer.billing_address.address_1 &&
    customer.billing_address.city &&
    customer.billing_address.country_code
  ) {
    filledFields++;
  }

  // At least one saved address
  if (customer.addresses && customer.addresses.length > 0) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
};

const RecentOrderItem = ({
  order,
  baseHref,
}: {
  order: HttpTypes.StoreOrder;
  baseHref: string;
}) => {
  const getOrderStatus = () => {
    if (order.fulfillment_status === "shipped")
      return { label: "Shipped", color: "text-blue-600" };
    if (order.fulfillment_status === "delivered")
      return { label: "Delivered", color: "text-green-600" };
    if (order.payment_status === "captured")
      return { label: "Processing", color: "text-yellow-600" };
    return { label: "Confirmed", color: "text-ui-fg-base" };
  };

  const status = getOrderStatus();
  const numberOfItems =
    order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <Link
      to={`${baseHref}/account/orders/details/${order.id}`}
      className="block bg-white border border-ui-border-base rounded-lg p-4 hover:shadow-sm transition-shadow group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-x-3">
          <span className="font-medium text-ui-fg-base">
            Order #{order.display_id}
          </span>
          <span className={`txt-xsmall font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        <span className="text-ui-fg-interactive group-hover:text-ui-fg-interactive-hover txt-small font-medium">
          View details →
        </span>
      </div>

      <div className="flex items-center justify-between txt-small text-ui-fg-subtle">
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
          <span className="font-medium text-ui-fg-base">
            {order.currency_code?.toUpperCase()} {(order.total || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Overview;
