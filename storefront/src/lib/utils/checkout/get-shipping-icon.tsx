import { HttpTypes } from "@medusajs/types"
import { Clock, TruckFast } from "@medusajs/icons"

export const getShippingIcon = (shippingOption: HttpTypes.StoreCartShippingOption) => {
  if (!shippingOption.type.code.includes("express")) {
    return <Clock />
  } 
  return <TruckFast />
}