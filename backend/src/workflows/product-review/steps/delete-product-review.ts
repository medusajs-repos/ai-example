import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { PRODUCT_REVIEW_MODULE } from "../../../modules/product-review";
import { IProductReviewModuleService } from "../../../types/product-review";

export const deleteProductReviewStep = createStep(
  "delete-product-review-step",
  async (ids: string[], { container }) => {
    const reviewModuleService = container.resolve<IProductReviewModuleService>(
      PRODUCT_REVIEW_MODULE
    );

    const reviewsToDelete = await reviewModuleService.listProductReviews({
      id: ids,
    });

    await reviewModuleService.softDeleteProductReviews(ids);

    return new StepResponse(undefined, reviewsToDelete);
  },
  async (reviewsToRestore, { container }) => {
    if (!reviewsToRestore?.length) {
      return;
    }

    const reviewModuleService = container.resolve<IProductReviewModuleService>(
      PRODUCT_REVIEW_MODULE
    );

    await reviewModuleService.restoreProductReviews(
      reviewsToRestore.map((r) => r.id)
    );
  }
);
