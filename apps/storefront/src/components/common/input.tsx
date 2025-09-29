import { clx } from "@medusajs/ui"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for all text input fields in ecommerce forms
 * - Customer information: name, email, phone, address fields
 * - Search functionality: product search
 * - Promo codes: discount code entry fields
 * - Account forms: login, registration, profile updates
 * 
 * ECOMMERCE CONTEXT:
 * - Essential for customer data collection during checkout
 * - Used in search bars for product discovery
 * - Critical for address forms (shipping/billing)
 * - Required for user authentication and account management
 * 
 * COMMON PATTERNS:
 * - Email inputs for account creation and login
 * - Address inputs for shipping/billing information
 * - Search inputs for product discovery
 * - Promo code inputs for discounts
 * 
 * EXAMPLES:
 * - <Input type="email" placeholder="Enter your email" />
 * - <Input type="text" placeholder="Search products..." />
 */

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = ({
  className,
  ...props
}: InputProps) => {
  return (
    <input
      className={clx(
        "appearance-none shadow-none outline-none focus:outline-none",
        "border border-primary-border",
        "rounded-none",
        "txt-medium text-primary-text",
        "px-4 py-2 w-full",
        "bg-primary-bg",
        "placeholder:text-secondary-text",
        className
      )}
      {...props}
    />
  )
}