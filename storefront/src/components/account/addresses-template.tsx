import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useState } from "react"
import { Plus, EllipsisHorizontal } from "@medusajs/icons"
import { useCreateCustomerAddress, useCustomerUpdateAddress, useCustomerDeleteAddress } from "@/lib/hooks/dynamic/use-customer-address"
import AccountContainer from "@/components/account/account-container"
import Address from "@/components/common/address"
import AddressForm from "@/components/common/address-form"

interface AddressesTemplateProps {
  customer: HttpTypes.StoreCustomer
}

const AddressesTemplate = ({ customer }: AddressesTemplateProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const addresses = customer.addresses || []

  return (
    <AccountContainer
      title="Addresses"
      description="View and update your addresses, you can add as many as you like. Saving your addresses will make them available during checkout."
    >
      <div className="flex items-center justify-between">
        <h2 className="txt-xlarge font-medium text-ui-fg-base">Address book</h2>
        <Button
          size="small"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-x-2"
        >
          <Plus />
          Add address
        </Button>
      </div>

      {isAdding && (
        <div className="border border-ui-border-base rounded-lg p-8 bg-ui-bg-subtle">
          <h3 className="text-lg font-medium text-ui-fg-base mb-6">Add new address</h3>
          <AddAddressForm
            onSuccess={() => setIsAdding(false)}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-ui-border-base rounded-lg bg-ui-bg-subtle">
          <div className="text-center">
            <p className="text-lg text-ui-fg-subtle mb-2">You haven't saved any addresses yet.</p>
            <p className="text-ui-fg-muted">Add an address to make checkout faster.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              customer={customer}
            />
          ))}
        </div>
      )}
    </AccountContainer>
  )
}

interface AddressCardProps {
  address: HttpTypes.StoreCustomerAddress
  customer: HttpTypes.StoreCustomer
}

const AddressCard = ({ address, customer }: AddressCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const deleteAddress = useCustomerDeleteAddress()

  const isDefaultBilling = address.id === customer.default_billing_address_id
  const isDefaultShipping = address.id === customer.default_shipping_address_id

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this address?")) {
      deleteAddress.mutate({ address_id: address.id })
    }
  }

  return (
    <div className="border border-ui-border-base rounded-lg p-8 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-y-2">
          <div className="text-lg font-medium text-ui-fg-base">
            {address.first_name} {address.last_name}
          </div>
          {address.company && (
            <div className="text-ui-fg-subtle">
              {address.company}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-ui-fg-subtle hover:text-ui-fg-base p-1"
          >
            <EllipsisHorizontal />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-ui-border-base rounded-rounded shadow-elevation-modal min-w-[120px] z-10">
              <button
                onClick={() => {
                  setIsEditing(true)
                  setShowMenu(false)
                }}
                className="w-full text-left px-3 py-2 txt-smallall-regular text-ui-fg-base hover:bg-ui-bg-subtle first:rounded-t-rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteAddress.isPending}
                className="w-full text-left px-3 py-2 txt-smallall-regular text-red-500 hover:bg-ui-bg-subtle last:rounded-b-rounded disabled:opacity-50"
              >
                {deleteAddress.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <EditAddressForm
          address={address}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="flex flex-col gap-y-3">
          <Address address={address} />
          <div className="flex gap-x-3 mt-4">
            {isDefaultBilling && (
              <div className="px-3 py-1.5 bg-ui-bg-base border border-ui-border-base text-ui-fg-subtle txt-small rounded-md font-medium">
                Default billing
              </div>
            )}
            {isDefaultShipping && (
              <div className="px-3 py-1.5 bg-ui-bg-base border border-ui-border-base text-ui-fg-subtle txt-small rounded-md font-medium">
                Default shipping
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface AddAddressFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const AddAddressForm = ({ onSuccess, onCancel }: AddAddressFormProps) => {
  const [addressFormData, setAddressFormData] = useState<Record<string, any>>({})
  const createAddress = useCreateCustomerAddress()

  const handleSubmit = async (addressData: HttpTypes.StoreCreateCustomerAddress) => {
    try {
      await createAddress.mutateAsync({ address: addressData })
      onSuccess()
    } catch (error) {
      console.error("Failed to create address:", error)
    }
  }

  return (
    <AddressForm
      shouldHandleSubmit
      addressFormData={addressFormData}
      setAddressFormData={setAddressFormData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={createAddress.isPending}
    />
  )
}

interface EditAddressFormProps {
  address: HttpTypes.StoreCustomerAddress
  onSuccess: () => void
  onCancel: () => void
}

const EditAddressForm = ({ address, onSuccess, onCancel }: EditAddressFormProps) => {
  const [addressFormData, setAddressFormData] = useState<Record<string, any>>({
    first_name: address.first_name || "",
    last_name: address.last_name || "",
    company: address.company || "",
    address_1: address.address_1 || "",
    address_2: address.address_2 || "",
    city: address.city || "",
    postal_code: address.postal_code || "",
    province: address.province || "",
    country_code: address.country_code || "",
    phone: address.phone || "",
  })
  const updateAddress = useCustomerUpdateAddress()

  const handleSubmit = async (addressData: HttpTypes.StoreCreateCustomerAddress) => {
    try {
      await updateAddress.mutateAsync({
        address_id: address.id!,
        address: addressData
      })
      onSuccess()
    } catch (error) {
      console.error("Failed to update address:", error)
    }
  }

  return (
    <AddressForm
      addressFormData={addressFormData}
      setAddressFormData={setAddressFormData}
      shouldHandleSubmit
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={updateAddress.isPending}
    />
  )
}

export default AddressesTemplate