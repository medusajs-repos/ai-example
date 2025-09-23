import { HttpTypes } from "@medusajs/types"

export const isPaidWithGiftCard = (cartOrOrder: HttpTypes.StoreCart | HttpTypes.StoreOrder) => {
  return (cartOrOrder as any)?.gift_cards && 
  (cartOrOrder as any)?.gift_cards?.length > 0 && 
  cartOrOrder?.total === 0
}