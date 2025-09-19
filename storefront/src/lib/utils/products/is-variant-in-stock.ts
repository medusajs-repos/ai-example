import { HttpTypes } from "@medusajs/types";

export default function isVariantInStock(variant: HttpTypes.StoreProductVariant) {
  return !variant.manage_inventory || variant.allow_backorder || (
    variant.manage_inventory === true &&
    (variant.inventory_quantity || 0) > 0
  )
}