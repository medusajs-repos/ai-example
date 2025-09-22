import { useState, useEffect, lazy } from "react"
import { useLoaderData } from "@tanstack/react-router"
import { useCart } from "@/lib/hooks/dynamic/use-cart"
import { Heading, Text, Button } from "@medusajs/ui"
import { Loading } from "../components/common"

const DeliveryStep = lazy(() => import("@/components/checkout/delivery-step"))
const AddressStep = lazy(() => import("@/components/checkout/address-step"))
const PaymentStep = lazy(() => import("@/components/checkout/payment-step"))
const ReviewStep = lazy(() => import("@/components/checkout/review-step"))
const CheckoutSummary = lazy(() => import("@/components/checkout/checkout-summary"))

enum CheckoutStep {
  ADDRESS = "address",
  DELIVERY = "delivery",
  PAYMENT = "payment",
  REVIEW = "review",
}

const Checkout = () => {
  const { countryCode } = useLoaderData({
    from: "/$countryCode/checkout",
  })
  const { data: cart, isLoading } = useCart()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.ADDRESS)

  // Check if cart has items
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  useEffect(() => {
    // Determine which step to show based on cart state
    if (!cart) return;
    if (!cart.shipping_address || !cart.billing_address || !cart.email) {
      setCurrentStep(CheckoutStep.ADDRESS)
      return;
    }
    if (!cart.shipping_methods?.length) {
      setCurrentStep(CheckoutStep.DELIVERY)
      return;
    }
    if (!cart.payment_collection?.payment_sessions?.length) {
      setCurrentStep(CheckoutStep.PAYMENT)
      return;
    }
    setCurrentStep(CheckoutStep.REVIEW)
  }, [cart])

  if (isLoading) {
    // TODO add checkout loading
    return <Loading />
  }

  if (!cart || itemCount === 0) {
    return (
      <div className="content-container py-8">
        <div className="text-center">
          <Heading level="h1" className="mb-4">Your cart is empty</Heading>
          <Text className="text-ui-fg-subtle mb-6">
            Add some items to your cart before checking out.
          </Text>
          <Button asChild>
            <a href={`/${countryCode}/store`}>Continue Shopping</a>
          </Button>
        </div>
      </div>
    )
  }

  const steps = [
    { 
      key: CheckoutStep.ADDRESS, 
      title: "Address", 
      completed: !!(cart?.shipping_address && cart?.billing_address)
    },
    { 
      key: CheckoutStep.DELIVERY, title: "Delivery", 
      completed: !!(cart?.shipping_methods && cart?.shipping_methods.length > 0)
    },
    { 
      key: CheckoutStep.PAYMENT, 
      title: "Payment", 
      completed: !!(cart?.payment_collection?.payment_sessions?.length)
    },
    { 
      key: CheckoutStep.REVIEW, 
      title: "Review", 
      completed: false
    },
  ]

  const currentStepIndex = steps.findIndex(step => step.key === currentStep)

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key)
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key)
    }
  }

  const subtotal = cart.subtotal || 0
  const shippingTotal = cart.shipping_total || 0
  const total = cart.total || 0

  return (
    <div className="content-container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Checkout Steps */}
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="bg-white p-6 rounded-lg border border-ui-border-base">
            <div className="flex flex-wrap gap-y-4 items-center">
              {steps.map((step, index) => (
                <div key={step.key} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.key)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center txt-small-plus transition-colors cursor-pointer ${
                      index <= currentStepIndex
                        ? "bg-ui-fg-interactive text-white hover:bg-ui-fg-interactive-hover"
                        : step.completed
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-ui-bg-subtle text-ui-fg-subtle hover:bg-ui-bg-subtle-hover"
                    }`}
                  >
                    {step.completed ? "✓" : index + 1}
                  </button>
                  <button
                    onClick={() => setCurrentStep(step.key)}
                    className="ml-2 txt-small-plus hover:text-ui-fg-interactive transition-colors"
                  >
                    {step.title}
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-ui-border-base mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Address Step */}
          {currentStep === CheckoutStep.ADDRESS && (
            <AddressStep
              cart={cart}
              onNext={handleNext}
            />
          )}

          {/* Delivery Step */}
          {currentStep === CheckoutStep.DELIVERY && (
            <DeliveryStep
              cart={cart}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* Payment Step */}
          {currentStep === CheckoutStep.PAYMENT && (
            <PaymentStep
              cart={cart}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* Review Step */}
          {currentStep === CheckoutStep.REVIEW && (
            <ReviewStep
              cart={cart}
              onBack={handleBack}
            />
          )}
        </div>

        {/* Right Column - Order Summary */}
        <CheckoutSummary
          cart={cart}
        />
      </div>
    </div>
  )
}

export default Checkout