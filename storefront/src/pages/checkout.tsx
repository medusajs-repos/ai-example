import { useEffect, lazy, Suspense, useMemo } from "react"
import { useLoaderData, useNavigate, useLocation } from "@tanstack/react-router"
import { useCart } from "@/lib/hooks/dynamic/use-cart"
import Loading from "@/components/common/loading"
import { CheckoutStep } from "@/lib/types/global"

const DeliveryStep = lazy(() => import("@/components/checkout/delivery-step"))
const AddressStep = lazy(() => import("@/components/checkout/address-step"))
const PaymentStep = lazy(() => import("@/components/checkout/payment-step"))
const ReviewStep = lazy(() => import("@/components/checkout/review-step"))
const CheckoutSummary = lazy(() => import("@/components/checkout/checkout-summary"))
const CartEmpty = lazy(() => import("@/components/cart/cart-empty"))

const Checkout = () => {
  const { step } = useLoaderData({
    from: "/$countryCode/checkout"
  })
  const { data: cart, isLoading: cartLoading } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  const steps = useMemo(() => {
    return [
      { 
        key: CheckoutStep.ADDRESSES,
        title: "Addresses", 
        completed: !!(cart?.shipping_address && cart?.billing_address)
      },
      { 
        key: CheckoutStep.DELIVERY,
        title: "Delivery", 
        completed: !!(cart?.shipping_methods?.length)
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
  }, [cart])

  const currentStepIndex = useMemo(() => 
    steps.findIndex((s) => s.key === step),
  [step, steps])

  const goToStep = (step: CheckoutStep) => {
    navigate({
      to: `${location.pathname}?step=${step}`,
      replace: true,
    })
  }

  useEffect(() => {
    // Determine which step to show based on cart state
    if (!cart) {
      return
    }
    
    if (step !== CheckoutStep.ADDRESSES && currentStepIndex >= 0 && !steps[0].completed) {
      goToStep(CheckoutStep.ADDRESSES)
      return
    }

    if (step !== CheckoutStep.DELIVERY && currentStepIndex >= 1 && !steps[1].completed) {
      goToStep(CheckoutStep.DELIVERY)
      return
    }

    if (step !== CheckoutStep.PAYMENT && currentStepIndex >= 2 && !steps[2].completed) {
      goToStep(CheckoutStep.PAYMENT)
      return
    }
  }, [cart, steps, location])

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      goToStep(steps[nextIndex].key)
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      goToStep(steps[prevIndex].key)
    }
  }

  return (
    <div className="content-container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Checkout Steps */}
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="bg-primary-bg p-6 rounded-lg border border-primary-border">
            <div className="flex flex-wrap gap-y-4 items-center">
              {steps.map((step, index) => (
                <div key={step.key} className="flex items-center">
                  <button
                    onClick={() => goToStep(step.key)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center txt-small-plus transition-colors cursor-pointer ${
                      index <= currentStepIndex
                        ? "bg-accent-400 text-white hover:bg-accent-500"
                        : step.completed
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-secondary-bg text-secondary-text hover:bg-secondary-text-hover"
                    }`}
                  >
                    {step.completed ? "✓" : index + 1}
                  </button>
                  <button
                    onClick={() => goToStep(step.key)}
                    className="ml-2 txt-small-plus hover:text-accent-400 transition-colors"
                  >
                    {step.title}
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-primary-border mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Suspense fallback={<Loading />}>
            {cartLoading && <Loading />}
            {cart && (
              <div className="bg-primary-bg p-6 rounded-lg border border-primary-border">
                {/* Address Step */}
                {step === CheckoutStep.ADDRESSES && (
                  <AddressStep
                    cart={cart}
                    onNext={handleNext}
                  />
                )}

                {/* Delivery Step */}
                {step === CheckoutStep.DELIVERY && (
                  <DeliveryStep
                    cart={cart}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {/* Payment Step */}
                {step === CheckoutStep.PAYMENT && (
                  <PaymentStep
                    cart={cart}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {/* Review Step */}
                {step === CheckoutStep.REVIEW && (
                  <ReviewStep
                    cart={cart}
                    onBack={handleBack}
                  />
                )}
              </div>
            )}
          </Suspense>
        </div>

        {/* Right Column - Order Summary */}
        <Suspense fallback={<Loading />}>
          {cartLoading && <Loading />}
          {cart && (
            <CheckoutSummary
              cart={cart}
            />
          )}
          {!cart && !cartLoading && (
            <CartEmpty />
          )}
        </Suspense>
      </div>
    </div>
  )
}

export default Checkout