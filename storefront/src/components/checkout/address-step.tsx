import { useState } from "react"
import { Button, Heading, Input, Label, Checkbox } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useSetCartAddresses } from "@/lib/hooks/dynamic/checkout/use-addresses"
import AddressForm from "@/components/common/address-form"

interface AddressStepProps {
  cart: HttpTypes.StoreCart
  onNext: () => void
}

const AddressStep = ({ cart, onNext }: AddressStepProps) => {
  const setAddressesMutation = useSetCartAddresses()
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState(cart.email || "")
  const [shippingAddress, setShippingAddress] = useState<Record<string, any>>({
    first_name: cart.shipping_address?.first_name || "",
    last_name: cart.shipping_address?.last_name || "",
    company: cart.shipping_address?.company || "",
    address_1: cart.shipping_address?.address_1 || "",
    address_2: cart.shipping_address?.address_2 || "",
    city: cart.shipping_address?.city || "",
    postal_code: cart.shipping_address?.postal_code || "",
    province: cart.shipping_address?.province || "",
    country_code: cart.shipping_address?.country_code || cart.region?.countries?.[0]?.iso_2 || "",
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
    country_code: cart.billing_address?.country_code || cart.region?.countries?.[0]?.iso_2 || "",
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
    const shipping = shippingAddress
    const required = ["first_name", "last_name", "address_1", "city", "postal_code", "country_code"]
    
    const shippingValid = required.every(field => shipping[field as keyof typeof shipping]?.trim())
    const emailValid = email.trim() && email.includes("@")
    let billingValid = true
    
    if (!sameAsBilling) {
      const billing = billingAddress
      billingValid = required.every(field => billing[field as keyof typeof billing]?.trim())
    }
    
    return shippingValid && emailValid && billingValid
  }

  return (
    <div>
      <Heading level="h2" className="mb-6">
        Shipping
      </Heading>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <Label htmlFor="email" className="block txt-small-plus mb-2">
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
        </div>

        {/* Shipping Address */}
        <AddressForm
          addressFormData={shippingAddress}
          setAddressFormData={setShippingAddress}
          countries={cart.region?.countries}
        />

        {/* Billing Address Checkbox */}
        <div className="flex items-center gap-x-2 mb-0">
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
          <AddressForm
            addressFormData={billingAddress}
            setAddressFormData={setBillingAddress}
            countries={cart.region?.countries}
            className="mt-6"
          />
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            isLoading={isSubmitting}
          >
            Continue to Delivery
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddressStep