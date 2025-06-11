import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { IProductReviewModuleService } from "../../../types/product-review"
import { PRODUCT_REVIEW_MODULE } from "../../../modules/product-review"

type RejectProductReviewStepInput = {
  id: string
}

export const rejectProductReviewStep = createStep(
  "reject-product-review-step",
  async (input: RejectProductReviewStepInput, { container }) => {
    const reviewModuleService = container.resolve<IProductReviewModuleService>(
      PRODUCT_REVIEW_MODULE
    )

    const review = await reviewModuleService.rejectProductReview(input.id)

    return new StepResponse(review, review.id)
  },
  async (reviewId, { container }) => {
    if (!reviewId) {
      return
    }

    const reviewModuleService = container.resolve<IProductReviewModuleService>(
      PRODUCT_REVIEW_MODULE
    )

    await reviewModuleService.approveProductReview(reviewId)
  }
) 