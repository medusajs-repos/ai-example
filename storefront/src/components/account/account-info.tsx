import { ReactNode, useState } from "react"
import { Button } from "@/components/common/button"

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
            <div className="bg-success-bg border border-success-border text-success-text px-4 py-3 rounded-md txt-small">
              {successMessage}
            </div>
          )}
          {isError && errorMessage && (
            <div className="bg-error-bg border border-error-border text-error-text px-4 py-3 rounded-md txt-small">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-6 bg-secondary-bg p-6 rounded-xl border border-secondary-border">
          {children}
        </div>
      )}
    </div>
  )
}

export default AccountInfo