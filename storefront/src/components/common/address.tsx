import { HttpTypes } from "@medusajs/types"
import { clx, Text } from "@medusajs/ui"

type AddressProps = {
  address: HttpTypes.StoreCustomerAddress |
    HttpTypes.StoreCartAddress |
    HttpTypes.StoreOrderAddress
  className?: string
}

const Address = ({ address, className }: AddressProps) => {
  return (
    <Text className={clx(
      "txt-small text-secondary-text",
      className
    )}>
      {address.first_name} {address.last_name}
      <br />
      {address.address_1}
      {address.address_2 &&
        `, ${address.address_2}`}
      <br />
      {address.city}, {address.postal_code}
      <br />
      {address.country_code?.toUpperCase()}
    </Text>
  )
}

export default Address