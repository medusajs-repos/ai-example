import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { PRODUCT_REVIEW_MODULE } from "../../../modules/product-review";
import {
  IProductReviewModuleService,
  ModuleCreateProductReview,
} from "../../../types/product-review";

export type CreateProductReviewStepInput = ModuleCreateProductReview;

export const createProductReviewStep = createStep(
  "create-product-review-step",
  async (input: CreateProductReviewStepInput, { container }) => {
    const reviewModuleService = container.resolve<IProductReviewModuleService>(
      PRODUCT_REVIEW_MODULE
    );

    const review = await reviewModuleService.createProductReviews(input);

    return new StepResponse(review, review.id);
  },
  async (reviewId, { container }) => {
    if (!reviewId) {
      return;
    }

    const reviewModuleService = container.resolve<IProductReviewModuleService>(
      PRODUCT_REVIEW_MODULE
    );

    await reviewModuleService.deleteProductReviews([reviewId]);
  }
);
