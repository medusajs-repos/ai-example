import { Navigate } from '@tanstack/react-router'
import { useCustomer } from '@lib/hooks/useAuth'
import AccountLayout from '@components/account/AccountLayout'
import Overview from '@components/account/Overview'

const Account = () => {
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

  // Redirect if not logged in
  if (!customer) {
    return <Navigate to="/login" />
  }

  return (
    <AccountLayout customer={customer}>
      <Overview customer={customer} />
    </AccountLayout>
  )
}

export default Account