import { Button } from "@/components/common/button";
import { CheckoutStep, CheckoutStepKey } from "@/lib/types/global";
import { clsx } from "clsx";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for checkout progress tracking in the storefront
 * - Checkout pages: show checkout step progress and navigation
 * - Multi-step checkout: track progress through checkout steps
 * - Mobile commerce: mobile-optimized checkout progress
 * - User experience: clear checkout step indication
 * - Checkout navigation: allow users to navigate between steps
 *
 * ECOMMERCE CONTEXT:
 * - Critical for checkout flow and user experience
 * - Essential for checkout step navigation and tracking
 * - Important for user orientation and progress
 * - Required for multi-step checkout processes
 * - Used in checkout optimization and conversion
 * - Important for mobile commerce experience
 *
 * PROGRESS FEATURES:
 * - Checkout step display and navigation
 * - Current step highlighting and indication
 * - Step completion and progress tracking
 * - Step navigation and switching
 * - Responsive design for mobile/desktop
 * - Professional progress presentation
 *
 * CHECKOUT STEPS:
 * - Address: shipping and billing address collection
 * - Delivery: shipping method selection
 * - Payment: payment method and billing
 * - Review: final order review and confirmation
 * - Progress: step completion and navigation
 *
 * COMMON PATTERNS:
 * - Checkout progress tracking
 * - Mobile checkout progress
 * - Multi-step checkout navigation
 * - Checkout step indication
 * - Checkout flow optimization
 *
 * EXAMPLES:
 * - <CheckoutProgress steps={checkoutSteps} currentStepIndex={currentStep} handleStepChange={handleStepChange} />
 * - Checkout page progress tracking
 * - Mobile checkout progress
 * - Multi-step checkout navigation
 */

type CheckoutProgressProps = {
  steps: CheckoutStep[];
  currentStepIndex: number;
  handleStepChange: (step: CheckoutStepKey) => void;
  className?: string;
};

const CheckoutProgress = ({
  steps,
  currentStepIndex,
  handleStepChange,
  className,
}: CheckoutProgressProps) => {
  return (
    <div className={clsx("flex flex-wrap gap-4 items-center", className)}>
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center gap-4">
          <Button
            onClick={() => handleStepChange(step.key)}
            variant={"transparent"}
            className={clsx(
              "p-0 hover:bg-transparent",
              index !== currentStepIndex &&
                "text-secondary-text hover:text-secondary-text-hover",
              index === currentStepIndex &&
                "text-primary-text hover:text-primary-text-hover"
            )}
            disabled={index > currentStepIndex}
          >
            {step.title}
          </Button>
          {index < steps.length - 1 && (
            <div className="w-8 h-px bg-primary-border" />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutProgress;
