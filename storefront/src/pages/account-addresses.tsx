import { Navigate, useParams } from "@tanstack/react-router"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import AccountLayout from "@/components/account/account-layout"
import AddressesTemplate from "@/components/account/addresses-template"
import Loading from "@/components/common/loading"

const AccountAddresses = () => {
  const { countryCode } = useParams({
    from: "/$countryCode/account/addresses"
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
      <AddressesTemplate customer={customer} />
    </AccountLayout>
  )
}

export default AccountAddresses