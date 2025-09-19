import { useState, useEffect } from "react"
import { useLocation } from "@tanstack/react-router"
import { useCart } from "@/lib/hooks/dynamic/use-cart"
import { getCountryCodeFromPath } from "@/lib/utils/regions"
import { Heading, Text, Button } from "@medusajs/ui"
import DeliveryStep from "@/components/delivery-step"
import AddressStep from "@/components/address-step"
import PaymentStep from "@/components/payment-step"
import ReviewStep from "@/components/review-step"

enum CheckoutStep {
  ADDRESS = "address",
  DELIVERY = "delivery",
  PAYMENT = "payment",
  REVIEW = "review",
}

const Checkout = () => {
  const { data: cart, isLoading } = useCart()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.ADDRESS)
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ''

  // Check if cart has items
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  useEffect(() => {
    // Determine which step to show based on cart state
    if (cart?.shipping_address && cart?.billing_address && cart?.email) {
      if (cart?.shipping_methods?.length > 0) {
        if (cart?.payment_sessions?.length || cart?.payment_collection) {
          setCurrentStep(CheckoutStep.REVIEW)
        } else {
          setCurrentStep(CheckoutStep.PAYMENT)
        }
      } else {
        setCurrentStep(CheckoutStep.DELIVERY)
      }
    } else {
      setCurrentStep(CheckoutStep.ADDRESS)
    }
  }, [cart])

  if (isLoading) {
    return (
      <div className="content-container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-ui-fg-subtle">Loading checkout...</div>
        </div>
      </div>
    )
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
            <a href={`${baseHref}/store`}>Continue Shopping</a>
          </Button>
        </div>
      </div>
    )
  }

  const steps = [
    { key: CheckoutStep.ADDRESS, title: "Address", completed: !!(cart?.shipping_address && cart?.billing_address) },
    { key: CheckoutStep.DELIVERY, title: "Delivery", completed: !!(cart?.shipping_methods && cart?.shipping_methods.length > 0) },
    { key: CheckoutStep.PAYMENT, title: "Payment", completed: !!(cart?.payment_sessions?.length || cart?.payment_collection?.payment_sessions?.length) },
    { key: CheckoutStep.REVIEW, title: "Review", completed: false },
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
              isActive={true}
              countryCode={countryCode}
            />
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-white p-6 rounded-lg border border-ui-border-base h-fit sticky top-6">
          <Heading level="h3" className="mb-6">
            Order Summary
          </Heading>
          
          <div className="space-y-4 mb-6">
            {cart.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-ui-bg-subtle rounded-lg overflow-hidden">
                  {item.variant?.product?.thumbnail || item.product?.thumbnail ? (
                    <img
                      src={item.variant?.product?.thumbnail || item.product?.thumbnail}
                      alt={item.product?.title || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ui-fg-subtle txt-xsmall">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Text className="txt-medium-plus">
                    {item.product?.title}
                  </Text>
                  <Text className="text-ui-fg-subtle txt-small">
                    Qty: {item.quantity}
                  </Text>
                </div>
                <Text className="txt-medium-plus">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: cart.currency_code || 'USD'
                  }).format((item.unit_price || 0))}
                </Text>
              </div>
            ))}
          </div>

          <div className="border-t border-ui-border-base pt-4 space-y-2">
            <div className="flex justify-between">
              <Text>Subtotal</Text>
              <Text>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: cart.currency_code || 'USD'
                }).format(subtotal)}
              </Text>
            </div>
            {shippingTotal > 0 && (
              <div className="flex justify-between">
                <Text>Shipping</Text>
                <Text>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: cart.currency_code || 'USD'
                  }).format(shippingTotal)}
                </Text>
              </div>
            )}
            <div className="flex justify-between txt-large-plus pt-2 border-t border-ui-border-base">
              <Text>Total</Text>
              <Text>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: cart.currency_code || 'USD'
                }).format(total)}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout