import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@/lib/utils/money"

interface CartTotalsProps {
  cart: HttpTypes.StoreCart
}

const CartTotals = ({ cart }: CartTotalsProps) => {
  const region = cart.region
  
  if (!region) {
    return null
  }

  const subtotal = convertToLocale({
    amount: cart.subtotal || 0,
    currency_code: region.currency_code
  })

  const shippingTotal = convertToLocale({
    amount: cart.shipping_total || 0,
    currency_code: region.currency_code
  })

  const taxTotal = convertToLocale({
    amount: cart.tax_total || 0,
    currency_code: region.currency_code
  })

  const discountTotal = convertToLocale({
    amount: cart.discount_total || 0,
    currency_code: region.currency_code
  })

  const total = convertToLocale({
    amount: cart.total || 0,
    currency_code: region.currency_code
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between txt-smallall-regular">
          <span className="text-ui-fg-base">Subtotal</span>
          <span className="text-ui-fg-base">{subtotal}</span>
        </div>
        
        {(cart.discount_total || 0) > 0 && (
          <div className="flex justify-between txt-smallall-regular">
            <span className="text-ui-fg-base">Discount</span>
            <span className="text-ui-fg-base">-{discountTotal}</span>
          </div>
        )}
        
        {(cart.shipping_total || 0) > 0 && (
          <div className="flex justify-between txt-smallall-regular">
            <span className="text-ui-fg-base">Shipping</span>
            <span className="text-ui-fg-base">{shippingTotal}</span>
          </div>
        )}
        
        {(cart.tax_total || 0) > 0 && (
          <div className="flex justify-between txt-smallall-regular">
            <span className="text-ui-fg-base">Taxes</span>
            <span className="text-ui-fg-base">{taxTotal}</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-ui-border-base" />
      
      <div className="flex justify-between txt-medium-semi">
        <span className="text-ui-fg-base">Total</span>
        <span className="text-ui-fg-base">{total}</span>
      </div>
    </div>
  )
}

export default CartTotals