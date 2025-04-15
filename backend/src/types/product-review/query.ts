
import { HttpTypes } from "@medusajs/types"
import { ModuleProductReview } from "./module"

export type QueryProductReview = ModuleProductReview & {
  customer?: HttpTypes.StoreCustomer // Assuming StoreCustomer type is appropriate
  product?: HttpTypes.StoreProduct // Assuming StoreProduct type is appropriate
}
