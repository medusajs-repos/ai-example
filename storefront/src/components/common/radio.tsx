import { forwardRef } from "react"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for single-selection form inputs in the storefront
 * - Product filters: single option selection (size, color, brand)
 * - Checkout forms: payment method selection, shipping options
 * - Account settings: preference selection (notifications, privacy)
 * - Search filters: single filter option selection
 * - Survey forms: single choice questions
 * 
 * ECOMMERCE CONTEXT:
 * - Essential for form input and user selection
 * - Critical for product filtering and search
 * - Important for checkout flow and payment selection
 * - Required for account preferences and settings
 * - Used in product customization and options
 * - Important for user experience and conversion
 * 
 * RADIO FEATURES:
 * - Single selection from multiple options
 * - Custom styled radio button with visual feedback
 * - Accessible keyboard navigation
 * - Label support for better UX
 * - Consistent styling with design system
 * - Form integration and validation
 * 
 * COMMON PATTERNS:
 * - Product filter options (size, color, brand)
 * - Payment method selection
 * - Shipping option selection
 * - Account preference settings
 * - Survey and feedback forms
 * 
 * EXAMPLES:
 * - <Radio name="size" value="large" label="Large" />
 * - <Radio name="payment" value="card" label="Credit Card" />
 * - <Radio name="shipping" value="express" label="Express Shipping" />
 */

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, checked, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="radio"
            ref={ref}
            checked={checked}
            className="sr-only"
            {...props}
          />
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
              checked
                ? "bg-primary-text border-transparent"
                : "bg-primary-bg border-primary-border"
            } ${className || ""}`}
          >
            {checked && (
              <div className="w-2 h-2 bg-primary-bg rounded-full"></div>
            )}
          </div>
        </div>
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="text-primary-text txt-medium cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Radio.displayName = "Radio"

export default Radio