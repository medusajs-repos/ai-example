import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { IProductReviewModuleService } from "../../../types/product-review"
import { PRODUCT_REVIEW_MODULE } from "../../../modules/product-review"

type ApproveProductReviewStepInput = {
  id: string
}

export const approveProductReviewStep = createStep(
  "approve-product-review-step",
  async (input: ApproveProductReviewStepInput, { container }) => {
    const reviewModuleService = container.resolve<IProductReviewModuleService>(
      PRODUCT_REVIEW_MODULE
    )

    const review = await reviewModuleService.approveProductReview(input.id)

    return new StepResponse(review, review.id)
  },
  async (reviewId, { container }) => {
    if (!reviewId) {
      return
    }

    const reviewModuleService = container.resolve<IProductReviewModuleService>(
      PRODUCT_REVIEW_MODULE
    )

    await reviewModuleService.updateProductReviews({
      id: reviewId,
      approved_at: null
    })
  }
) 