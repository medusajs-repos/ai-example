import { ReactNode, useState } from "react"
import { Button } from "@medusajs/ui"
import { clx } from "@medusajs/ui"

interface AccountInfoProps {
  label: string
  currentInfo: ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  successMessage?: string
  clearState?: () => void
  children?: ReactNode
  'data-testid'?: string
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
    <div className="border-b border-ui-border-base pb-8 last:border-b-0" {...props}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-medium text-ui-fg-base mb-3">{label}</h3>
          <div className="text-ui-fg-subtle">
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
          className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover txt-small font-medium px-0 h-auto"
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
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg txt-small">
              {successMessage}
            </div>
          )}
          {isError && errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg txt-small">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-6 bg-ui-bg-subtle p-6 rounded-xl border border-ui-border-base">
          {children}
        </div>
      )}
    </div>
  )
}

export default AccountInfo