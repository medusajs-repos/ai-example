import { Text } from "@medusajs/ui"
import React from "react"
import Radio from "@/components/common/radio"
import { isManual, paymentInfoMap } from "@/lib/constants/constants"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  children?: React.ReactNode
  onClick?: () => void
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  disabled = false,
  children,
  onClick,
}) => {
  const isSelected = selectedPaymentOptionId === paymentProviderId

  return (
    <div
      className={`flex flex-col gap-y-2 txt-small cursor-pointer py-4 border rounded px-8 mb-2 hover:border-ui-border-strong transition-colors ${
        isSelected
          ? "border-ui-fg-interactive bg-ui-bg-subtle"
          : "border-ui-border-base"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Radio checked={isSelected} readOnly />
          <Text className="txt-medium">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
          {isManual(paymentProviderId) && (
            <span className="txt-xsmall bg-ui-tag-orange-bg-hover text-ui-tag-orange-text px-2 py-1 rounded hidden small:block">
              Test Mode
            </span>
          )}
        </div>
        <span className="justify-self-end text-ui-fg-base">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {children}
    </div>
  )
}

export default PaymentContainer