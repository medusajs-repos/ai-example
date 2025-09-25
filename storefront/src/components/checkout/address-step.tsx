import { useEffect, useState } from "react"
import { Input, Label, Checkbox, Heading } from "@medusajs/ui"
import { Button } from "@/components/common/button"
import { HttpTypes } from "@medusajs/types"
import { useSetCartAddresses } from "@/lib/hooks/dynamic/checkout/use-addresses"
import AddressForm from "@/components/common/address-form"
import { getStoredCountryCode } from "@/lib/utils/regions/stored-country-code"

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
          <Heading level="h3" className="text-primary-text !txt-medium-plus">
            Shipping Address
          </Heading>
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
            checked={sameAsBilling}
            onCheckedChange={(checked) => setSameAsBilling(!!checked)}
          />
          <Label htmlFor="same_as_billing" className="txt-small">
            Billing address is the same as shipping address
          </Label>
        </div>

        {/* Billing Address (if different) */}
        {!sameAsBilling && (
          <div className="flex flex-col gap-2">
            <Heading level="h3" className="text-primary-text !txt-medium-plus">
              Billing Address
            </Heading>
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
          <Label htmlFor="email" className="block txt-small-plus">
            Email Address
          </Label>
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
            isLoading={isSubmitting}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddressStep