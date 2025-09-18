import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import AddressesStep from "@/components/checkout/addresses-step"
import ShippingStep from "@/components/checkout/shipping-step"
import PaymentStep from "@/components/checkout/payment-step"
import ReviewStep from "@/components/checkout/review-step"

interface CheckoutFormProps {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
}

const CheckoutForm = ({ cart, customer }: CheckoutFormProps) => {
  const [currentStep, setCurrentStep] = useState<'address' | 'shipping' | 'payment' | 'review'>('address')

  // Determine which step should be active based on cart state
  const getActiveStep = () => {
    if (!cart.shipping_address) return 'address'
    if (!cart.shipping_methods?.length) return 'shipping'
    if (!cart.payment_sessions?.length) return 'payment'
    return 'review'
  }

  const activeStep = getActiveStep()

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <AddressesStep 
        cart={cart} 
        customer={customer} 
        isActive={activeStep === 'address'}
        onComplete={() => setCurrentStep('shipping')}
      />

      <ShippingStep 
        cart={cart}
        isActive={activeStep === 'shipping'}
        onComplete={() => setCurrentStep('payment')}
      />

      <PaymentStep 
        cart={cart}
        isActive={activeStep === 'payment'}
        onComplete={() => setCurrentStep('review')}
      />

      <ReviewStep 
        cart={cart}
        isActive={activeStep === 'review'}
      />
    </div>
  )
}

export default CheckoutForm