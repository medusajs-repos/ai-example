
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { z } from "zod"

export const StoreGetProductReviewsParams = createFindParams({
  limit: 10,
  offset: 0,
}).merge(
  z.object({
    rating: z.coerce.number().min(1).max(5).optional(),
    created_at: z.date().optional(),
    q: z.string().optional(), // For searching title/content
  })
)
export type StoreGetProductReviewsParamsType = z.infer<
  typeof StoreGetProductReviewsParams
>

export const StoreCreateProductReview = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional().nullable(),
  content: z.string(),
})
export type StoreCreateProductReviewType = z.infer<
  typeof StoreCreateProductReview
>
