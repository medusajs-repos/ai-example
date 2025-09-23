import { HttpTypes } from "@medusajs/types"

export const sortCartItems = (items: HttpTypes.StoreCartLineItem[]) => {
  return items.sort((a, b) => {
    if (!a.created_at || !b.created_at) {
      return 0
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}