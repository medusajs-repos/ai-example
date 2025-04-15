import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { ModuleUpdateProductReview } from "../../../types";
import { updateProductReviewStep } from "../steps/update-product-review";

export const updateProductReviewWorkflow = createWorkflow(
  "update-product-review-workflow",
  (input: ModuleUpdateProductReview) => {
    const review = updateProductReviewStep(input);

    return new WorkflowResponse(review);
  }
);
