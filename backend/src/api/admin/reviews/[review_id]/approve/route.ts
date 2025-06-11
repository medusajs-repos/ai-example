import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { approveProductReviewWorkflow } from "../../../../../workflows/product-review/workflows/approve-product-review";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { review_id } = req.params;

  await approveProductReviewWorkflow(req.scope).run({
    input: {
      id: review_id,
    },
  });

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [review],
  } = await query.graph(
    {
      entity: "product_review",
      fields: req.queryConfig.fields,
      filters: { id: review_id },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ review });
}; 