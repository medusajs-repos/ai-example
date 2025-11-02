import Radio from "@/components/common/radio";
import { paymentMethodsData } from "@/lib/constants/payment-methods";
import React from "react";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for payment method selection in the storefront
 * - Checkout pages: payment method selection and configuration
 * - Payment processing: secure payment method handling
 * - Mobile commerce: mobile-optimized payment selection
 * - International commerce: region-specific payment methods
 * - Payment security: secure payment method display
 *
 * ECOMMERCE CONTEXT:
 * - Critical for payment processing and security
 * - Essential for order completion and conversion
 * - Important for payment method compliance and regulations
 * - Required for international payment processing
 * - Used in payment security and fraud prevention
 * - Important for mobile commerce experience
 *
 * PAYMENT CONTAINER FEATURES:
 * - Payment method display and selection
 * - Payment provider information and icons
 * - Secure payment method handling
 * - Payment method validation and error handling
 * - International payment method support
 * - Responsive design for mobile/desktop
 *
 * COMMON PATTERNS:
 * - Checkout payment selection
 * - Mobile payment processing
 * - International payment methods
 * - Payment security and validation
 * - Payment method display
 *
 * EXAMPLES:
 * - <PaymentContainer paymentProviderId="stripe" selectedPaymentOptionId={selected} onClick={handleSelect} />
 * - Checkout payment selection
 * - Mobile payment processing
 * - International payment handling
 */

type PaymentContainerProps = {
  paymentProviderId: string;
  selectedPaymentOptionId: string | null;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
};

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  disabled = false,
  children,
  onClick,
}) => {
  const isSelected = selectedPaymentOptionId === paymentProviderId;

  return (
    <div
      className={`flex flex-col gap-y-2 text-sm cursor-pointer py-4 border px-8 mb-2 hover:border-primary-border-strong transition-colors ${
        isSelected
          ? "border-primary-text bg-secondary-bg"
          : "border-primary-border"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Radio checked={isSelected} readOnly />
          <p className="text-base font-medium">
            {paymentMethodsData[paymentProviderId]?.title || paymentProviderId}
          </p>
        </div>
        <span className="justify-self-end text-primary-text">
          {paymentMethodsData[paymentProviderId]?.icon}
        </span>
      </div>
      {children}
    </div>
  );
};

export default PaymentContainer;
