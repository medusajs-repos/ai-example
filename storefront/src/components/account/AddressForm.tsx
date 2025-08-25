import { HttpTypes } from "@medusajs/types"
import { Button, Input, Select } from "@medusajs/ui"
import { useState } from "react"

interface AddressFormProps {
  address?: HttpTypes.StoreCustomerAddress
  onSubmit: (address: HttpTypes.StoreCreateCustomerAddress) => void
  onCancel: () => void
  isLoading?: boolean
}

const AddressForm = ({ address, onSubmit, onCancel, isLoading }: AddressFormProps) => {
  const [formData, setFormData] = useState({
    first_name: address?.first_name || "",
    last_name: address?.last_name || "",
    company: address?.company || "",
    address_1: address?.address_1 || "",
    address_2: address?.address_2 || "",
    city: address?.city || "",
    province: address?.province || "",
    postal_code: address?.postal_code || "",
    country_code: address?.country_code || "",
    phone: address?.phone || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) newErrors.first_name = "First name is required"
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required"
    if (!formData.address_1.trim()) newErrors.address_1 = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.postal_code.trim()) newErrors.postal_code = "Postal code is required"
    if (!formData.country_code.trim()) newErrors.country_code = "Country is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    onSubmit(formData)
  }

  // Common countries - you can expand this list
  const countries = [
    { code: "us", name: "United States" },
    { code: "ca", name: "Canada" },
    { code: "gb", name: "United Kingdom" },
    { code: "de", name: "Germany" },
    { code: "fr", name: "France" },
    { code: "es", name: "Spain" },
    { code: "it", name: "Italy" },
    { code: "au", name: "Australia" },
    { code: "jp", name: "Japan" },
    { code: "br", name: "Brazil" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="First name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            placeholder="First name"
            required
          />
          {errors.first_name && (
            <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>
          )}
        </div>
        <div>
          <Input
            label="Last name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            placeholder="Last name"
            required
          />
          {errors.last_name && (
            <div className="text-red-500 text-sm mt-1">{errors.last_name}</div>
          )}
        </div>
      </div>

      {/* Company */}
      <div>
        <Input
          label="Company (optional)"
          name="company"
          type="text"
          autoComplete="organization"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Company name"
        />
      </div>

      {/* Address fields */}
      <div>
        <Input
          label="Address"
          name="address_1"
          type="text"
          autoComplete="street-address"
          value={formData.address_1}
          onChange={(e) => handleChange('address_1', e.target.value)}
          placeholder="Address line 1"
          required
        />
        {errors.address_1 && (
          <div className="text-red-500 text-sm mt-1">{errors.address_1}</div>
        )}
      </div>

      <div>
        <Input
          label="Apartment, suite, etc. (optional)"
          name="address_2"
          type="text"
          value={formData.address_2}
          onChange={(e) => handleChange('address_2', e.target.value)}
          placeholder="Address line 2"
        />
      </div>

      {/* City, Province, Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            label="City"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
            required
          />
          {errors.city && (
            <div className="text-red-500 text-sm mt-1">{errors.city}</div>
          )}
        </div>
        <div>
          <Input
            label="State / Province"
            name="province"
            type="text"
            autoComplete="address-level1"
            value={formData.province}
            onChange={(e) => handleChange('province', e.target.value)}
            placeholder="State / Province"
          />
        </div>
        <div>
          <Input
            label="Postal code"
            name="postal_code"
            type="text"
            autoComplete="postal-code"
            value={formData.postal_code}
            onChange={(e) => handleChange('postal_code', e.target.value)}
            placeholder="Postal code"
            required
          />
          {errors.postal_code && (
            <div className="text-red-500 text-sm mt-1">{errors.postal_code}</div>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-2">
          Country
        </label>
        <select
          name="country_code"
          value={formData.country_code}
          onChange={(e) => handleChange('country_code', e.target.value)}
          required
          className="w-full p-2 border border-ui-border-base rounded-md text-ui-fg-base bg-ui-bg-base"
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country_code && (
          <div className="text-red-500 text-sm mt-1">{errors.country_code}</div>
        )}
      </div>

      {/* Phone */}
      <div>
        <Input
          label="Phone (optional)"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Phone number"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-x-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="min-w-[100px]"
        >
          {address ? 'Update' : 'Save'} address
        </Button>
      </div>
    </form>
  )
}

export default AddressForm