import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for displaying formatted address information in the storefront
 * - Checkout pages: show selected shipping and billing addresses
 * - Account pages: display saved customer addresses
 * - Order confirmations: show delivery and billing addresses
 * - Order history: display addresses from past orders
 * - Address book: show formatted address entries
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for order confirmation and tracking
 * - Essential for address verification and validation
 * - Important for customer account management
 * - Required for shipping and delivery information
 * - Used in order management and history
 * - Important for international commerce
 * 
 * ADDRESS FORMATTING:
 * - Displays full address with proper line breaks
 * - Handles optional address line 2
 * - Shows country code in uppercase
 * - Consistent formatting across all address types
 * - Responsive design for mobile/desktop
 * 
 * COMMON PATTERNS:
 * - Checkout address confirmation
 * - Account address book display
 * - Order confirmation addresses
 * - Order history address display
 * - Shipping label formatting
 * 
 * EXAMPLES:
 * - <Address address={shippingAddress} />
 * - <Address address={billingAddress} className="text-sm" />
 * - <Address address={orderAddress} />
 */

type AddressProps = {
  address: HttpTypes.StoreCustomerAddress |
    HttpTypes.StoreCartAddress |
    HttpTypes.StoreOrderAddress
  className?: string
}

const Address = ({ address, className }: AddressProps) => {
  return (
    <p className={clx(
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
    </p>
  )
}

export default Address