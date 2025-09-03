import { Text } from "@medusajs/ui"
import React, { type JSX } from "react"
import Radio from "@components/ui/Radio"
import { isManual } from "@lib/constants"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
  onClick?: () => void
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
  onClick,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"
  const isSelected = selectedPaymentOptionId === paymentProviderId

  return (
    <div
      className={`flex flex-col gap-y-2 txt-smallall-regular cursor-pointer py-4 border rounded px-8 mb-2 hover:border-ui-border-strong transition-colors ${
        isSelected
          ? "border-ui-fg-interactive bg-ui-bg-subtle"
          : "border-ui-border-base"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Radio checked={isSelected} readOnly />
          <Text className="txt-medium-regular">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
          {isManual(paymentProviderId) && isDevelopment && (
            <span className="txt-xsmall bg-orange-100 text-orange-800 px-2 py-1 rounded hidden small:block">
              Test Mode
            </span>
          )}
        </div>
        <span className="justify-self-end text-ui-fg-base">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <span className="txt-xsmall bg-orange-100 text-orange-800 px-2 py-1 rounded small:hidden">
          Test Mode
        </span>
      )}
      {children}
    </div>
  )
}

export default PaymentContainer