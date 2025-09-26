import { ReactNode, useState } from "react"
import { Button } from "@/components/common/button"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for account information display and editing in the storefront
 * - Account pages: display and edit customer information
 * - Profile management: customer profile information display
 * - Mobile commerce: mobile-optimized account information
 * - Account editing: inline editing of account information
 * - User experience: clear account information management
 *
 * ECOMMERCE CONTEXT:
 * - Critical for customer account management
 * - Essential for user experience and data management
 * - Important for customer retention and loyalty
 * - Required for account information display and editing
 * - Used in customer service and support
 * - Important for mobile commerce experience
 *
 * ACCOUNT INFO FEATURES:
 * - Account information display and editing
 * - Inline editing with edit/cancel functionality
 * - Success/error message display
 * - Form validation and error handling
 * - Responsive design for mobile/desktop
 * - Professional account presentation
 *
 * INFO MANAGEMENT:
 * - Display current account information
 * - Edit mode with form fields
 * - Success/error feedback
 * - Clear state management
 * - Professional information presentation
 *
 * COMMON PATTERNS:
 * - Customer account information
 * - Mobile account info display
 * - Account editing interface
 * - Profile information management
 * - Account data display
 *
 * EXAMPLES:
 * - <AccountInfo label="Email" currentInfo={customer.email}><EmailForm /></AccountInfo>
 * - <AccountInfo label="Name" currentInfo={customer.name}><NameForm /></AccountInfo>
 * - Mobile account information
 * - Account editing interface
 */
interface AccountInfoProps {
  label: string
  currentInfo: ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  successMessage?: string
  clearState?: () => void
  children?: ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess = false,
  isError = false,
  clearState,
  errorMessage = "",
  successMessage = "",
  children,
  ...props
}: AccountInfoProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(!isEditing)
    if (clearState) {
      clearState()
    }
  }

  return (
    <div className="border-b border-primary-border pb-8 last:border-b-0" {...props}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col flex-1">
          <h3 className="txt-large-plus text-primary-text mb-3">{label}</h3>
          <div className="text-secondary-text">
            {typeof currentInfo === "string" ? (
              <span data-testid="current-info">
                {currentInfo}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <Button
          variant="transparent"
          className="text-accent-text hover:text-accent-text-hover txt-small-plus px-0 h-auto"
          onClick={handleEdit}
          type={isEditing ? "reset" : "button"}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {(isSuccess || isError) && (
        <div className="mb-4">
          {isSuccess && successMessage && (
            <div className="bg-success-bg border border-success-border text-success-text px-4 py-3 txt-small">
              {successMessage}
            </div>
          )}
          {isError && errorMessage && (
            <div className="bg-error-bg border border-error-border text-error-text px-4 py-3 txt-small">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-6 bg-secondary-bg p-6 border border-secondary-border">
          {children}
        </div>
      )}
    </div>
  )
}

export default AccountInfo