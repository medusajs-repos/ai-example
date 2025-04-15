"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button, Heading, Text } from "@medusajs/ui"
import {
  getProductReviews,
  ProductReviewsResponse,
  StoreProductReview,
} from "../../../../lib/data/reviews"
import StarRating from "../star-rating"
import ProductReviewForm from "../product-review-form"
import { HttpTypes } from "@medusajs/types"
import Divider from "../../../common/components/divider"
import Spinner from "../../../common/icons/spinner"

// INSTRUCTIONS:
// - Fetches and displays product reviews.
// - Shows average rating and total review count.
// - Includes pagination (Load More button).
// - Conditionally renders the review form if a customer is provided.

type ProductReviewsProps = {
  productId: string
  customer: Omit<HttpTypes.StoreCustomer, "password_hash"> | null // Pass customer data to conditionally show form
}

const ProductReviews = ({ productId, customer }: ProductReviewsProps) => {
  const [reviewsData, setReviewsData] = useState<ProductReviewsResponse | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const limit = 5 // Number of reviews per page

  const fetchReviews = useCallback(
    async (currentOffset: number, append = false) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getProductReviews({ productId, limit, offset: currentOffset })
        if (data) {
          setReviewsData((prevData) => {
            if (append && prevData) {
              // Append new reviews to existing ones
              return {
                ...data,
                reviews: [...prevData.reviews, ...data.reviews],
              }
            } else {
              // Replace existing data (initial load or refresh)
              return data
            }
          })
        } else {
           setReviewsData({ reviews: [], average_rating: 0, count: 0, limit, offset: 0 }) // Set empty state
        }
      } catch (err) {
        setError("Failed to load reviews. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    },
    [productId, limit]
  )

  useEffect(() => {
    // Initial fetch
    fetchReviews(0)
  }, [fetchReviews])

  const handleLoadMore = () => {
    const newOffset = offset + limit
    setOffset(newOffset)
    fetchReviews(newOffset, true) // Fetch next page and append
  }

  const handleReviewSubmitted = () => {
    // Refresh reviews after submission
    setOffset(0) // Reset offset
    fetchReviews(0, false) // Fetch first page again
  }

  const hasMoreReviews = reviewsData ? reviewsData.reviews.length < reviewsData.count : false

  return (
    <div className="flex flex-col gap-y-6 py-8">
      <Heading level="h3" className="text-xl-semi">
        Product Reviews
      </Heading>

      {/* Average Rating Summary */}
      {reviewsData && reviewsData.count > 0 && (
        <div className="flex items-center gap-x-2">
          <StarRating rating={reviewsData.average_rating} />
          <Text className="text-ui-fg-subtle">
            ({reviewsData.average_rating.toFixed(1)} average based on{" "}
            {reviewsData.count} review{reviewsData.count !== 1 ? "s" : ""})
          </Text>
        </div>
      )}

      <Divider />

      {/* Review Form (only for logged-in customers) */}
      {customer && (
        <div className="mb-6">
          <Heading level="h4" className="text-lg-regular mb-4">
            Write a Review
          </Heading>
          <ProductReviewForm
            productId={productId}
            onReviewSubmitted={handleReviewSubmitted}
          />
           <Divider />
        </div>
      )}
      {!customer && (
         <div className="mb-6 p-4 border rounded-md bg-ui-bg-subtle">
            <Text>You must be <a href="/account" className="text-ui-fg-interactive hover:underline">logged in</a> to write a review.</Text>
         </div>
      )}

      {/* Reviews List */}
      {isLoading && offset === 0 && (
        <div className="flex justify-center items-center h-32">
          <Spinner size={24} />
        </div>
      )}
      {error && !isLoading && (
        <Text className="text-rose-500">{error}</Text>
      )}
      {!isLoading && !error && reviewsData?.reviews.length === 0 && (
        <Text>No reviews yet. Be the first to write one!</Text>
      )}

      {reviewsData && reviewsData.reviews.length > 0 && (
        <div className="flex flex-col gap-y-6">
          {reviewsData.reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between">
                <Heading level="h5" className="text-base-semi">
                  {review.customer_name || "Customer"}
                </Heading>
                <Text className="text-ui-fg-muted text-small-regular">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </div>
              <StarRating rating={review.rating} size={16} />
              {review.title && (
                <Text className="font-medium mt-1">{review.title}</Text>
              )}
              <Text className="text-ui-fg-subtle text-sm">
                {review.content}
              </Text>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMoreReviews && (
        <div className="flex justify-center mt-6">
          <Button
            variant="secondary"
            onClick={handleLoadMore}
            isLoading={isLoading && offset > 0}
            disabled={isLoading}
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductReviews
