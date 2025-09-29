import { HttpTypes } from "@medusajs/types"
import { ReactNode } from "react"
import AccountNav from "@/components/account/account-nav"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for account page layouts in the storefront
 * - Account pages: provides consistent layout for customer account sections
 * - Customer dashboard: structured layout for account management
 * - Mobile commerce: mobile-optimized account layout
 * - Account navigation: provides sidebar navigation for account sections
 * - Customer service: includes customer service information and links
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for customer account management
 * - Essential for user experience and navigation
 * - Important for customer retention and loyalty
 * - Required for account security and access
 * - Used in customer service and support
 * - Important for mobile commerce experience
 * 
 * LAYOUT FEATURES:
 * - Sidebar navigation for account sections
 * - Main content area for account information
 * - Customer service footer with support links
 * - Responsive design for mobile/desktop
 * - Professional account presentation
 * - Consistent branding and styling
 * 
 * ACCOUNT STRUCTURE:
 * - Navigation: sidebar with account sections
 * - Content: main account information and forms
 * - Footer: customer service and support information
 * - Responsive: mobile-optimized layout
 * 
 * COMMON PATTERNS:
 * - Customer account dashboard
 * - Mobile account layout
 * - Account navigation layout
 * - Customer service layout
 * - Account management interface
 * 
 * EXAMPLES:
 * - <AccountLayout customer={customer}><AccountContent /></AccountLayout>
 * - Mobile account layout
 * - Customer dashboard layout
 * - Account navigation layout
 */

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