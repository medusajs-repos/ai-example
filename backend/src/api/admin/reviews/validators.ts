import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";

export const AdminGetReviewsParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    product_id: z.string().optional(),
    customer_id: z.string().optional(),
    rating: z.coerce.number().min(1).max(5).optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    q: z.string().optional(), // For searching title/content
  })
);
export type AdminGetReviewsParamsType = z.infer<typeof AdminGetReviewsParams>;

export const AdminGetReviewParams = createFindParams();
export type AdminGetReviewParamsType = z.infer<typeof AdminGetReviewParams>;

export const AdminUpdateReview = z.object({
  rating: z.number().min(1).max(5).optional(),
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
});
export type AdminUpdateReviewType = z.infer<typeof AdminUpdateReview>;
