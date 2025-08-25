import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@lib/util/regions"

interface CartSummaryProps {
  cart: HttpTypes.StoreCart
  region: HttpTypes.StoreRegion
}

const CartSummary = ({ cart, region }: CartSummaryProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ''

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

  const total = convertToLocale({
    amount: cart.total || 0,
    currency_code: region.currency_code
  })

  return (
    <div className="max-w-sm ml-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-ui-fg-muted">Subtotal</span>
            <span className="text-ui-fg-base">{subtotal}</span>
          </div>
          
          {(cart.shipping_total || 0) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-ui-fg-muted">Shipping</span>
              <span className="text-ui-fg-base">{shippingTotal}</span>
            </div>
          )}
          
          {(cart.tax_total || 0) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-ui-fg-muted">Tax</span>
              <span className="text-ui-fg-base">{taxTotal}</span>
            </div>
          )}
        </div>
        
        <hr className="border-ui-border-base" />
        
        <div className="flex justify-between font-medium">
          <span className="text-ui-fg-base">Total</span>
          <span className="text-ui-fg-base">{total}</span>
        </div>
        
        <Link
          to={`${baseHref}/checkout` as any}
          className="w-full bg-ui-fg-base text-ui-fg-on-color py-3 rounded text-sm font-medium hover:bg-ui-fg-subtle transition-colors disabled:opacity-50 block text-center"
          style={{ 
            pointerEvents: !cart.items?.length ? 'none' : 'auto',
            opacity: !cart.items?.length ? 0.5 : 1
          }}
        >
          Checkout
        </Link>
      </div>
    </div>
  )
}

export default CartSummary