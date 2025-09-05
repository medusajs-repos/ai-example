import { useState } from "react"
import { Button, Text, Heading, Input, Label, Checkbox } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useSetAddresses } from "@lib/hooks/useCart"

interface AddressStepProps {
  cart: HttpTypes.StoreCart
  onNext: () => void
}

const AddressStep = ({ cart, onNext }: AddressStepProps) => {
  const setAddresses = useSetAddresses()
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: cart.email || "",
    shipping_address: {
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
    },
    billing_address: {
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
    }
  })

  const handleInputChange = (section: 'shipping_address' | 'billing_address', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const submitData = new FormData()
      
      // Add email
      submitData.append('email', formData.email)
      
      // Add shipping address
      Object.entries(formData.shipping_address).forEach(([key, value]) => {
        submitData.append(`shipping_address.${key}`, value)
      })
      
      // Add billing address (same as shipping if checkbox is checked)
      const billingData = sameAsBilling ? formData.shipping_address : formData.billing_address
      Object.entries(billingData).forEach(([key, value]) => {
        submitData.append(`billing_address.${key}`, value)
      })
      
      if (sameAsBilling) {
        submitData.append('same_as_billing', 'on')
      }
      
      await setAddresses.mutateAsync(submitData)
      onNext()
    } catch (error) {
      console.error("Failed to set addresses:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    const shipping = formData.shipping_address
    const required = ['first_name', 'last_name', 'address_1', 'city', 'postal_code', 'country_code']
    
    const shippingValid = required.every(field => shipping[field as keyof typeof shipping]?.trim())
    const emailValid = formData.email.trim() && formData.email.includes('@')
    
    if (!sameAsBilling) {
      const billing = formData.billing_address
      const billingValid = required.every(field => billing[field as keyof typeof billing]?.trim())
      return shippingValid && emailValid && billingValid
    }
    
    return shippingValid && emailValid
  }

  const countries = cart.region?.countries || []

  return (
    <div className="bg-white p-6 rounded-lg border border-ui-border-base">
      <Heading level="h2" className="mb-6">
        Contact & Shipping Information
      </Heading>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <Label htmlFor="email" className="block txt-small font-medium mb-2">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full"
          />
        </div>

        {/* Shipping Address */}
        <div className="space-y-4">
          <Heading level="h3" className="text-lg">
            Shipping Address
          </Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_first_name" className="block txt-small font-medium mb-2">
                First Name *
              </Label>
              <Input
                id="shipping_first_name"
                value={formData.shipping_address.first_name}
                onChange={(e) => handleInputChange('shipping_address', 'first_name', e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="shipping_last_name" className="block txt-small font-medium mb-2">
                Last Name *
              </Label>
              <Input
                id="shipping_last_name"
                value={formData.shipping_address.last_name}
                onChange={(e) => handleInputChange('shipping_address', 'last_name', e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shipping_company" className="block txt-small font-medium mb-2">
              Company (Optional)
            </Label>
            <Input
              id="shipping_company"
              value={formData.shipping_address.company}
              onChange={(e) => handleInputChange('shipping_address', 'company', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="shipping_address_1" className="block txt-small font-medium mb-2">
              Address Line 1 *
            </Label>
            <Input
              id="shipping_address_1"
              value={formData.shipping_address.address_1}
              onChange={(e) => handleInputChange('shipping_address', 'address_1', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="shipping_address_2" className="block txt-small font-medium mb-2">
              Address Line 2 (Optional)
            </Label>
            <Input
              id="shipping_address_2"
              value={formData.shipping_address.address_2}
              onChange={(e) => handleInputChange('shipping_address', 'address_2', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shipping_city" className="block txt-small font-medium mb-2">
                City *
              </Label>
              <Input
                id="shipping_city"
                value={formData.shipping_address.city}
                onChange={(e) => handleInputChange('shipping_address', 'city', e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="shipping_province" className="block txt-small font-medium mb-2">
                State/Province
              </Label>
              <Input
                id="shipping_province"
                value={formData.shipping_address.province}
                onChange={(e) => handleInputChange('shipping_address', 'province', e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="shipping_postal_code" className="block txt-small font-medium mb-2">
                Postal Code *
              </Label>
              <Input
                id="shipping_postal_code"
                value={formData.shipping_address.postal_code}
                onChange={(e) => handleInputChange('shipping_address', 'postal_code', e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_country" className="block txt-small font-medium mb-2">
                Country *
              </Label>
              <select
                id="shipping_country"
                value={formData.shipping_address.country_code}
                onChange={(e) => handleInputChange('shipping_address', 'country_code', e.target.value)}
                required
                className="w-full p-2 border border-ui-border-base rounded-md"
              >
                {countries.map((country) => (
                  <option key={country.iso_2} value={country.iso_2}>
                    {country.display_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="shipping_phone" className="block txt-small font-medium mb-2">
                Phone
              </Label>
              <Input
                id="shipping_phone"
                type="tel"
                value={formData.shipping_address.phone}
                onChange={(e) => handleInputChange('shipping_address', 'phone', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

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
          <div className="space-y-4">
            <Heading level="h3" className="text-lg">
              Billing Address
            </Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billing_first_name" className="block txt-small font-medium mb-2">
                  First Name *
                </Label>
                <Input
                  id="billing_first_name"
                  value={formData.billing_address.first_name}
                  onChange={(e) => handleInputChange('billing_address', 'first_name', e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="billing_last_name" className="block txt-small font-medium mb-2">
                  Last Name *
                </Label>
                <Input
                  id="billing_last_name"
                  value={formData.billing_address.last_name}
                  onChange={(e) => handleInputChange('billing_address', 'last_name', e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="billing_company" className="block txt-small font-medium mb-2">
                Company (Optional)
              </Label>
              <Input
                id="billing_company"
                value={formData.billing_address.company}
                onChange={(e) => handleInputChange('billing_address', 'company', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="billing_address_1" className="block txt-small font-medium mb-2">
                Address Line 1 *
              </Label>
              <Input
                id="billing_address_1"
                value={formData.billing_address.address_1}
                onChange={(e) => handleInputChange('billing_address', 'address_1', e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="billing_address_2" className="block txt-small font-medium mb-2">
                Address Line 2 (Optional)
              </Label>
              <Input
                id="billing_address_2"
                value={formData.billing_address.address_2}
                onChange={(e) => handleInputChange('billing_address', 'address_2', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="billing_city" className="block txt-small font-medium mb-2">
                  City *
                </Label>
                <Input
                  id="billing_city"
                  value={formData.billing_address.city}
                  onChange={(e) => handleInputChange('billing_address', 'city', e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="billing_province" className="block txt-small font-medium mb-2">
                  State/Province
                </Label>
                <Input
                  id="billing_province"
                  value={formData.billing_address.province}
                  onChange={(e) => handleInputChange('billing_address', 'province', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="billing_postal_code" className="block txt-small font-medium mb-2">
                  Postal Code *
                </Label>
                <Input
                  id="billing_postal_code"
                  value={formData.billing_address.postal_code}
                  onChange={(e) => handleInputChange('billing_address', 'postal_code', e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billing_country" className="block txt-small font-medium mb-2">
                  Country *
                </Label>
                <select
                  id="billing_country"
                  value={formData.billing_address.country_code}
                  onChange={(e) => handleInputChange('billing_address', 'country_code', e.target.value)}
                  required
                  className="w-full p-2 border border-ui-border-base rounded-md"
                >
                  {countries.map((country) => (
                    <option key={country.iso_2} value={country.iso_2}>
                      {country.display_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="billing_phone" className="block txt-small font-medium mb-2">
                  Phone
                </Label>
                <Input
                  id="billing_phone"
                  type="tel"
                  value={formData.billing_address.phone}
                  onChange={(e) => handleInputChange('billing_address', 'phone', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
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