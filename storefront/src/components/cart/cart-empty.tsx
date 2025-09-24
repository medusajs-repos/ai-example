import { getCountryCodeFromPath } from "@/lib/utils/regions/regions"
import { Button } from "@/components/common/button"
import { Link, useLocation } from "@tanstack/react-router"

const CartEmpty = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)

  return (
    <div className="text-center py-16">
      <h2 className="txt-large-plus text-primary-text mb-2">
        Your cart is empty
      </h2>
      <p className="text-secondary-text mb-8">Start by adding some products</p>
      <Link
        to={`/${countryCode}/store` as any}
      >
        <Button variant="primary">
          Continue shopping
        </Button>
      </Link>
    </div>
  )
}

export default CartEmpty