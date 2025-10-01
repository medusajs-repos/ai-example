import { useEffect, useState } from "react"
import { Button } from "@/components/common/button"
import { HttpTypes } from "@medusajs/types"
import { useSetCartAddresses } from "@/lib/hooks/dynamic/checkout/use-addresses"
import AddressForm from "@/components/common/address-form"
import { getStoredCountryCode } from "@/lib/utils/region/stored-country-code"
import { Input } from "@/components/common/input"
import { Checkbox } from "@/components/common/checkbox"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for address collection in the checkout flow
 * - Checkout pages: shipping and billing address collection
 * - Guest checkout: address collection for non-registered users
 * - Mobile commerce: mobile-optimized address collection
 * - Address validation: ensure valid addresses for shipping
 * - International commerce: country-specific address handling
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for shipping calculation and delivery
 * - Essential for tax calculation based on location
 * - Important for order fulfillment and tracking
 * - Required for international shipping compliance
 * - Used in address validation and verification
 * - Important for mobile commerce experience
 * 
 * ADDRESS STEP FEATURES:
 * - Shipping address collection and validation
 * - Billing address collection (optional)
 * - Email address collection for order updates
 * - Country-specific address validation
 * - Same billing/shipping address option
 * - Form validation and error handling
 * 
 * ADDRESS COLLECTION:
 * - Shipping address: required for delivery
 * - Billing address: optional, can be same as shipping
 * - Email address: for order updates and confirmation
 * - Country validation: ensures valid shipping countries
 * - Address validation: ensures complete address information
 * 
 * COMMON PATTERNS:
 * - Checkout address collection
 * - Guest checkout address handling
 * - Mobile address collection
 * - International address handling
 * - Address validation and verification
 * 
 * EXAMPLES:
 * - <AddressStep cart={cart} onNext={handleNext} />
 * - Checkout address collection
 * - Mobile address collection
 * - International address handling
 */

interface AddressStepProps {
  cart: HttpTypes.StoreCart
  onNext: () => void
}

const AddressStep = ({ cart, onNext }: AddressStepProps) => {
  const setAddressesMutation = useSetCartAddresses()
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isShippingAddressValid, setIsShippingAddressValid] = useState(false)
  const [isBillingAddressValid, setIsBillingAddressValid] = useState(false)
  const [email, setEmail] = useState(cart.email || "")
  const storedCountryCode = getStoredCountryCode()
  const [shippingAddress, setShippingAddress] = useState<Record<string, any>>({
    first_name: cart.shipping_address?.first_name || "",
    last_name: cart.shipping_address?.last_name || "",
    company: cart.shipping_address?.company || "",
    address_1: cart.shipping_address?.address_1 || "",
    address_2: cart.shipping_address?.address_2 || "",
    city: cart.shipping_address?.city || "",
    postal_code: cart.shipping_address?.postal_code || "",
    province: cart.shipping_address?.province || "",
    country_code: cart.shipping_address?.country_code || storedCountryCode || "",
    phone: cart.shipping_address?.phone || "",
  })
  const [billingAddress, setBillingAddress] = useState<Record<string, any>>({
    first_name: cart.billing_address?.first_name || "",
    last_name: cart.billing_address?.last_name || "",
    company: cart.billing_address?.company || "",
    address_1: cart.billing_address?.address_1 || "",
    address_2: cart.billing_address?.address_2 || "",
    city: cart.billing_address?.city || "",
    postal_code: cart.billing_address?.postal_code || "",
    province: cart.billing_address?.province || "",
    country_code: cart.billing_address?.country_code || storedCountryCode || "",
    phone: cart.billing_address?.phone || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const submitData = new FormData()
      
      // Add email
      submitData.append("email", email)
      
      // Add shipping address
      Object.entries(shippingAddress).forEach(([key, value]) => {
        submitData.append(`shipping_address.${key}`, value)
      })
      
      // Add billing address (same as shipping if checkbox is checked)
      const billingData = sameAsBilling ? shippingAddress : billingAddress
      Object.entries(billingData).forEach(([key, value]) => {
        submitData.append(`billing_address.${key}`, value)
      })
      
      await setAddressesMutation.mutateAsync(submitData)
      onNext()
    } catch (error) {
      console.error("Failed to set addresses:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    const emailValid = email.trim() && email.includes("@")
    
    return emailValid && isShippingAddressValid && (isBillingAddressValid || sameAsBilling)
  }

  useEffect(() => {
    if (!cart.region) {
      return
    }

    const isValidShippingAddressCountry = cart.region.countries?.some(
      (country) => country.iso_2 === shippingAddress.country_code
    )
    if (!isValidShippingAddressCountry) {
      setShippingAddress((prev) => ({
        ...prev,
        country_code: storedCountryCode || "",
      }))
    }

    const isValidBillingAddressCountry = cart.region.countries?.some(
      (country) => country.iso_2 === billingAddress.country_code
    )
    if (!isValidBillingAddressCountry) {
      setBillingAddress((prev) => ({
        ...prev,
        country_code: storedCountryCode || "",
      }))
    }
  }, [cart.region, storedCountryCode])

  return (
    <div className="flex flex-col gap-8">    
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-primary-text !txt-medium-plus">
            Shipping Address
          </h3>
          {/* Shipping Address */}
          <AddressForm
            addressFormData={shippingAddress}
            setAddressFormData={setShippingAddress}
            countries={cart.region?.countries}
            setIsFormValid={setIsShippingAddressValid}
          />
        </div>

        {/* Billing Address Checkbox */}
        <div className="flex items-center gap-x-2">
          <Checkbox
            id="same_as_billing"
            type="checkbox"
            checked={sameAsBilling}
            onChange={(e) => setSameAsBilling(!!e.target.checked)}
          />
          <label htmlFor="same_as_billing" className="txt-small">
            Billing address is the same as shipping address
          </label>
        </div>

        {/* Billing Address (if different) */}
        {!sameAsBilling && (
          <div className="flex flex-col gap-2">
            <h3 className="text-primary-text !txt-medium-plus">
              Billing Address
            </h3>
            <AddressForm
              addressFormData={billingAddress}
              setAddressFormData={setBillingAddress}
              countries={cart.region?.countries}
              setIsFormValid={setIsBillingAddressValid}
            />
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="block txt-small-plus">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full"
          />
          <p className="txt-xsmall text-secondary-text">
            You'll receive order updates to this email.
          </p>
        </div>

        <div className="flex">
          <Button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddressStep