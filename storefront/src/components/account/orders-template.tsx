
import { useCustomerOrders } from "@/lib/hooks/static/use-orders"
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { HttpTypes } from "@medusajs/types"
import { Link, useLocation } from "@tanstack/react-router"
import AccountContainer from "@/components/account/account-container"
import { Price } from "@/components/common/price"
import { Thumbnail } from "@/components/common/thumbnail"

const OrdersTemplate = () => {
  const { data: orders, isLoading } = useCustomerOrders()
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  if (isLoading) {
    return (
      <AccountContainer
        title="Orders"
        description="View and track your order history, check delivery status, and reorder your favorite items."
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border-b border-ui-border-base pb-8 animate-pulse"
          >
            <div className="h-4 bg-ui-bg-subtle rounded w-32 mb-2"></div>
            <div className="h-3 bg-ui-bg-subtle rounded w-24 mb-4"></div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-ui-bg-subtle rounded"></div>
              <div className="w-12 h-12 bg-ui-bg-subtle rounded"></div>
              <div className="w-12 h-12 bg-ui-bg-subtle rounded"></div>
            </div>
          </div>
        ))}
      </AccountContainer>
    )
  }

  return (
    <AccountContainer
      title="Orders"
      description="View and track your order history, check delivery status, and reorder your favorite items."
    >
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <OrderItem key={order.id} order={order} baseHref={baseHref} />
        ))
      ) : (
        <div className="border-b border-primary-border pb-8 text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-ui-bg-subtle flex items-center justify-center">
            <svg
              className="w-6 h-6 text-secondary-text"
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
          <h3 className="txt-large-plus text-primary-text mb-3">
            No orders yet
          </h3>
          <p className="txt-medium text-secondary-text mb-8 leading-relaxed max-w-md mx-auto">
            When you place your first order, it will appear here for easy
            tracking and management.
          </p>
          <Link to={`${baseHref}/store` as any}>
            <span className="inline-flex items-center px-6 py-2 txt-small font-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover border-b border-transparent hover:border-ui-fg-interactive transition-colors">
              Start Shopping
            </span>
          </Link>
        </div>
      )}
    </AccountContainer>
  )
}

interface OrderCardProps {
  order: HttpTypes.StoreOrder;
  baseHref: string;
}

const OrderItem = ({ order, baseHref }: OrderCardProps) => {
  const numberOfLines =
    order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const numberOfProducts = order.items?.length || 0

  const getOrderStatus = () => {
    if (order.fulfillment_status === "shipped")
      return { label: "Shipped", color: "text-blue-600" }
    if (order.fulfillment_status === "delivered")
      return { label: "Delivered", color: "text-green-600" }
    if (order.payment_status === "captured")
      return { label: "Processing", color: "text-yellow-600" }
    return { label: "Confirmed", color: "text-ui-fg-base" }
  }

  const status = getOrderStatus()

  return (
    <div className="border-b border-primary-border pb-8 last:border-b-0">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col flex-1">
          <h3 className="txt-large-plus text-primary-text mb-3">
            Order #{order.display_id}
          </h3>
          <div className="flex items-center gap-x-4 text-secondary-text mb-4">
            <span>
              {new Date(order.created_at!).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className={`txt-small-plus ${status.color}`}>
              {status.label}
            </span>
            <span>
              {numberOfLines} {numberOfLines !== 1 ? "items" : "item"}
            </span>
            <Price
              price={order.total}
              currencyCode={order.currency_code}
              textSize="small"
            />
          </div>

          {/* Product thumbnails */}
          <div className="flex items-center gap-x-2">
            {order.items?.slice(0, 5).map((item) => {
              return (
                <div key={item.id} className="relative">
                  <Thumbnail thumbnail={item.thumbnail} alt={item.title} />
                  {item.quantity > 1 && (
                    <div className="absolute -top-1 -right-1 bg-primary-text text-white txt-xsmall rounded-full w-4 h-4 flex items-center justify-center">
                      {item.quantity}
                    </div>
                  )}
                </div>
              )
            })}
            {numberOfProducts > 5 && (
              <div className="w-12 h-12 rounded-md border border-primary-border bg-secondary-bg flex items-center justify-center txt-xsmall text-secondary-text">
                +{numberOfProducts - 5}
              </div>
            )}
          </div>
        </div>

        <Link
          to={`${baseHref}/account/orders/details/${order.id}` as any}
          className="text-accent-text hover:text-accent-text-hover txt-small px-0 h-auto"
        >
          View details
        </Link>
      </div>
    </div>
  )
}

export default OrdersTemplate
