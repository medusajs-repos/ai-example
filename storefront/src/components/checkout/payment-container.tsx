import React from "react"
import Radio from "@/components/common/radio"
import { paymentMethodsData } from "@/lib/constants/payment-methods"

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
      className={`flex flex-col gap-y-2 txt-small cursor-pointer py-4 border px-8 mb-2 hover:border-primary-border-strong transition-colors ${
        isSelected
          ? "border-primary-text bg-secondary-bg"
          : "border-primary-border"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Radio checked={isSelected} readOnly />
          <p className="txt-medium">
            {paymentMethodsData[paymentProviderId]?.title || paymentProviderId}
          </p>
        </div>
        <span className="justify-self-end text-primary-text">
          {paymentMethodsData[paymentProviderId]?.icon}
        </span>
      </div>
      {children}
    </div>
  )
}

export default PaymentContainer