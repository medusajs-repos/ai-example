import { HttpTypes } from "@medusajs/types"
import { ReactNode } from "react"
import AccountNav from "./AccountNav"

interface AccountLayoutProps {
  children: ReactNode
  customer: HttpTypes.StoreCustomer
}

const AccountLayout = ({ children, customer }: AccountLayoutProps) => {
  return (
    <div className="flex-1 small:py-12">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-12">
          <div>
            {customer && <AccountNav customer={customer} />}
          </div>
          <div className="flex-1">
            {children}
          </div>
        </div>
        
        {/* Customer Service Footer */}
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-ui-border-base py-12 gap-8">
          <div>
            <h3 className="txt-xlarge-semi mb-4">Got questions?</h3>
            <p className="txt-medium-regular">
              You can find frequently asked questions and answers on our customer service page.
            </p>
          </div>
          <div>
            <a href="/customer-service" className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover underline">
              Customer Service
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout