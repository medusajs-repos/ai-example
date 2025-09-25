import { HttpTypes } from "@medusajs/types"
import { ReactNode } from "react"
import AccountNav from "@/components/account/account-nav"

interface AccountLayoutProps {
  children: ReactNode
  customer?: HttpTypes.StoreCustomer | null
}

const AccountLayout = ({ children, customer }: AccountLayoutProps) => {
  return (
    <div className="flex-1 sm:py-12">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-primary-bg flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] py-12">
          <div>
            {customer && <AccountNav />}
          </div>
          <div className="flex-1">
            {children}
          </div>
        </div>
        
        {/* Customer Service Footer */}
        <div className="flex flex-col sm:flex-row items-end justify-between sm:border-t border-primary-border py-12 gap-8">
          <div>
            <h3 className="txt-xlarge-plus mb-4">Got questions?</h3>
            <p className="txt-medium">
              You can find frequently asked questions and answers on our customer service page.
            </p>
          </div>
          <div>
            <a href="/customer-service" className="text-accent-text hover:text-accent-text-hover underline">
              Customer Service
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout