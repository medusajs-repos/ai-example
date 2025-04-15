"use server"

import { sdk } from "../config"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"
import { revalidateTag } from "next/cache"
import medusaError from "../util/medusa-error"
import { HttpTypes } from "@medusajs/types"

// INSTRUCTIONS:
// - Provides functions to fetch product reviews and submit new reviews.
// - `getProductReviews` fetches reviews for a product using the custom backend API.
// - `submitProductReviewAction` is a server action to handle review form submissions.

// Define a type for the review structure expected from the backend
// Match this with the response structure in backend/src/api/store/products/[id]/reviews/route.ts GET handler
export type StoreProductReview = {
  id: string
  product_id: string
  customer_id: string
  rating: number
  title: string | null
  content: string
  created_at: string
  updated_at: string
  customer_name: string // Added by the backend route
  customer?: HttpTypes.StoreCustomer // Potentially included via link
}

export type ProductReviewsResponse = {
  reviews: StoreProductReview[]
  average_rating: number
  count: number
  limit: number
  offset: number
}

/**
 * Fetches product reviews for a given product ID.
 */
export const getProductReviews = async ({
  productId,
  limit = 10,
  offset = 0,
}: {
  productId: string
  limit?: number
  offset?: number
}): Promise<ProductReviewsResponse | null> => {
  const headers = {
    ...(await getAuthHeaders()), // Include auth headers if needed for any reason
  }

  const cacheTag = await getCacheTag(`product-reviews-${productId}`)
  const next = {
    ...(await getCacheOptions(`product-reviews-${productId}`)),
    tags: [cacheTag], // Add tag for revalidation
  }

  try {
    return await sdk.client.fetch<ProductReviewsResponse>(
      `/store/products/${productId}/reviews`,
      {
        method: "GET",
        headers,
        query: {
          limit,
          offset,
        },
        next,
        cache: "force-cache", // Use Next.js caching
      }
    )
  } catch (error) {
    console.error("Failed to fetch product reviews:", error)
    return null
  }
}

/**
 * Server action to submit a product review.
 */
export async function submitProductReviewAction(
  currentState: unknown,
  formData: FormData
): Promise<{ success: boolean; error: string | null; review?: StoreProductReview }> {
  const productId = formData.get("product_id") as string
  const title = formData.get("title") as string | undefined
  const content = formData.get("content") as string
  const rating = formData.get("rating") as string // Comes as string from form

  if (!productId) {
    return { success: false, error: "Product ID is missing." }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!headers["authorization"] && !headers["cookie"]) {
     return { success: false, error: "You must be logged in to submit a review." }
  }

  const body = {
    title: title || null,
    content,
    rating: parseInt(rating, 10),
  }

  try {
    const { review } = await sdk.client.fetch<{
      review: StoreProductReview
    }>(`/store/products/${productId}/reviews`, {
      method: "POST",
      headers,
      body,
      // No cache for POST
    })

    // Revalidate the cache tag for this product's reviews
    const cacheTag = await getCacheTag(`product-reviews-${productId}`)
    revalidateTag(cacheTag)

    return { success: true, error: null, review }
  } catch (error: any) {
    console.error("Failed to submit review:", error)
    return { success: false, error: medusaError(error).message }
  }
}
