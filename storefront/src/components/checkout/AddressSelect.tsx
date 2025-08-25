import { HttpTypes } from "@medusajs/types"

interface AddressSelectProps {
  addresses: HttpTypes.StoreCustomerAddress[]
  addressInput: HttpTypes.StoreCartAddress
  onSelect: (address: HttpTypes.StoreCartAddress, email?: string) => void
}

const AddressSelect = ({ addresses, addressInput, onSelect }: AddressSelectProps) => {
  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    if (!selectedId) return

    const selectedAddress = addresses.find(addr => addr.id === selectedId)
    if (selectedAddress) {
      onSelect({
        first_name: selectedAddress.first_name || "",
        last_name: selectedAddress.last_name || "",
        address_1: selectedAddress.address_1 || "",
        address_2: selectedAddress.address_2 || "",
        city: selectedAddress.city || "",
        country_code: selectedAddress.country_code || "",
        postal_code: selectedAddress.postal_code || "",
        province: selectedAddress.province || "",
        company: selectedAddress.company || "",
        phone: selectedAddress.phone || "",
      })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <select
        onChange={handleAddressSelect}
        className="w-full px-3 py-2 border border-ui-border-base rounded focus:outline-none focus:border-ui-border-interactive"
      >
        <option value="">Select a saved address</option>
        {addresses.map((address) => (
          <option key={address.id} value={address.id}>
            {address.first_name} {address.last_name} - {address.address_1}, {address.city}
          </option>
        ))}
      </select>
    </div>
  )
}

export default AddressSelect