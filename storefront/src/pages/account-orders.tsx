import AccountLayout from "@/components/account/account-layout"
import OrdersTemplate from "@/components/account/orders-template"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import { Navigate, useParams } from "@tanstack/react-router"
import Loading from "@/components/common/loading"

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
