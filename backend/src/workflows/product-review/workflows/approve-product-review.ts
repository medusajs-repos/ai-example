import {
    createWorkflow,
    WorkflowData,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"
import { approveProductReviewStep } from "../steps/approve-product-review"
  
type WorkflowInput = { id: string }

export const approveProductReviewWorkflow = createWorkflow(
  "approve-product-review-workflow",
  (input: WorkflowData<WorkflowInput>) => {
    const review = approveProductReviewStep(input)
    return new WorkflowResponse(review)
  }
) 