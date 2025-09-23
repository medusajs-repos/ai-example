import { HttpTypes } from "@medusajs/types"

export const getActiveSession = (cart: HttpTypes.StoreCart) => {
  return cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )
}