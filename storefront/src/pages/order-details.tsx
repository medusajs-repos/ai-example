import AccountLayout from "@/components/account/account-layout"
import OrderDetails from "@/components/order/order-details"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import { useLoaderData, useLocation } from "@tanstack/react-router"
import AccountContainer from "@/components/account/account-container"
import { getCountryCodeFromPath } from "@/lib/utils/regions/get-country-code-from-path"

const OrderDetailsPage = () => {
  const { order } = useLoaderData({
    from: "/$countryCode/account/orders/details/$id"
  })
  const { data: customer } = useCustomer()
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

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
          href: `${baseHref}/account/orders`,
          label: "Back to orders",
        }}
      >
        <OrderDetails order={order} />
      </AccountContainer>
    </AccountLayout>
  )
}

export default OrderDetailsPage
