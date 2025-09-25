import { CheckoutStep, CheckoutStepKey } from "@/lib/types/global"
import { Button } from "@/components/common/button"
import { clx } from "@medusajs/ui"

type CheckoutProgressProps = {
  steps: CheckoutStep[]
  currentStepIndex: number
  handleStepChange: (step: CheckoutStepKey) => void
  className?: string
}

const CheckoutProgress = ({ 
  steps, 
  currentStepIndex, 
  handleStepChange,
  className
}: CheckoutProgressProps) => {
  return (
    <div className={clx("flex flex-wrap gap-4 items-center", className)}>
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center gap-4">
          <Button
            onClick={() => handleStepChange(step.key)}
            variant={"transparent"}
            className={clx(
              "p-0 hover:bg-transparent",
              index !== currentStepIndex && "text-secondary-text hover:text-secondary-text-hover",
              index === currentStepIndex && "text-primary-text hover:text-primary-text-hover"
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
  )
}

export default CheckoutProgress