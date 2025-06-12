
/* Entity: ProductReview */

export type ModuleProductReview = {
  id: string
  product_id: string
  customer_id: string
  rating: number
  title: string | null
  content: string
  approved_at: Date | null
  rejected_at: Date | null
  created_at: Date
  updated_at: Date
}

export type ModuleCreateProductReview = {
  product_id: string
  customer_id: string
  rating: number
  title?: string | null
  content: string
}

export interface ModuleUpdateProductReview extends Partial<ModuleProductReview> {
  id: string
}

export type ModuleDeleteProductReview = {
  id: string
}
