import AccountLayout from "@/components/account/account-layout"
import OrderDetails from "@/components/order/order-details"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import { Navigate, useLoaderData } from "@tanstack/react-router"
import AccountContainer from "@/components/account/account-container"
import Loading from "@/components/common/loading"

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
