import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { PRODUCT_REVIEW_MODULE } from "../../../modules/product-review";
import {
  IProductReviewModuleService,
  ModuleUpdateProductReview,
} from "../../../types/product-review";

export type UpdateProductReviewStepInput = ModuleUpdateProductReview;

export const updateProductReviewStep = createStep(
  "update-product-review-step",
  async (input: UpdateProductReviewStepInput, { container }) => {
    const reviewModuleService = container.resolve<IProductReviewModuleService>(
      PRODUCT_REVIEW_MODULE
    );

    // Get original review before update
    const originalReview = await reviewModuleService.retrieveProductReview(
      input.id
    );

    const [review] = await reviewModuleService.updateProductReviews([input]);

    return new StepResponse(review, originalReview);
  },
  async (originalData, { container }) => {
    if (!originalData) {
      return;
    }

    const reviewModuleService = container.resolve<IProductReviewModuleService>(
      PRODUCT_REVIEW_MODULE
    );

    // Restore original review data
    await reviewModuleService.updateProductReviews([{ ...originalData }]);
  }
);
