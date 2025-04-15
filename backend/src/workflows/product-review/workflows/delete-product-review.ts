import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { deleteProductReviewStep } from "../steps/delete-product-review";

export const deleteProductReviewWorkflow = createWorkflow(
  "delete-product-review-workflow",
  (input: string[]) => {
    deleteProductReviewStep(input);

    return new WorkflowResponse(void 0);
  }
);
