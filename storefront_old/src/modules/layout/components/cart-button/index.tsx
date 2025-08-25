import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "@modules/layout/components/cart-dropdown"

export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null)

  return <CartDropdown cart={cart} />
}
