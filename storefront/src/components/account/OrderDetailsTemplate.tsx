import { getCountryCodeFromPath } from "@lib/util/regions";
import { HttpTypes } from "@medusajs/types";
import { Badge, Button } from "@medusajs/ui";
import { useLocation } from "@tanstack/react-router";
import AccountContainer from "./AccountContainer";

interface OrderDetailsTemplateProps {
  order: HttpTypes.StoreOrder;
}

const OrderDetailsTemplate = ({ order }: OrderDetailsTemplateProps) => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const orderStatus = getOrderStatus(
    order.fulfillment_status,
    order.payment_status
  );

  return (
    <AccountContainer
      title={`Order #${order.display_id}`}
      description={`Placed ${new Date(order.created_at!).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )} • ${orderStatus.label}`}
      backLink={{
        href: `${baseHref}/account/orders`,
        label: "Back to orders",
      }}
    >
      <div className="flex flex-col small:flex-row small:items-start small:justify-between gap-y-6 -mt-6 mb-6">
        <div className="flex items-center gap-x-4">
          <Badge
            variant={orderStatus.variant}
            className="text-sm font-medium px-3 py-1"
          >
            {orderStatus.label}
          </Badge>
        </div>

        <div className="flex gap-x-3">
          <Button variant="secondary" size="small" className="text-sm">
            Download Invoice
          </Button>
          <Button variant="secondary" size="small" className="text-sm">
            Reorder Items
          </Button>
        </div>
      </div>

      {/* Order Progress */}
      <div className="bg-ui-bg-subtle/50 border border-ui-border-base rounded-lg p-8">
        <h3 className="text-lg font-medium text-ui-fg-base mb-6">
          Order Progress
        </h3>
        <div className="space-y-4">
          <OrderTimelineItem
            status="Order confirmed"
            date={order.created_at!}
            isCompleted={true}
            icon="check"
          />
          <OrderTimelineItem
            status="Payment processed"
            date={order.created_at!}
            isCompleted={order.payment_status === "captured"}
            icon={order.payment_status === "captured" ? "check" : "clock"}
          />
          <OrderTimelineItem
            status={getFulfillmentStatusLabel(
              order.fulfillment_status || "not_fulfilled"
            )}
            date={order.created_at!}
            isCompleted={
              order.fulfillment_status === "shipped" ||
              order.fulfillment_status === "delivered"
            }
            icon={
              order.fulfillment_status === "shipped" ||
              order.fulfillment_status === "delivered"
                ? "check"
                : "clock"
            }
          />
        </div>
      </div>

      <div className="space-y-12">
        {/* Order Items */}
        <div className="bg-white border border-ui-border-base rounded-lg p-8">
          <h2 className="text-xl font-medium mb-8 text-ui-fg-base">
            Items ({order.items?.length || 0})
          </h2>
          <div className="space-y-6">
            {order.items?.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Summary */}
          <div className="bg-white border border-ui-border-base rounded-lg p-8">
            <h2 className="text-xl font-medium mb-8 text-ui-fg-base">
              Payment
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-ui-border-base">
                <span className="text-ui-fg-subtle">Subtotal</span>
                <span className="text-ui-fg-base font-medium">
                  {order.currency_code?.toUpperCase()}{" "}
                  {(order.subtotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-ui-border-base">
                <span className="text-ui-fg-subtle">Shipping</span>
                <span className="text-ui-fg-base font-medium">
                  {(order.shipping_total || 0) === 0
                    ? "Free"
                    : `${order.currency_code?.toUpperCase()} ${(
                        order.shipping_total || 0
                      ).toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-ui-border-base">
                <span className="text-ui-fg-subtle">Tax</span>
                <span className="text-ui-fg-base font-medium">
                  {order.currency_code?.toUpperCase()}{" "}
                  {(order.tax_total || 0).toFixed(2)}
                </span>
              </div>
              <div className="border-t-2 border-ui-border-base pt-6 flex items-center justify-between">
                <span className="text-xl font-medium text-ui-fg-base">
                  Total
                </span>
                <span className="text-xl font-medium text-ui-fg-base">
                  {order.currency_code?.toUpperCase()}{" "}
                  {(order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-8 pt-8 border-t border-ui-border-base">
              <h3 className="text-lg font-medium text-ui-fg-base mb-6">
                Payment Method
              </h3>
              <div className="flex items-center gap-x-3">
                <div className="w-8 h-8 bg-ui-bg-subtle rounded border border-ui-border-base flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-ui-fg-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-ui-fg-base capitalize">
                    {order.payments?.[0]?.provider_id || "Card"}
                  </div>
                  <div className="text-xs text-ui-fg-subtle">
                    •••• {order.payments?.[0]?.data?.last4 || "****"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Delivery */}
          <div className="bg-white border border-ui-border-base rounded-lg p-8">
            <h2 className="text-xl font-medium mb-8 text-ui-fg-base">
              Delivery
            </h2>

            {order.shipping_address && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-ui-fg-base mb-6">
                    Shipping Address
                  </h3>
                  <div className="bg-ui-bg-subtle/50 rounded-lg p-4 space-y-1 text-sm">
                    <div className="font-medium text-ui-fg-base">
                      {order.shipping_address.first_name}{" "}
                      {order.shipping_address.last_name}
                    </div>
                    <div className="text-ui-fg-subtle">
                      {order.shipping_address.address_1}
                      {order.shipping_address.address_2 &&
                        `, ${order.shipping_address.address_2}`}
                    </div>
                    <div className="text-ui-fg-subtle">
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.postal_code}
                    </div>
                    <div className="text-ui-fg-subtle">
                      {order.shipping_address.country_code?.toUpperCase()}
                    </div>
                    {order.shipping_address.phone && (
                      <div className="text-ui-fg-subtle pt-2 border-t border-ui-border-base">
                        {order.shipping_address.phone}
                      </div>
                    )}
                  </div>
                </div>

                {order.shipping_methods?.[0] && (
                  <div>
                    <h3 className="text-lg font-medium text-ui-fg-base mb-6">
                      Shipping Method
                    </h3>
                    <div className="flex items-center justify-between py-2 px-4 bg-ui-bg-subtle/50 rounded-lg">
                      <span className="text-sm text-ui-fg-base">
                        {order.shipping_methods[0].name}
                      </span>
                      <span className="text-sm font-medium text-ui-fg-base">
                        {(order.shipping_total || 0) === 0
                          ? "Free"
                          : `${order.currency_code?.toUpperCase()} ${(
                              order.shipping_total || 0
                            ).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AccountContainer>
  );
};

const OrderItem = ({ item }: { item: HttpTypes.StoreOrderLineItem }) => {
  const productImage =
    item.variant?.product?.thumbnail ||
    item.product?.thumbnail ||
    item.thumbnail;

  return (
    <div className="flex items-center gap-x-4 p-4 bg-ui-bg-subtle/30 rounded-lg">
      <div className="w-16 h-16 relative aspect-square bg-white border border-ui-border-base rounded-lg overflow-hidden flex-shrink-0">
        {productImage ? (
          <img
            src={productImage}
            alt={item.product_title || "Product image"}
            className="absolute inset-0 object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ui-fg-muted text-xs">
            N/A
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-ui-fg-base leading-tight truncate">
          {item.product_title}
        </h3>
        <div className="flex items-center gap-x-4 mt-1">
          {item.variant && item.variant.title !== "Default" && (
            <span className="text-sm text-ui-fg-subtle">
              {item.variant.title}
            </span>
          )}
          <span className="text-sm text-ui-fg-subtle">
            Qty: {item.quantity}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium text-ui-fg-base">
          {item.currency_code?.toUpperCase()} {(item.total || 0).toFixed(2)}
        </div>
        <div className="text-sm text-ui-fg-subtle">
          {item.currency_code?.toUpperCase()}{" "}
          {(item.unit_price || 0).toFixed(2)} each
        </div>
      </div>
    </div>
  );
};

const OrderTimelineItem = ({
  status,
  date,
  isCompleted,
  icon,
}: {
  status: string;
  date: string;
  isCompleted: boolean;
  icon: "check" | "clock";
}) => {
  return (
    <div className="flex items-center gap-x-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCompleted
            ? "bg-green-100 text-green-600"
            : "bg-ui-bg-subtle text-ui-fg-muted"
        }`}
      >
        {icon === "check" ? (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <div
          className={`font-medium ${
            isCompleted ? "text-ui-fg-base" : "text-ui-fg-subtle"
          }`}
        >
          {status}
        </div>
        <div className="text-sm text-ui-fg-subtle">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

const getOrderStatus = (fulfillmentStatus: string, paymentStatus: string) => {
  if (paymentStatus === "awaiting") {
    return { label: "Payment Pending", variant: "orange" as const };
  }

  if (fulfillmentStatus === "shipped") {
    return { label: "Shipped", variant: "blue" as const };
  }

  if (fulfillmentStatus === "delivered") {
    return { label: "Delivered", variant: "green" as const };
  }

  if (fulfillmentStatus === "canceled") {
    return { label: "Canceled", variant: "red" as const };
  }

  if (paymentStatus === "captured") {
    return { label: "Processing", variant: "blue" as const };
  }

  return { label: "Confirmed", variant: "green" as const };
};

const getFulfillmentStatusLabel = (status: string) => {
  switch (status) {
    case "not_fulfilled":
      return "Processing";
    case "partially_fulfilled":
      return "Partially shipped";
    case "fulfilled":
      return "Fulfilled";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "canceled":
      return "Canceled";
    default:
      return status;
  }
};

export default OrderDetailsTemplate;
