import { HttpTypes } from "@medusajs/types"
import { Button, Input, Label, Select, clx } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { countries } from "../../lib/constants/countries"

interface AddressFormProps {
  addressFormData: HttpTypes.StoreCreateCustomerAddress | HttpTypes.StoreAddAddress
  setAddressFormData: React.Dispatch<React.SetStateAction<HttpTypes.StoreCreateCustomerAddress | HttpTypes.StoreAddAddress | Record<string, any>>>
  shouldHandleSubmit?: boolean
  onSubmit?: ((
    address: HttpTypes.StoreCreateCustomerAddress
    ) => void) | ((
      address: HttpTypes.StoreAddAddress
    ) => void)
  onCancel?: () => void
  countries?: HttpTypes.StoreRegion["countries"]
  isLoading?: boolean
  className?: string
}

const AddressForm = ({
  addressFormData, 
  setAddressFormData, 
  shouldHandleSubmit = false, 
  onSubmit, 
  onCancel, 
  isLoading,
  countries: customCountries,
  className
}: AddressFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setAddressFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!addressFormData.first_name?.trim()) newErrors.first_name = "First name is required"
    if (!addressFormData.last_name?.trim()) newErrors.last_name = "Last name is required"
    if (!addressFormData.address_1?.trim()) newErrors.address_1 = "Address is required"
    if (!addressFormData.city?.trim()) newErrors.city = "City is required"
    if (!addressFormData.postal_code?.trim()) newErrors.postal_code = "Postal code is required"
    if (!addressFormData.country_code?.trim()) newErrors.country_code = "Country is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    
    if (!validateForm() || !shouldHandleSubmit) return

    onSubmit?.(addressFormData as any)
  }

  const countriesInput = useMemo(() => {
    if (!customCountries) {
      return countries
    }

    return customCountries.map((country) => ({
      code: country.iso_2 || "",
      name: country.display_name || ""
    }))
  }, [customCountries])

  return (
    <div className={clx("space-y-4", className)}>
      {/* Name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name" className="block txt-small font-medium mb-2">
            First Name
          </Label>
          <Input
            name="first_name"
            id="first_name"
            type="text"
            autoComplete="given-name"
            value={addressFormData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            placeholder="First name"
          />
          {errors.first_name && (
            <div className="text-red-500 txt-small mt-1">{errors.first_name}</div>
          )}
        </div>
        <div>
          <Label htmlFor="last_name" className="block txt-small font-medium mb-2">
            Last Name
          </Label>
          <Input
            name="last_name"
            id="last_name"
            type="text"
            autoComplete="family-name"
            value={addressFormData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            placeholder="Last name"
          />
          {errors.last_name && (
            <div className="text-red-500 txt-small mt-1">{errors.last_name}</div>
          )}
        </div>
      </div>

      {/* Company */}
      <div>
        <Label htmlFor="company" className="block txt-small font-medium mb-2">
          Company
        </Label>
        <Input
          name="company"
          id="company"
          type="text"
          autoComplete="organization"
          value={addressFormData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Company name"
        />
      </div>

      {/* Address fields */}
      <div>
        <Label htmlFor="address_1" className="block txt-small font-medium mb-2">
          Address Line 1
        </Label>
        <Input
          name="address_1"
          id="address_1"
          type="text"
          autoComplete="street-address"
          value={addressFormData.address_1}
          onChange={(e) => handleChange('address_1', e.target.value)}
          placeholder="Address line 1"
        />
        {errors.address_1 && (
          <div className="text-red-500 txt-small mt-1">{errors.address_1}</div>
        )}
      </div>

      <div>
        <Label htmlFor="address_2" className="block txt-small font-medium mb-2">
          Address Line 2
        </Label>
        <Input
          name="address_2"
          id="address_2"
          type="text"
          value={addressFormData.address_2}
          onChange={(e) => handleChange('address_2', e.target.value)}
          placeholder="Address line 2"
        />
      </div>

      {/* City, Province, Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city" className="block txt-small font-medium mb-2">
            City
          </Label>
          <Input
            name="city"
            id="city"
            type="text"
            autoComplete="address-level2"
            value={addressFormData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
          />
          {errors.city && (
            <div className="text-red-500 txt-small mt-1">{errors.city}</div>
          )}
        </div>
        <div>
          <Label htmlFor="province" className="block txt-small font-medium mb-2">
            State / Province
          </Label>
          <Input
            name="province"
            id="province"
            type="text"
            autoComplete="address-level1"
            value={addressFormData.province}
            onChange={(e) => handleChange('province', e.target.value)}
            placeholder="State / Province"
          />
        </div>
        <div>
          <Label htmlFor="postal_code" className="block txt-small font-medium mb-2">
            Postal Code
          </Label>
          <Input
            name="postal_code"
            id="postal_code"
            type="text"
            autoComplete="postal-code"
            value={addressFormData.postal_code}
            onChange={(e) => handleChange('postal_code', e.target.value)}
            placeholder="Postal code"
          />
          {errors.postal_code && (
            <div className="text-red-500 txt-small mt-1">{errors.postal_code}</div>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="block txt-small text-ui-fg-base mb-2">
          Country
        </label>
        <Select
          name="country_code"
          value={addressFormData.country_code}
          onValueChange={(value) => handleChange('country_code', value)}
        >
          <Select.Trigger>
            <Select.Value placeholder="Select country" />
          </Select.Trigger>
          <Select.Content>
            {countriesInput.map((country) => (
              <Select.Item key={country.code} value={country.code}>
                {country.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        {errors.country_code && (
          <div className="text-red-500 txt-small mt-1">{errors.country_code}</div>
        )}
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone" className="block txt-small font-medium mb-2">
          Phone
        </Label>
        <Input
          name="phone"
          id="phone"
          type="tel"
          autoComplete="tel"
          value={addressFormData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Phone number"
        />
      </div>

      {/* Action buttons */}
      {shouldHandleSubmit && (
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
            onClick={handleSubmit}
            isLoading={isLoading}
            className="min-w-[100px]"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  )
}

export default AddressForm