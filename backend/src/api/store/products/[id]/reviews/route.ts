import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createProductReviewWorkflow } from "../../../../../workflows/product-review/workflows";
import {
  StoreCreateProductReviewType,
  StoreGetProductReviewsParamsType,
} from "../../../reviews/validators";

export const GET = async (
  req: MedusaRequest<StoreGetProductReviewsParamsType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: reviews, metadata } = await query.graph({
    entity: "product_review",
    fields: req.queryConfig.fields,
    filters: { ...req.filterableFields, product_id: id },
    pagination: req.queryConfig.pagination,
  });

  res.json({
    reviews,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  });
};

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreCreateProductReviewType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const { customer_id } = req.auth_context.app_metadata as {
    customer_id: string;
  };

  const workflow = createProductReviewWorkflow(req.scope);

  const { result: review } = await workflow.run({
    input: {
      ...req.validatedBody,
      product_id: id,
      customer_id,
    },
  });

  res.status(201).json({ review });
};
