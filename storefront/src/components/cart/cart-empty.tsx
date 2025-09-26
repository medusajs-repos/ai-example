import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { Button } from "@/components/common/button"
import { Link, useLocation } from "@tanstack/react-router"

const CartEmpty = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)

  return (
    <div className="text-center py-16 flex flex-col items-center justify-center gap-4">
      <h2 className="txt-large-plus text-primary-text">
        Your cart is empty
      </h2>
      <p className="text-secondary-text txt-medium">Start by adding some products</p>
      <Link
        to={`/${countryCode}/store` as any}
      >
        <Button variant="primary" size="fit">
          Continue shopping
        </Button>
      </Link>
    </div>
  )
}

export default CartEmpty