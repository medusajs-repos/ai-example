import {
    createWorkflow,
    WorkflowData,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"
import { rejectProductReviewStep } from "../steps/reject-product-review"

type WorkflowInput = { id: string }

export const rejectProductReviewWorkflow = createWorkflow(
  "reject-product-review-workflow",
  (input: WorkflowData<WorkflowInput>) => {
    const review = rejectProductReviewStep(input)
    return new WorkflowResponse(review)
  }
) 