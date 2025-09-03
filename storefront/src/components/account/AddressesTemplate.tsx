import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useState } from "react"
import { Plus, EllipsisHorizontal } from "@medusajs/icons"
import { useCreateAddress, useUpdateAddress, useDeleteAddress } from "@lib/hooks/useAddress"
import AddressForm from "./AddressForm"
import AccountContainer from "./AccountContainer"

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
          <Plus size={16} />
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
  const deleteAddress = useDeleteAddress()

  const isDefaultBilling = customer.billing_address?.id === address.id
  const isDefaultShipping = customer.shipping_address?.id === address.id

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this address?')) {
      deleteAddress.mutate(address.id!)
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
            <EllipsisHorizontal size={16} />
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
                {deleteAddress.isPending ? 'Deleting...' : 'Delete'}
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
          <div className="text-ui-fg-base leading-relaxed">
            <div className="mb-1">{address.address_1}</div>
            {address.address_2 && <div className="mb-1">{address.address_2}</div>}
            <div className="mb-1">
              {address.postal_code}, {address.city}
            </div>
            {address.province && <div className="mb-1">{address.province}</div>}
            <div className="font-medium">{address.country_code?.toUpperCase()}</div>
          </div>
          {address.phone && (
            <div className="text-ui-fg-subtle">
              Phone: {address.phone}
            </div>
          )}
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
  const createAddress = useCreateAddress()

  const handleSubmit = async (addressData: HttpTypes.StoreCreateCustomerAddress) => {
    try {
      await createAddress.mutateAsync(addressData)
      onSuccess()
    } catch (error) {
      console.error('Failed to create address:', error)
    }
  }

  return (
    <AddressForm
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
  const updateAddress = useUpdateAddress()

  const handleSubmit = async (addressData: HttpTypes.StoreCreateCustomerAddress) => {
    try {
      await updateAddress.mutateAsync({
        addressId: address.id!,
        address: addressData
      })
      onSuccess()
    } catch (error) {
      console.error('Failed to update address:', error)
    }
  }

  return (
    <AddressForm
      address={address}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={updateAddress.isPending}
    />
  )
}

export default AddressesTemplate