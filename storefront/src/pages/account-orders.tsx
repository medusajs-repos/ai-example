import AccountLayout from "@/components/account/account-layout"
import OrdersTemplate from "@/components/account/orders-template"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import { Navigate } from "@tanstack/react-router"

const AccountOrders = () => {
  const { data: customer, isLoading } = useCustomer()

  if (isLoading) {
    return (
      <div className="content-container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-ui-fg-muted">Loading account...</div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return <Navigate to="/login" />
  }

  return (
    <AccountLayout customer={customer}>
      <OrdersTemplate />
    </AccountLayout>
  )
}

export default AccountOrders
