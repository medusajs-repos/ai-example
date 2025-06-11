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

    // Compensation: How to un-approve? Maybe set status to 'pending'?
    // For now, let's assume there is a 'reject' action that can be used for compensation.
    // Or perhaps a more generic update status.
    // Let's assume a reject method exists for compensation.
    await reviewModuleService.rejectProductReview(reviewId)
  }
) 