import type { StorePrice, HttpTypes } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

export type ProductReview = {
  id: string
  product_id: string
  customer_id: string
  rating: number
  title: string | null
  content: string
  created_at: string
  updated_at: string
  customer_name: string
  customer?: HttpTypes.StoreCustomer
}