import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { rejectProductReviewWorkflow } from "../../../../../workflows/product-review/workflows/reject-product-review";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { review_id } = req.params;

  await rejectProductReviewWorkflow(req.scope).run({
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