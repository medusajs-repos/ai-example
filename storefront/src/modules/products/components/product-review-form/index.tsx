"use client"

import { submitProductReviewAction } from "@lib/data/reviews"
import { Star } from "@medusajs/icons"
import { Input, Label, Textarea, clx } from "@medusajs/ui"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { useEffect, useRef, useState } from "react"
import { useFormState } from "react-dom"

// INSTRUCTIONS:
// - A form for submitting product reviews.
// - Uses a server action (`submitProductReviewAction`) for submission.
// - Includes fields for rating (interactive stars), title (optional), and content.
// - Shows success/error messages based on the server action response.

type ProductReviewFormProps = {
  productId: string
  onReviewSubmitted?: () => void // Optional callback after successful submission
}

const ProductReviewForm = ({
  productId,
  onReviewSubmitted,
}: ProductReviewFormProps) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction] = useFormState(submitProductReviewAction, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (state.success) {
      // Reset form on successful submission
      formRef.current?.reset()
      setRating(0)
      if (onReviewSubmitted) {
        onReviewSubmitted() // Call callback if provided
      }
      // Optionally show a success message for a few seconds
    }
  }, [state.success, onReviewSubmitted])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-y-4">
      <input type="hidden" name="product_id" value={productId} />

      <div>
        <Label className="mb-2 block">
          Rating<span className="text-rose-500">*</span>
        </Label>
        <div className="flex items-center gap-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-0 bg-transparent border-none cursor-pointer"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={clx("transition-colors duration-150", {
                  "text-ui-tag-orange-icon": (hoverRating || rating) >= star,
                  "text-ui-fg-muted": (hoverRating || rating) < star,
                })}
                size={24}
                fill="currentColor"
              />
            </button>
          ))}
        </div>
        {/* Hidden input to submit the actual rating value */}
        <input type="hidden" name="rating" value={rating} />
        {/* Display validation error for rating if needed, though button click ensures a value > 0 */}
      </div>

      <Input label="Review Title (Optional)" name="title" autoComplete="off" />

      <Textarea
        label="Review Content"
        name="content"
        required
        rows={4}
        autoComplete="off"
      />

      {state.error && (
        <div className="text-rose-500 text-small-regular py-2">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="text-green-500 text-small-regular py-2">
          Review submitted successfully!
        </div>
      )}

      <SubmitButton data-testid="submit-review-button" disabled={rating === 0}>
        Submit Review
      </SubmitButton>
    </form>
  )
}

export default ProductReviewForm
