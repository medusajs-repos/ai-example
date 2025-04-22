import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { ModuleCreateProductReview } from "../../../types";
import { createProductReviewStep } from "../steps/create-product-review";

export const createProductReviewWorkflow = createWorkflow(
  "create-product-review-workflow",
  (input: ModuleCreateProductReview) => {
    // Validate product exists by fetching product id and passing throwIfKeyNotFound: true
    useQueryGraphStep({
      entity: "product",
      fields: ["id"],
      filters: { id: input.product_id },
      options: {
        // throws if primary key is not found
        throwIfKeyNotFound: true,
      },
    }).config({ name: "product-query" });

    // Validate customer exists by fetching customer id and passing throwIfKeyNotFound: true
    useQueryGraphStep({
      entity: "customer",
      fields: ["id"],
      filters: { id: input.customer_id },
      options: {
        // throws if primary key is not found
        throwIfKeyNotFound: true,
      },
    }).config({ name: "customer-query" });

    const review = createProductReviewStep(input);

    return new WorkflowResponse(review);
  }
);
