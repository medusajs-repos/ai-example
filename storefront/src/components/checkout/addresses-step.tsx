import { HttpTypes } from "@medusajs/types"
import { CheckCircleSolid } from "@medusajs/icons"
import { Heading, Text } from "@medusajs/ui"
import { useState, useCallback, useMemo } from "react"
import { setAddresses } from "@/lib/data/cart"
import ShippingAddressForm from "@/components/checkout/shipping-address-form"
import BillingAddressForm from "@/components/checkout/billing-address-form"
import compareAddresses from "@/lib/utils/compare-addresses"

interface AddressesStepProps {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  isActive: boolean
  onComplete?: () => void
}

const AddressesStep = ({ cart, customer, isActive, onComplete }: AddressesStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sameAsBilling, setSameAsBilling] = useState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const isCompleted = useMemo(() => {
    return Boolean(cart?.shipping_address)
  }, [cart?.shipping_address])

  const handleEdit = () => {
    // This would be handled by parent component
    if (onComplete) {
      onComplete()
    }
  }

  const handleSubmit = useCallback(async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      await setAddresses(null, formData)
      if (onComplete) {
        onComplete()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }, [onComplete])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row txt-xlarge-plus-regular gap-x-2 items-baseline"
        >
          Shipping Address
          {isCompleted && <CheckCircleSolid />}
        </Heading>
        {!isActive && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      
      {isActive ? (
        <form action={handleSubmit}>
          <div className="pb-8">
            <ShippingAddressForm
              customer={customer}
              cart={cart}
              checked={sameAsBilling}
              onChange={() => setSameAsBilling(!sameAsBilling)}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="txt-xlarge-plus-regular gap-x-4 pb-6 pt-8"
                >
                  Billing address
                </Heading>
                <BillingAddressForm cart={cart} />
              </div>
            )}
            
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-ui-bg-interactive text-white px-8 py-3 txt-medium-regular hover:bg-ui-bg-interactive-hover disabled:opacity-50"
                data-testid="submit-address-button"
              >
                {isSubmitting ? "Processing..." : "Continue to delivery"}
              </button>
            </div>
            
            {error && (
              <div className="text-red-500 txt-small mt-4" data-testid="address-error-message">
                {error}
              </div>
            )}
          </div>
        </form>
      ) : (
        <div>
          <div className="txt-smallall-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div
                    className="flex flex-col w-1/3"
                    data-testid="shipping-address-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Shipping Address
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3 "
                    data-testid="shipping-contact-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Contact
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.email}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3"
                    data-testid="billing-address-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Billing Address
                    </Text>

                    {sameAsBilling ? (
                      <Text className="txt-medium text-ui-fg-subtle">
                        Billing- and delivery address are the same.
                      </Text>
                    ) : (
                      <>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.address_1}{" "}
                          {cart.billing_address?.address_2}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.postal_code},{" "}
                          {cart.billing_address?.city}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ui-fg-base" />
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="border-t border-ui-border-base mt-8" />
    </div>
  )
}

export default AddressesStep