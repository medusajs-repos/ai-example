import { Navigate, useParams } from "@tanstack/react-router"
import { useCustomer } from "@/lib/hooks/dynamic/use-auth"
import AccountLayout from "@/components/account/account-layout"
import ProfileTemplate from "@/components/account/profile-template"
import Loading from "@/components/common/loading"

const AccountProfile = () => {
  const { countryCode } = useParams({
    from: "/$countryCode/account/profile"
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
      <ProfileTemplate customer={customer} />
    </AccountLayout>
  )
}

export default AccountProfile