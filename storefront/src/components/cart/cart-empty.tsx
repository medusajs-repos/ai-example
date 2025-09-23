import { getCountryCodeFromPath } from "@/lib/utils/regions"
import { Link, useLocation } from "@tanstack/react-router"

const CartEmpty = () => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);

  return (
    <div className="text-center py-16">
      <h2 className="text-lg font-medium text-ui-fg-base mb-2">
        Your cart is empty
      </h2>
      <p className="text-ui-fg-muted mb-8">Start by adding some products</p>
      <Link
        to={`/${countryCode}/store` as any}
        className="bg-ui-fg-base text-ui-fg-on-color px-6 py-3 rounded txt-small hover:bg-ui-fg-subtle transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  )
}

export default CartEmpty