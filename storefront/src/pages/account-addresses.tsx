import { Navigate } from "@tanstack/react-router"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import AccountLayout from "@/components/account/account-layout"
import AddressesTemplate from "@/components/account/addresses-template"

const AccountAddresses = () => {
  const { data: customer, isLoading } = useCustomer()

  if (isLoading) {
    return (
      <div className="content-container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="txt-large text-primary-text">Loading account...</div>
        </div>
      </div>
    )
  }

  // Redirect if not logged in
  if (!customer) {
    return <Navigate to="/login" />
  }

  return (
    <AccountLayout customer={customer}>
      <AddressesTemplate customer={customer} />
    </AccountLayout>
  )
}

export default AccountAddresses