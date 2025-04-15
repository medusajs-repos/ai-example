import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { deleteProductReviewWorkflow } from "../../../../workflows/product-review/workflows/delete-product-review";
import { updateProductReviewWorkflow } from "../../../../workflows/product-review/workflows/update-product-review";
import { AdminGetReviewParamsType, AdminUpdateReviewType } from "../validators";

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetReviewParamsType>,
  res: MedusaResponse
) => {
  const { review_id } = req.params;
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

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateReviewType>,
  res: MedusaResponse
) => {
  const { review_id } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  await updateProductReviewWorkflow.run({
    input: {
      id: review_id,
      ...req.validatedBody,
    },
    container: req.scope,
  });

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

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { review_id } = req.params;

  const workflow = deleteProductReviewWorkflow(req.scope);

  await workflow.run({
    input: [review_id],
  });

  res.status(200).json({
    id: review_id,
    object: "product_review",
    deleted: true,
  });
};
